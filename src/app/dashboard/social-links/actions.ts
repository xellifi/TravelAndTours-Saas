'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { requireActiveBusiness } from '@/lib/activeBusiness';
import {
  getPlatform,
  normalizeUrl,
  readSocialLinks,
  type SocialLinkRecord,
} from '@/lib/socialPlatforms';

export type SocialLinkFormState = {
  success: boolean;
  message: string;
} | null;

const MAX_LINKS = 12;

async function loadCurrent(): Promise<{
  list: SocialLinkRecord[];
  businessId: string;
  slug: string;
} | null> {
  const ctx = await requireActiveBusiness();
  if (!ctx) return null;
  return {
    list: readSocialLinks(ctx.business.social_links),
    businessId: ctx.business.id,
    slug: ctx.business.slug,
  };
}

async function saveList(
  businessId: string,
  list: SocialLinkRecord[],
  slug: string,
): Promise<string | null> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('businesses')
    .update({ social_links: list })
    .eq('id', businessId);
  if (error) return error.message;

  revalidatePath('/dashboard/social-links');
  if (slug) revalidatePath(`/${slug}`);
  return null;
}

/* -------------------------------------------------------------------------- */
/* Add                                                                         */
/* -------------------------------------------------------------------------- */

export async function addSocialLinkAction(
  _prev: SocialLinkFormState,
  formData: FormData,
): Promise<SocialLinkFormState> {
  const ctx = await loadCurrent();
  if (!ctx) {
    return {
      success: false,
      message: 'Please create or pick a business first.',
    };
  }

  const platform = ((formData.get('platform') as string) || '').trim();
  const urlRaw = ((formData.get('url') as string) || '').trim();

  if (!getPlatform(platform)) {
    return { success: false, message: 'Please pick a platform.' };
  }
  const url = normalizeUrl(urlRaw);
  if (!url) {
    return {
      success: false,
      message: 'Please enter a valid link (must start with http:// or https://).',
    };
  }

  if (ctx.list.length >= MAX_LINKS) {
    return {
      success: false,
      message: `You already have ${MAX_LINKS} social links. Delete one first.`,
    };
  }

  const next: SocialLinkRecord[] = [
    ...ctx.list,
    { id: crypto.randomUUID(), platform, url },
  ];

  const err = await saveList(ctx.businessId, next, ctx.slug);
  if (err) return { success: false, message: err };

  return { success: true, message: 'Link added.' };
}

/* -------------------------------------------------------------------------- */
/* Update                                                                      */
/* -------------------------------------------------------------------------- */

export async function updateSocialLinkAction(
  _prev: SocialLinkFormState,
  formData: FormData,
): Promise<SocialLinkFormState> {
  const ctx = await loadCurrent();
  if (!ctx) {
    return {
      success: false,
      message: 'Please create or pick a business first.',
    };
  }

  const id = ((formData.get('id') as string) || '').trim();
  const platform = ((formData.get('platform') as string) || '').trim();
  const urlRaw = ((formData.get('url') as string) || '').trim();

  if (!id) return { success: false, message: 'Missing link id.' };
  if (!getPlatform(platform)) {
    return { success: false, message: 'Please pick a platform.' };
  }
  const url = normalizeUrl(urlRaw);
  if (!url) {
    return {
      success: false,
      message: 'Please enter a valid link (must start with http:// or https://).',
    };
  }

  const idx = ctx.list.findIndex((l) => l.id === id);
  if (idx === -1) {
    return { success: false, message: 'That link no longer exists.' };
  }

  const next = ctx.list.slice();
  next[idx] = { id, platform, url };

  const err = await saveList(ctx.businessId, next, ctx.slug);
  if (err) return { success: false, message: err };

  return { success: true, message: 'Link updated.' };
}

/* -------------------------------------------------------------------------- */
/* Delete                                                                      */
/* -------------------------------------------------------------------------- */

export async function deleteSocialLinkAction(formData: FormData): Promise<void> {
  const ctx = await loadCurrent();
  if (!ctx) return;

  const id = ((formData.get('id') as string) || '').trim();
  if (!id) return;

  const next = ctx.list.filter((l) => l.id !== id);
  if (next.length === ctx.list.length) return;

  await saveList(ctx.businessId, next, ctx.slug);
}
