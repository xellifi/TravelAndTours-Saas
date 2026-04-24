'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

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

export async function updateBusinessAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'You must be signed in.' };

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

  const { data: existingBiz } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  const payload = {
    name,
    slug,
    template_id: templateId,
    owner_id: user.id,
  };

  let error;
  if (existingBiz) {
    const { error: e } = await supabase
      .from('businesses')
      .update(payload)
      .eq('id', existingBiz.id);
    error = e;
  } else {
    const { error: e } = await supabase.from('businesses').insert(payload);
    error = e;
  }

  if (error) {
    const msg = /duplicate|unique/i.test(error.message)
      ? `That landing page URL ("${slug}") is already taken — try another.`
      : error.message;
    return { success: false, message: msg };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath(`/${slug}`);
  return {
    success: true,
    message: existingBiz
      ? 'Business updated successfully.'
      : 'Business created! You can now configure payment settings below.',
    slug,
  };
}

export async function updatePaymentSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'You must be signed in.' };

  const { data: biz } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!biz) {
    return {
      success: false,
      message: 'Create your business first, then add payment details.',
    };
  }

  const paymentData = {
    business_id: biz.id,
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
