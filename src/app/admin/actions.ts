'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export type CloneBusinessState = {
  success: boolean;
  message: string;
  slug?: string;
} | null;

const STORAGE_BUCKET = 'images';

function normalizeSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function pathFromPublicUrl(publicUrl: string | null): string | null {
  if (!publicUrl) return null;
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return publicUrl.slice(i + marker.length);
}

function buildPublicUrlFrom(originalUrl: string, newPath: string): string {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const i = originalUrl.indexOf(marker);
  if (i === -1) return originalUrl;
  return originalUrl.slice(0, i + marker.length) + newPath;
}

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return { supabase, user, isAdmin: profile?.role === 'admin' };
}

/**
 * Copies a single file in the `images` bucket from one path to another.
 * Returns the new public URL, or the original URL if the copy could not be
 * performed (so we still leave the cloned business with a working image link).
 */
async function copyStorageFile(
  admin: ReturnType<typeof createAdminClient>,
  originalUrl: string,
  newPath: string,
): Promise<string> {
  const oldPath = pathFromPublicUrl(originalUrl);
  if (!oldPath) return originalUrl;

  const { error } = await admin.storage
    .from(STORAGE_BUCKET)
    .copy(oldPath, newPath);

  if (error) {
    // Fall back to the original URL — the cloned business will share the file
    // with the source until the new owner replaces it.
    return originalUrl;
  }

  return buildPublicUrlFrom(originalUrl, newPath);
}

export async function cloneBusinessAction(
  _prev: CloneBusinessState,
  formData: FormData,
): Promise<CloneBusinessState> {
  const { user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) {
    return { success: false, message: 'Admin access required.' };
  }

  // Use the service-role client for the actual clone work so RLS doesn't
  // block inserts/updates that target rows the admin does not own
  // (e.g. services on the new business). The admin check above gates this.
  const admin = createAdminClient();

  const sourceId = (formData.get('source_id') as string)?.trim() || '';
  const targetUserId = (formData.get('target_user_id') as string)?.trim() || '';
  const newName = ((formData.get('new_name') as string) || '').trim();
  const slugRaw = ((formData.get('new_slug') as string) || '').trim();

  if (!sourceId) return { success: false, message: 'Source business is missing.' };
  if (!targetUserId) {
    return { success: false, message: 'Please pick the user to assign to.' };
  }
  if (!newName) {
    return { success: false, message: 'Please enter a name for the new business.' };
  }
  if (!slugRaw) {
    return { success: false, message: 'Please enter a landing page URL.' };
  }

  const newSlug = normalizeSlug(slugRaw);
  if (!newSlug) {
    return {
      success: false,
      message: 'The landing page URL must contain letters or numbers.',
    };
  }

  // Make sure the target user exists.
  const { data: targetUser } = await admin
    .from('users')
    .select('id, email')
    .eq('id', targetUserId)
    .maybeSingle();
  if (!targetUser) {
    return { success: false, message: 'That user no longer exists.' };
  }

  // Each owner can only have one business in this app.
  const { data: alreadyOwns } = await admin
    .from('businesses')
    .select('id')
    .eq('owner_id', targetUserId)
    .maybeSingle();
  if (alreadyOwns) {
    return {
      success: false,
      message: `${targetUser.email} already owns a business. Reassign or delete it first.`,
    };
  }

  // Slug must be unique platform-wide.
  const { data: slugTaken } = await admin
    .from('businesses')
    .select('id')
    .eq('slug', newSlug)
    .maybeSingle();
  if (slugTaken) {
    return {
      success: false,
      message: `That landing page URL ("${newSlug}") is already taken.`,
    };
  }

  // Pull the full source business.
  const { data: source } = await admin
    .from('businesses')
    .select('*')
    .eq('id', sourceId)
    .maybeSingle();
  if (!source) {
    return { success: false, message: 'The source business no longer exists.' };
  }

  // Build the new business row by copying everything except identity fields.
  const sourceRow = source as Record<string, unknown>;
  const skipKeys = new Set([
    'id',
    'owner_id',
    'slug',
    'name',
    'created_at',
    'updated_at',
    'hero_images',
  ]);
  const newBusiness: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(sourceRow)) {
    if (!skipKeys.has(k)) newBusiness[k] = v;
  }
  newBusiness.owner_id = targetUserId;
  newBusiness.name = newName;
  newBusiness.slug = newSlug;
  newBusiness.hero_images = [];

  const { data: inserted, error: insertError } = await admin
    .from('businesses')
    .insert(newBusiness)
    .select('id, slug')
    .single();

  if (insertError || !inserted) {
    const msg = insertError?.message || 'Failed to create the cloned business.';
    return { success: false, message: msg };
  }

  const newBusinessId = inserted.id as string;

  // ---- Clone hero images (storage copy + new URLs) ----
  const sourceHeroes: string[] = Array.isArray(source.hero_images)
    ? (source.hero_images as string[]).filter(Boolean)
    : [];

  const clonedHeroes: string[] = [];
  for (const url of sourceHeroes) {
    const oldPath = pathFromPublicUrl(url);
    if (oldPath) {
      const ext = oldPath.split('.').pop() || 'jpg';
      const newPath = `hero/${newBusinessId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const newUrl = await copyStorageFile(admin, url, newPath);
      clonedHeroes.push(newUrl);
    } else {
      clonedHeroes.push(url);
    }
  }

  if (clonedHeroes.length > 0) {
    await admin
      .from('businesses')
      .update({ hero_images: clonedHeroes })
      .eq('id', newBusinessId);
  }

  // ---- Clone services ----
  const { data: sourceServices } = await admin
    .from('services')
    .select('*')
    .eq('business_id', sourceId);

  if (sourceServices && sourceServices.length > 0) {
    const serviceRows: Record<string, unknown>[] = [];

    for (const svc of sourceServices) {
      const svcRow = svc as Record<string, unknown>;
      const next: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(svcRow)) {
        if (k === 'id' || k === 'created_at' || k === 'updated_at') continue;
        next[k] = v;
      }
      next.business_id = newBusinessId;

      const oldImg = (svcRow.image_url as string) || '';
      if (oldImg) {
        const oldPath = pathFromPublicUrl(oldImg);
        if (oldPath) {
          const ext = oldPath.split('.').pop() || 'jpg';
          const newPath = `services/${newBusinessId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
          next.image_url = await copyStorageFile(admin, oldImg, newPath);
        }
      }

      serviceRows.push(next);
    }

    if (serviceRows.length > 0) {
      const { error: svcError } = await admin.from('services').insert(serviceRows);
      if (svcError) {
        // Don't bail — the business itself is already created. Surface a warning.
        revalidatePath('/admin');
        return {
          success: true,
          message: `Business cloned, but some services failed to copy: ${svcError.message}`,
          slug: newSlug,
        };
      }
    }
  }

  // ---- Clone payment settings ----
  const { data: sourcePayment } = await admin
    .from('payment_settings')
    .select('*')
    .eq('business_id', sourceId)
    .maybeSingle();

  if (sourcePayment) {
    const payRow = sourcePayment as Record<string, unknown>;
    const next: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(payRow)) {
      if (k === 'id' || k === 'created_at' || k === 'updated_at') continue;
      next[k] = v;
    }
    next.business_id = newBusinessId;

    await admin
      .from('payment_settings')
      .upsert(next, { onConflict: 'business_id' });
  }

  revalidatePath('/admin');
  revalidatePath(`/${newSlug}`);
  return {
    success: true,
    message: `Cloned to ${targetUser.email} as "${newName}".`,
    slug: newSlug,
  };
}

