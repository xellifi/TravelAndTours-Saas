'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import {
  addHeroImageAction,
  MAX_HERO_IMAGES,
  type HeroImagesState,
} from './actions';

const MAX_UPLOAD_BYTES = 100 * 1024;

type Props = {
  remainingSlots: number;
};

export default function AddHeroImageForm({ remainingSlots }: Props) {
  const [state, formAction] = useActionState<HeroImagesState, FormData>(
    addHeroImageAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setFileError(null);
    }
  }, [state]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setFileError(null);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setFileError('Please choose an image file (JPG, PNG, or WebP).');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      const kb = Math.round(file.size / 1024);
      setFileError(`That file is ${kb} KB. The limit is 100 KB.`);
      e.target.value = '';
      return;
    }
    setFileError(null);
  }

  if (remainingSlots <= 0) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-800 font-medium flex items-center gap-3">
        <i className="fas fa-info-circle text-amber-500" />
        You've reached the limit of {MAX_HERO_IMAGES} images. Delete one
        to add a new photo.
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5"
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900">Add a Photo</h2>
        <p className="text-sm text-gray-500 mt-1">
          You can add up to <strong>{MAX_HERO_IMAGES}</strong> images.
          {remainingSlots > 0 && (
            <>
              {' '}
              <span className="text-primary-600 font-bold">
                {remainingSlots} slot{remainingSlots === 1 ? '' : 's'} left.
              </span>
            </>
          )}
        </p>
      </div>

      <Alert state={state} />

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Image File
        </label>
        <input
          name="image_file"
          type="file"
          accept="image/*"
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold hover:file:bg-primary-100 cursor-pointer"
        />
        {fileError ? (
          <p className="text-xs text-red-600 mt-2">{fileError}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            <strong>Max file size:</strong> 100&nbsp;KB. JPG, PNG, or WebP.
            <br />
            Tip: a wide landscape photo (e.g. 1200&nbsp;×&nbsp;900&nbsp;px)
            looks best in the hero.
          </p>
        )}
      </div>

      <SubmitButton
        pendingText="Uploading…"
        className="w-full btn-primary py-4 rounded-xl text-white font-bold"
      >
        Upload Image
      </SubmitButton>
    </form>
  );
}
