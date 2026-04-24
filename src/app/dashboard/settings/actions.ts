'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireActiveBusiness } from '@/lib/activeBusiness';

export type ActionState = {
  success: boolean;
  message: string;
  slug?: string;
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

/**
 * Updates the active business. Creating a brand-new business from scratch
 * happens on /dashboard/businesses now, so this action only updates.
 */
export async function updateBusinessAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireActiveBusiness();
  if (!ctx) {
    return {
      success: false,
      message:
        "You don't have a business yet. Create one from My Businesses first.",
    };
  }
  const { business } = ctx;
  const supabase = await createClient();

  const name = ((formData.get('name') as string) || '').trim();
  const slugRaw = ((formData.get('slug') as string) || '').trim();
  const templateId = (formData.get('template_id') as string) || 'travel';

  if (!name) return { success: false, message: 'Business name is required.' };
  if (!slugRaw) return { success: false, message: 'Landing page URL is required.' };

  const slug = normalizeSlug(slugRaw);
  if (!slug) {
    return {
      success: false,
      message: 'Landing page URL must contain letters or numbers.',
    };
  }

  const previousSlug = business.slug;

  const { error } = await supabase
    .from('businesses')
    .update({ name, slug, template_id: templateId })
    .eq('id', business.id);

  if (error) {
    const msg = /duplicate|unique/i.test(error.message)
      ? `That landing page URL ("${slug}") is already taken — try another.`
      : error.message;
    return { success: false, message: msg };
  }

  revalidatePath('/dashboard', 'layout');
  revalidatePath('/dashboard/settings');
  revalidatePath(`/${slug}`);
  if (previousSlug && previousSlug !== slug) {
    revalidatePath(`/${previousSlug}`);
  }

  return {
    success: true,
    message: 'Business updated successfully.',
    slug,
  };
}

export async function updatePaymentSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ctx = await requireActiveBusiness();
  if (!ctx) {
    return {
      success: false,
      message:
        "You don't have a business yet. Create one from My Businesses first.",
    };
  }
  const { business } = ctx;
  const supabase = await createClient();

  const paymentData = {
    business_id: business.id,
    gcash_name: ((formData.get('gcash_name') as string) || '').trim(),
    gcash_number: ((formData.get('gcash_number') as string) || '').trim(),
    paymaya_name: ((formData.get('paymaya_name') as string) || '').trim(),
    paymaya_number: ((formData.get('paymaya_number') as string) || '').trim(),
    bank_name: ((formData.get('bank_name') as string) || '').trim(),
    bank_account_name: ((formData.get('bank_account_name') as string) || '').trim(),
    bank_account_number: ((formData.get('bank_account_number') as string) || '').trim(),
  };

  const { error } = await supabase
    .from('payment_settings')
    .upsert(paymentData, { onConflict: 'business_id' });

  if (error) return { success: false, message: error.message };

  revalidatePath('/dashboard/settings');
  return { success: true, message: 'Payment details saved.' };
}
