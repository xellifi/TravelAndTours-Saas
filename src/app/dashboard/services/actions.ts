'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type ServiceFormState = {
  success: boolean;
  message: string;
} | null;

function parseOptionalNumber(raw: FormDataEntryValue | null): number | null {
  if (raw === null) return null;
  const s = String(raw).trim();
  if (s === '') return null;
  const n = Number(s);
  return isNaN(n) ? null : n;
}

export async function addServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: 'Please log in again.' };

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) {
    return { success: false, message: 'Please create your business first.' };
  }

  const name = (formData.get('name') as string)?.trim();
  if (!name) return { success: false, message: 'Service name is required.' };

  const description = ((formData.get('description') as string) || '').trim();
  const imageUrl = ((formData.get('image_url') as string) || '').trim() || null;
  const priceMin = parseOptionalNumber(formData.get('price_min'));
  const priceMax = parseOptionalNumber(formData.get('price_max'));

  if (priceMin !== null && priceMax !== null && priceMax < priceMin) {
    return {
      success: false,
      message: 'The "to" price must be greater than or equal to the "from" price.',
    };
  }

  // Keep the legacy `price` column populated so older code paths don't break.
  const legacyPrice = priceMin ?? priceMax ?? 0;

  const { error } = await supabase.from('services').insert({
    business_id: business.id,
    name,
    description,
    image_url: imageUrl,
    price_min: priceMin,
    price_max: priceMax,
    price: legacyPrice,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/dashboard/services');
  return { success: true, message: 'Service added.' };
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const id = formData.get('id') as string;
  if (!id) return;

  await supabase.from('services').delete().eq('id', id);
  revalidatePath('/dashboard/services');
}
