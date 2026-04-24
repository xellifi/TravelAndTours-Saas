'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { addHeroImageAction, type HeroImagesState } from './actions';
import { MAX_HERO_IMAGES } from './constants';

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
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setFileError(null);
      setSelectedCount(0);
    }
  }, [state]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setFileError(null);
      setSelectedCount(0);
      return;
    }
    if (files.length > remainingSlots) {
      setFileError(
        `You picked ${files.length} files but only ${remainingSlots} slot${
          remainingSlots === 1 ? '' : 's'
        } left.`,
      );
      e.target.value = '';
      setSelectedCount(0);
      return;
    }
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setFileError(
          `"${file.name}" is not an image. Use JPG, PNG, or WebP.`,
        );
        e.target.value = '';
        setSelectedCount(0);
        return;
      }
      if (file.size > MAX_UPLOAD_BYTES) {
        const kb = Math.round(file.size / 1024);
        setFileError(`"${file.name}" is ${kb} KB. The limit is 100 KB each.`);
        e.target.value = '';
        setSelectedCount(0);
        return;
      }
    }
    setFileError(null);
    setSelectedCount(files.length);
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
          Image Files
        </label>
        <input
          name="image_files"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold hover:file:bg-primary-100 cursor-pointer"
        />
        {fileError ? (
          <p className="text-xs text-red-600 mt-2">{fileError}</p>
        ) : (
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            <strong>Max file size:</strong> 100&nbsp;KB each. JPG, PNG, or WebP.
            <br />
            <strong>Recommended size:</strong> 1024&nbsp;×&nbsp;1024&nbsp;px (square).
            <br />
            You can pick several photos at once — hold <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>{' '}
            while clicking files.
            {selectedCount > 0 && (
              <>
                <br />
                <span className="text-primary-700 font-bold">
                  {selectedCount} file{selectedCount === 1 ? '' : 's'} ready to upload.
                </span>
              </>
            )}
          </p>
        )}
      </div>

      <SubmitButton
        pendingText="Uploading…"
        className="w-full btn-primary py-4 rounded-xl text-white font-bold"
      >
        {selectedCount > 1 ? `Upload ${selectedCount} Images` : 'Upload Image'}
      </SubmitButton>
    </form>
  );
}