// ---------------------------------------------------------------------------
// Admin business CRUD (create / update / delete)
// ---------------------------------------------------------------------------

export type BusinessFormState = {
  success: boolean;
  message: string;
  slug?: string;
} | null;

export type BusinessDeleteState = {
  success: boolean;
  message: string;
} | null;

export async function createBusinessAction(
  _prev: BusinessFormState,
  formData: FormData,
): Promise<BusinessFormState> {
  const { user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) {
    return { success: false, message: 'Admin access required.' };
  }
  const admin = createAdminClient();

  const ownerId = ((formData.get('owner_id') as string) || '').trim();
  const name = ((formData.get('name') as string) || '').trim();
  const slugRaw = ((formData.get('slug') as string) || '').trim();
  const templateId = ((formData.get('template_id') as string) || 'travel').trim();

  if (!ownerId) return { success: false, message: 'Please pick the owner.' };
  if (!name) return { success: false, message: 'Business name is required.' };
  if (!slugRaw) return { success: false, message: 'Landing page URL is required.' };

  const slug = normalizeSlug(slugRaw);
  if (!slug) {
    return {
      success: false,
      message: 'Landing page URL must contain letters or numbers.',
    };
  }

  const { data: targetUser } = await admin
    .from('users')
    .select('id, email')
    .eq('id', ownerId)
    .maybeSingle();
  if (!targetUser) return { success: false, message: 'That user no longer exists.' };

  const { data: alreadyOwns } = await admin
    .from('businesses')
    .select('id')
    .eq('owner_id', ownerId)
    .maybeSingle();
  if (alreadyOwns) {
    return {
      success: false,
      message: `${targetUser.email} already owns a business.`,
    };
  }

  const { data: slugTaken } = await admin
    .from('businesses')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();
  if (slugTaken) {
    return {
      success: false,
      message: `That landing page URL ("${slug}") is already taken.`,
    };
  }

  const { error } = await admin.from('businesses').insert({
    owner_id: ownerId,
    name,
    slug,
    template_id: templateId,
    hero_images: [],
  });

  if (error) return { success: false, message: error.message };

  revalidatePath('/admin');
  revalidatePath('/admin/businesses');
  revalidatePath(`/${slug}`);
  return {
    success: true,
    message: `Created "${name}" for ${targetUser.email}.`,
    slug,
  };
}

