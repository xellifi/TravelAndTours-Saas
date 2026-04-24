'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireActiveBusiness } from '@/lib/activeBusiness';

export type ServiceFormState = {
  success: boolean;
  message: string;
} | null;

const MAX_UPLOAD_BYTES = 100 * 1024;
const STORAGE_BUCKET = 'images';

function parseOptionalNumber(raw: FormDataEntryValue | null): number | null {
  if (raw === null) return null;
  const s = String(raw).trim();
  if (s === '') return null;
  const n = Number(s);
  return isNaN(n) ? null : n;
}

function extensionFromMime(mime: string): string {
  if (mime === 'image/jpeg' || mime === 'image/jpg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/gif') return 'gif';
  return 'bin';
}

function pathFromPublicUrl(publicUrl: string): string | null {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`;
  const i = publicUrl.indexOf(marker);
  if (i === -1) return null;
  return publicUrl.slice(i + marker.length);
}

export async function addServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const ctx = await requireActiveBusiness();
  if (!ctx) {
    return {
      success: false,
      message: 'Please create or pick a business first.',
    };
  }
  const { business } = ctx;
  const supabase = await createClient();

  const name = (formData.get('name') as string)?.trim();
  if (!name) return { success: false, message: 'Service name is required.' };

  const description = ((formData.get('description') as string) || '').trim();
  const priceMin = parseOptionalNumber(formData.get('price_min'));
  const priceMax = parseOptionalNumber(formData.get('price_max'));

  if (priceMin !== null && priceMax !== null && priceMax < priceMin) {
    return {
      success: false,
      message: 'The "to" price must be greater than or equal to the "from" price.',
    };
  }

  let imageUrl: string | null = null;
  const imageMode = (formData.get('image_mode') as string) || 'url';

  if (imageMode === 'upload') {
    const file = formData.get('image_file');
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        return { success: false, message: 'Please upload an image file.' };
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        const kb = Math.round(file.size / 1024);
        return {
          success: false,
          message: `That image is ${kb} KB. The limit is 100 KB.`,
        };
      }

      const ext = extensionFromMime(file.type);
      const path = `services/${business.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return { success: false, message: `Upload failed: ${uploadError.message}` };
      }

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    }
  } else {
    imageUrl = ((formData.get('image_url') as string) || '').trim() || null;
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

export async function updateServiceAction(
  _prev: ServiceFormState,
  formData: FormData,
): Promise<ServiceFormState> {
  const ctx = await requireActiveBusiness();
  if (!ctx) {
    return {
      success: false,
      message: 'Please create or pick a business first.',
    };
  }
  const { business } = ctx;
  const supabase = await createClient();

  const id = (formData.get('id') as string) || '';
  if (!id) return { success: false, message: 'Missing service id.' };

  // Make sure the service belongs to the active business before touching it.
  const { data: existing } = await supabase
    .from('services')
    .select('id, image_url, business_id')
    .eq('id', id)
    .maybeSingle();

  if (!existing || existing.business_id !== business.id) {
    return { success: false, message: 'Service not found.' };
  }

  const name = (formData.get('name') as string)?.trim();
  if (!name) return { success: false, message: 'Service name is required.' };

  const description = ((formData.get('description') as string) || '').trim();
  const priceMin = parseOptionalNumber(formData.get('price_min'));
  const priceMax = parseOptionalNumber(formData.get('price_max'));

  if (priceMin !== null && priceMax !== null && priceMax < priceMin) {
    return {
      success: false,
      message: 'The "to" price must be greater than or equal to the "from" price.',
    };
  }

  // image_mode: 'keep' | 'url' | 'upload' | 'remove'
  const imageMode = (formData.get('image_mode') as string) || 'keep';
  let imageUrl: string | null = existing.image_url || null;
  let oldUploadedUrlToDelete: string | null = null;

  if (imageMode === 'url') {
    const newUrl = ((formData.get('image_url') as string) || '').trim() || null;
    if (newUrl !== existing.image_url && existing.image_url) {
      oldUploadedUrlToDelete = existing.image_url;
    }
    imageUrl = newUrl;
  } else if (imageMode === 'upload') {
    const file = formData.get('image_file');
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith('image/')) {
        return { success: false, message: 'Please upload an image file.' };
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        const kb = Math.round(file.size / 1024);
        return {
          success: false,
          message: `That image is ${kb} KB. The limit is 100 KB.`,
        };
      }

      const ext = extensionFromMime(file.type);
      const path = `services/${business.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        return { success: false, message: `Upload failed: ${uploadError.message}` };
      }

      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
      if (existing.image_url && existing.image_url !== imageUrl) {
        oldUploadedUrlToDelete = existing.image_url;
      }
    }
  } else if (imageMode === 'remove') {
    if (existing.image_url) {
      oldUploadedUrlToDelete = existing.image_url;
    }
    imageUrl = null;
  }

  const legacyPrice = priceMin ?? priceMax ?? 0;

  const { error } = await supabase
    .from('services')
    .update({
      name,
      description,
      image_url: imageUrl,
      price_min: priceMin,
      price_max: priceMax,
      price: legacyPrice,
    })
    .eq('id', id);

  if (error) {
    return { success: false, message: error.message };
  }

  if (oldUploadedUrlToDelete) {
    const oldPath = pathFromPublicUrl(oldUploadedUrlToDelete);
    if (oldPath) {
      await supabase.storage.from(STORAGE_BUCKET).remove([oldPath]);
    }
  }

  revalidatePath('/dashboard/services');
  return { success: true, message: 'Service updated.' };
}

export async function deleteServiceAction(formData: FormData): Promise<void> {
  const ctx = await requireActiveBusiness();
  if (!ctx) return;
  const { business } = ctx;
  const supabase = await createClient();

  const id = formData.get('id') as string;
  if (!id) return;

  const { data: existing } = await supabase
    .from('services')
    .select('image_url, business_id')
    .eq('id', id)
    .maybeSingle();

  if (!existing || existing.business_id !== business.id) return;

  await supabase.from('services').delete().eq('id', id);

  if (existing.image_url) {
    const path = pathFromPublicUrl(existing.image_url);
    if (path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    }
  }

  revalidatePath('/dashboard/services');
}
