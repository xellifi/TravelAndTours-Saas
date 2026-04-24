'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { addServiceAction, type ServiceFormState } from './actions';

const MAX_UPLOAD_BYTES = 100 * 1024;

export default function AddServiceForm() {
  const [state, formAction] = useActionState<ServiceFormState, FormData>(
    addServiceAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setImageMode('url');
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

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-5 sticky top-24"
    >
      <div>
        <h2 className="text-xl font-bold text-gray-900">Add a Service</h2>
        <p className="text-sm text-gray-500 mt-1">
          Show what you offer with a photo and a price range.
        </p>
      </div>

      <Alert state={state} />

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Service Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          required
          placeholder="e.g. Boracay 3D2N Package"
          className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Photo
        </label>

        <div className="inline-flex p-1 bg-gray-100 rounded-xl mb-3">
          <button
            type="button"
            onClick={() => {
              setImageMode('url');
              setFileError(null);
            }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              imageMode === 'url'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Paste URL
          </button>
          <button
            type="button"
            onClick={() => {
              setImageMode('upload');
              setFileError(null);
            }}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              imageMode === 'upload'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500'
            }`}
          >
            Upload
          </button>
        </div>

        <input type="hidden" name="image_mode" value={imageMode} />

        {imageMode === 'url' ? (
          <>
            <input
              name="image_url"
              type="url"
              placeholder="https://…"
              className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
            />
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              Paste a public image link (Supabase Storage, Cloudinary, etc.).
              <br />
              <strong>Recommended size:</strong> 800 × 1000 px (portrait, ratio ~4:5),
              under 500&nbsp;KB. JPG or WebP works best.
            </p>
          </>
        ) : (
          <>
            <input
              name="image_file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border-0 file:bg-primary-50 file:text-primary-700 file:font-semibold hover:file:bg-primary-100 cursor-pointer"
            />
            {fileError ? (
              <p className="text-xs text-red-600 mt-2">{fileError}</p>
            ) : (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                <strong>Max file size:</strong> 100&nbsp;KB. JPG, PNG, or WebP.
                <br />
                Tip: 800 × 1000 px portrait works best.
              </p>
            )}
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Price From (₱)
          </label>
          <input
            name="price_min"
            type="number"
            min="0"
            step="0.01"
            placeholder="1000"
            className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Price To (₱)
          </label>
          <input
            name="price_max"
            type="number"
            min="0"
            step="0.01"
            placeholder="5000"
            className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
          />
        </div>
      </div>
      <p className="text-xs text-gray-500 -mt-2">
        Leave one empty if you only want to show a starting price (e.g. <em>From ₱1,000</em>).
      </p>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Short Description
        </label>
        <textarea
          name="description"
          placeholder="A short blurb shown when visitors hover the card."
          className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none h-28"
        />
      </div>

      <SubmitButton
        pendingText="Adding…"
        className="w-full btn-primary py-4 rounded-xl text-white font-bold"
      >
        Add Service
      </SubmitButton>
    </form>
  );
}
