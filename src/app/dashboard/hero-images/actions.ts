'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireActiveBusiness, type BusinessRow } from '@/lib/activeBusiness';
import { MAX_HERO_IMAGES } from './constants';

export type HeroImagesState = {
  success: boolean;
  message: string;
} | null;

const MAX_UPLOAD_BYTES = 250 * 1024;
const STORAGE_BUCKET = 'images';

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

function existingHeroes(business: BusinessRow): string[] {
  return Array.isArray(business.hero_images)
    ? business.hero_images.filter(Boolean)
    : [];
}

export async function addHeroImageAction(
  _prev: HeroImagesState,
  formData: FormData,
): Promise<HeroImagesState> {
  const ctx = await requireActiveBusiness();
  if (!ctx) {
    return {
      success: false,
      message: 'Please create or pick a business first.',
    };
  }
  const { business } = ctx;
  const supabase = await createClient();

  const existing = existingHeroes(business);
  if (existing.length >= MAX_HERO_IMAGES) {
    return {
      success: false,
      message: `You already have ${MAX_HERO_IMAGES} images. Delete one first.`,
    };
  }

  const rawFiles = formData.getAll('image_files');
  const files = rawFiles.filter(
    (f): f is File => f instanceof File && f.size > 0,
  );

  if (files.length === 0) {
    return { success: false, message: 'Please choose at least one image.' };
  }

  const remainingSlots = MAX_HERO_IMAGES - existing.length;
  if (files.length > remainingSlots) {
    return {
      success: false,
      message: `You can add ${remainingSlots} more image${
        remainingSlots === 1 ? '' : 's'
      }, but you picked ${files.length}.`,
    };
  }

  for (const file of files) {
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        message: `"${file.name}" is not an image. Use JPG, PNG, or WebP.`,
      };
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      const kb = Math.round(file.size / 1024);
      return {
        success: false,
        message: `"${file.name}" is ${kb} KB. The limit is 100 KB each.`,
      };
    }
  }

  const uploadedUrls: string[] = [];
  for (const file of files) {
    const ext = extensionFromMime(file.type);
    const path = `hero/${business.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      // Roll back any files we already uploaded in this batch.
      for (const url of uploadedUrls) {
        const p = pathFromPublicUrl(url);
        if (p) await supabase.storage.from(STORAGE_BUCKET).remove([p]);
      }
      return {
        success: false,
        message: `Upload failed for "${file.name}": ${uploadError.message}`,
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);
    uploadedUrls.push(publicUrlData.publicUrl);
  }

  const next = [...existing, ...uploadedUrls];
  const { error: updateError } = await supabase
    .from('businesses')
    .update({ hero_images: next })
    .eq('id', business.id);

  if (updateError) {
    // Roll back uploads if the DB update failed so we don't leave orphans.
    for (const url of uploadedUrls) {
      const p = pathFromPublicUrl(url);
      if (p) await supabase.storage.from(STORAGE_BUCKET).remove([p]);
    }
    return { success: false, message: updateError.message };
  }

  revalidatePath('/dashboard/hero-images');
  if (business.slug) revalidatePath(`/${business.slug}`);
  return {
    success: true,
    message:
      uploadedUrls.length === 1
        ? 'Image added.'
        : `${uploadedUrls.length} images added.`,
  };
}

export async function deleteHeroImageAction(formData: FormData): Promise<void> {
  const ctx = await requireActiveBusiness();
  if (!ctx) return;
  const { business } = ctx;
  const supabase = await createClient();

  const url = (formData.get('url') as string) || '';
  if (!url) return;

  const existing = existingHeroes(business);
  const next = existing.filter((u) => u !== url);

  await supabase
    .from('businesses')
    .update({ hero_images: next })
    .eq('id', business.id);

  const path = pathFromPublicUrl(url);
  if (path) {
    await supabase.storage.from(STORAGE_BUCKET).remove([path]);
  }

  revalidatePath('/dashboard/hero-images');
  if (business.slug) revalidatePath(`/${business.slug}`);
}
