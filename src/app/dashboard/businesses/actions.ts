'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { ACTIVE_BUSINESS_COOKIE } from '@/lib/activeBusiness';

const STORAGE_BUCKET = 'images';

export type OwnerBusinessFormState = {
  success: boolean;
  message: string;
  slug?: string;
  id?: string;
} | null;

export type OwnerBusinessDeleteState = {
  success: boolean;
  message: string;
} | null;

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

async function setActiveCookie(businessId: string) {
  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_BUSINESS_COOKIE, businessId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}

async function clearActiveCookieIf(businessId: string) {
  const cookieStore = await cookies();
  const current = cookieStore.get(ACTIVE_BUSINESS_COOKIE)?.value;
  if (current === businessId) {
    cookieStore.delete(ACTIVE_BUSINESS_COOKIE);
  }
}

/* -------------------------------------------------------------------------- */
/* Switch active business                                                      */
/* -------------------------------------------------------------------------- */

export async function setActiveBusinessAction(formData: FormData): Promise<void> {
  const id = ((formData.get('business_id') as string) || '').trim();
  const redirectToRaw = ((formData.get('redirect_to') as string) || '').trim();
  const redirectTo =
    redirectToRaw && redirectToRaw.startsWith('/') ? redirectToRaw : '/dashboard';

  if (!id) redirect(redirectTo);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Make sure the business actually belongs to this user before we trust the id.
  const { data: biz } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', id)
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!biz) redirect(redirectTo);

  await setActiveCookie(id);
  revalidatePath('/dashboard', 'layout');
  redirect(redirectTo);
}

/* -------------------------------------------------------------------------- */
/* Create business                                                             */
/* -------------------------------------------------------------------------- */

export async function createOwnerBusinessAction(
  _prev: OwnerBusinessFormState,
  formData: FormData,
): Promise<OwnerBusinessFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Please log in again.' };

  const name = ((formData.get('name') as string) || '').trim();
  const slugRaw = ((formData.get('slug') as string) || '').trim();
  const templateId = ((formData.get('template_id') as string) || 'travel').trim();

  if (!name) return { success: false, message: 'Business name is required.' };
  if (!slugRaw) {
    return { success: false, message: 'Landing page URL is required.' };
  }

  const slug = normalizeSlug(slugRaw);
  if (!slug) {
    return {
      success: false,
      message: 'Landing page URL must contain letters or numbers.',
    };
  }

  const { data: inserted, error } = await supabase
    .from('businesses')
    .insert({
      owner_id: user.id,
      name,
      slug,
      template_id: templateId,
      hero_images: [],
    })
    .select('id, slug')
    .single();

  if (error || !inserted) {
    const raw = error?.message || 'Failed to create business.';
    const msg = /duplicate|unique/i.test(raw)
      ? `That landing page URL ("${slug}") is already taken — try another.`
      : raw;
    return { success: false, message: msg };
  }

  // Switch the new business in immediately so the rest of the dashboard
  // points at it.
  await setActiveCookie(inserted.id);

  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/businesses');
  revalidatePath(`/${slug}`);

  return {
    success: true,
    message: `Created "${name}".`,
    slug,
    id: inserted.id,
  };
}

/* -------------------------------------------------------------------------- */
/* Update business                                                             */
/* -------------------------------------------------------------------------- */

export async function updateOwnerBusinessAction(
  _prev: OwnerBusinessFormState,
  formData: FormData,
): Promise<OwnerBusinessFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Please log in again.' };

  const id = ((formData.get('id') as string) || '').trim();
  const name = ((formData.get('name') as string) || '').trim();
  const slugRaw = ((formData.get('slug') as string) || '').trim();
  const templateId = ((formData.get('template_id') as string) || 'travel').trim();

  if (!id) return { success: false, message: 'Missing business id.' };
  if (!name) return { success: false, message: 'Business name is required.' };
  if (!slugRaw) {
    return { success: false, message: 'Landing page URL is required.' };
  }

  const slug = normalizeSlug(slugRaw);
  if (!slug) {
    return {
      success: false,
      message: 'Landing page URL must contain letters or numbers.',
    };
  }

  const { data: existing } = await supabase
    .from('businesses')
    .select('id, slug, owner_id')
    .eq('id', id)
    .maybeSingle();

  if (!existing || existing.owner_id !== user.id) {
    return { success: false, message: "That business doesn't exist." };
  }

  const { error } = await supabase
    .from('businesses')
    .update({ name, slug, template_id: templateId })
    .eq('id', id);

  if (error) {
    const msg = /duplicate|unique/i.test(error.message)
      ? `That landing page URL ("${slug}") is already taken — try another.`
      : error.message;
    return { success: false, message: msg };
  }

  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/businesses');
  revalidatePath(`/${slug}`);
  if (existing.slug && existing.slug !== slug) {
    revalidatePath(`/${existing.slug}`);
  }

  return { success: true, message: `Saved "${name}".`, slug, id };
}

/* -------------------------------------------------------------------------- */
/* Delete business                                                             */
/* -------------------------------------------------------------------------- */

export async function deleteOwnerBusinessAction(
  _prev: OwnerBusinessDeleteState,
  formData: FormData,
): Promise<OwnerBusinessDeleteState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Please log in again.' };

  const id = ((formData.get('id') as string) || '').trim();
  if (!id) return { success: false, message: 'Missing business id.' };

  const { data: biz } = await supabase
    .from('businesses')
    .select('id, slug, hero_images, owner_id')
    .eq('id', id)
    .maybeSingle();

  if (!biz || biz.owner_id !== user.id) {
    return { success: false, message: "That business doesn't exist." };
  }

  // Pull service image URLs for storage cleanup (best effort).
  const { data: services } = await supabase
    .from('services')
    .select('image_url')
    .eq('business_id', id);

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
    await supabase.storage.from(STORAGE_BUCKET).remove(pathsToRemove);
  }

  // Delete dependent rows explicitly (works whether or not FKs cascade).
  await supabase.from('bookings').delete().eq('business_id', id);
  await supabase.from('inquiries').delete().eq('business_id', id);
  await supabase.from('payment_settings').delete().eq('business_id', id);
  await supabase.from('services').delete().eq('business_id', id);

  const { error } = await supabase.from('businesses').delete().eq('id', id);
  if (error) return { success: false, message: error.message };

  await clearActiveCookieIf(id);

  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/businesses');
  if (biz.slug) revalidatePath(`/${biz.slug}`);

  return { success: true, message: 'Business deleted.' };
}