export async function adminUpdateBusinessAction(
  _prev: BusinessFormState,
  formData: FormData,
): Promise<BusinessFormState> {
  const { user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) {
    return { success: false, message: 'Admin access required.' };
  }
  const admin = createAdminClient();

  const id = ((formData.get('id') as string) || '').trim();
  const ownerId = ((formData.get('owner_id') as string) || '').trim();
  const name = ((formData.get('name') as string) || '').trim();
  const slugRaw = ((formData.get('slug') as string) || '').trim();
  const templateId = ((formData.get('template_id') as string) || 'travel').trim();

  if (!id) return { success: false, message: 'Missing business id.' };
  if (!ownerId) return { success: false, message: 'Please pick the owner.' };
  if (!name) return { success: false, message: 'Business name is required.' };
  if (!slugRaw) return { success: false, message: 'Landing page URL is required.' };

  const slug = normalizeSlug(slugRaw);
  if (!slug) {
    return {
      success: false,
      message: 'Landing page URL must contain letters or numbers.',
    };
  }

  const { data: existing } = await admin
    .from('businesses')
    .select('id, slug, owner_id')
    .eq('id', id)
    .maybeSingle();
  if (!existing) return { success: false, message: 'That business no longer exists.' };

  // If owner is being changed, make sure the new owner doesn't already have one.
  if (ownerId !== existing.owner_id) {
    const { data: targetUser } = await admin
      .from('users')
      .select('id, email')
      .eq('id', ownerId)
      .maybeSingle();
    if (!targetUser) return { success: false, message: 'That user no longer exists.' };

    const { data: alreadyOwns } = await admin
      .from('businesses')
      .select('id')
      .eq('owner_id', ownerId)
      .neq('id', id)
      .maybeSingle();
    if (alreadyOwns) {
      return {
        success: false,
        message: `${targetUser.email} already owns a business.`,
      };
    }
  }

  // Slug uniqueness across other businesses.
  if (slug !== existing.slug) {
    const { data: slugTaken } = await admin
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .maybeSingle();
    if (slugTaken) {
      return {
        success: false,
        message: `That landing page URL ("${slug}") is already taken.`,
      };
    }
  }

  const { error } = await admin
    .from('businesses')
    .update({ owner_id: ownerId, name, slug, template_id: templateId })
    .eq('id', id);

  if (error) return { success: false, message: error.message };

  revalidatePath('/admin');
  revalidatePath('/admin/businesses');
  revalidatePath(`/${slug}`);
  if (existing.slug && existing.slug !== slug) {
    revalidatePath(`/${existing.slug}`);
  }
  return { success: true, message: `Saved "${name}".`, slug };
}

export async function adminDeleteBusinessAction(
  _prev: BusinessDeleteState,
  formData: FormData,
): Promise<BusinessDeleteState> {
  const { user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) {
    return { success: false, message: 'Admin access required.' };
  }
  const admin = createAdminClient();

  const id = ((formData.get('id') as string) || '').trim();
  if (!id) return { success: false, message: 'Missing business id.' };

  const { data: biz } = await admin
    .from('businesses')
    .select('id, slug, hero_images')
    .eq('id', id)
    .maybeSingle();
  if (!biz) return { success: false, message: 'That business no longer exists.' };

  // Pull service image URLs so we can also clean up storage best-effort.
  const { data: services } = await admin
    .from('services')
    .select('image_url')
    .eq('business_id', id);

  // Remove storage files (best effort — never block the delete).
  const pathsToRemove: string[] = [];
  const heroes: string[] = Array.isArray(biz.hero_images)
    ? (biz.hero_images as string[]).filter(Boolean)
    : [];
  for (const url of heroes) {
    const p = pathFromPublicUrl(url);
    if (p) pathsToRemove.push(p);
  }
  for (const svc of services || []) {
    const url = (svc as { image_url: string | null }).image_url;
    if (url) {
      const p = pathFromPublicUrl(url);
      if (p) pathsToRemove.push(p);
    }
  }
  if (pathsToRemove.length > 0) {
    await admin.storage.from(STORAGE_BUCKET).remove(pathsToRemove);
  }

  // Delete dependent rows explicitly (works whether or not FKs cascade).
  await admin.from('bookings').delete().eq('business_id', id);
  await admin.from('inquiries').delete().eq('business_id', id);
  await admin.from('payment_settings').delete().eq('business_id', id);
  await admin.from('services').delete().eq('business_id', id);

  const { error } = await admin.from('businesses').delete().eq('id', id);
  if (error) return { success: false, message: error.message };

  revalidatePath('/admin');
  revalidatePath('/admin/businesses');
  if (biz.slug) revalidatePath(`/${biz.slug}`);
  return { success: true, message: 'Business deleted.' };
}
