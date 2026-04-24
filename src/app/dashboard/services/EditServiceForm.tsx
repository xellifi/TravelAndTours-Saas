'use client';

import { useActionState, useEffect, useState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { updateServiceAction, type ServiceFormState } from './actions';

const MAX_UPLOAD_BYTES = 100 * 1024;

type Service = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_min: number | null;
  price_max: number | null;
};

type Props = {
  service: Service;
  onClose: () => void;
};

type ImageMode = 'keep' | 'url' | 'upload' | 'remove';

export default function EditServiceForm({ service, onClose }: Props) {
  const [state, formAction] = useActionState<ServiceFormState, FormData>(
    updateServiceAction,
    null,
  );
  const [imageMode, setImageMode] = useState<ImageMode>(
    service.image_url ? 'keep' : 'url',
  );
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      onClose();
    }
  }, [state, onClose]);

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

  const tabs: { value: ImageMode; label: string; show: boolean }[] = [
    { value: 'keep', label: 'Keep current', show: Boolean(service.image_url) },
    { value: 'url', label: 'Paste URL', show: true },
    { value: 'upload', label: 'Upload', show: true },
    { value: 'remove', label: 'Remove', show: Boolean(service.image_url) },
  ];

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={service.id} />
      <input type="hidden" name="image_mode" value={imageMode} />

      <Alert state={state} />

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Service Name <span className="text-red-500">*</span>
        </label>
        <input
          name="name"
          required
          defaultValue={service.name}
          className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Photo
        </label>

        <div className="inline-flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl mb-3">
          {tabs
            .filter((t) => t.show)
            .map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => {
                  setImageMode(t.value);
                  setFileError(null);
                }}
                className={`px-3.5 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  imageMode === t.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500'
                }`}
              >
                {t.label}
              </button>
            ))}
        </div>

        {imageMode === 'keep' && service.image_url && (
          <p className="text-xs text-gray-500">
            Keeping the current photo. Switch tabs above to change it.
          </p>
        )}

        {imageMode === 'url' && (
          <input
            name="image_url"
            type="url"
            defaultValue={service.image_url || ''}
            placeholder="https://…"
            className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
          />
        )}

        {imageMode === 'upload' && (
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
              <p className="text-xs text-gray-500 mt-2">
                <strong>Max:</strong> 100&nbsp;KB. JPG, PNG, or WebP.
              </p>
            )}
          </>
        )}

        {imageMode === 'remove' && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
            The current photo will be removed when you save.
          </p>
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
            defaultValue={service.price_min ?? ''}
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
            defaultValue={service.price_max ?? ''}
            className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Short Description
        </label>
        <textarea
          name="description"
          defaultValue={service.description || ''}
          className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none h-24"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
        >
          Cancel
        </button>
        <SubmitButton
          pendingText="Saving…"
          className="flex-1 btn-primary py-3 rounded-xl text-white font-bold"
        >
          Save Changes
        </SubmitButton>
      </div>
    </form>
  );
}
