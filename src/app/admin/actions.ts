'use server';

import { createClient } from '@/utils/supabase/server';
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
  supabase: Awaited<ReturnType<typeof createClient>>,
  originalUrl: string,
  newPath: string,
): Promise<string> {
  const oldPath = pathFromPublicUrl(originalUrl);
  if (!oldPath) return originalUrl;

  const { error } = await supabase.storage
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
  const { supabase, user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) {
    return { success: false, message: 'Admin access required.' };
  }

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
  const { data: targetUser } = await supabase
    .from('users')
    .select('id, email')
    .eq('id', targetUserId)
    .maybeSingle();
  if (!targetUser) {
    return { success: false, message: 'That user no longer exists.' };
  }

  // Each owner can only have one business in this app.
  const { data: alreadyOwns } = await supabase
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
  const { data: slugTaken } = await supabase
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
  const { data: source } = await supabase
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

  const { data: inserted, error: insertError } = await supabase
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
      const newUrl = await copyStorageFile(supabase, url, newPath);
      clonedHeroes.push(newUrl);
    } else {
      clonedHeroes.push(url);
    }
  }

  if (clonedHeroes.length > 0) {
    await supabase
      .from('businesses')
      .update({ hero_images: clonedHeroes })
      .eq('id', newBusinessId);
  }

  // ---- Clone services ----
  const { data: sourceServices } = await supabase
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
          next.image_url = await copyStorageFile(supabase, oldImg, newPath);
        }
      }

      serviceRows.push(next);
    }

    if (serviceRows.length > 0) {
      const { error: svcError } = await supabase.from('services').insert(serviceRows);
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
  const { data: sourcePayment } = await supabase
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

    await supabase
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
