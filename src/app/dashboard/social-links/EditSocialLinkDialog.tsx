'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { SOCIAL_PLATFORMS, getPlatform } from '@/lib/socialPlatforms';
import { updateSocialLinkAction, type SocialLinkFormState } from './actions';

type Props = {
  link: { id: string; platform: string; url: string };
};

export default function EditSocialLinkDialog({ link }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState<SocialLinkFormState, FormData>(
    updateSocialLinkAction,
    null,
  );
  const [platform, setPlatform] = useState(link.platform);

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        setOpen(false);
        router.refresh();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  useEffect(() => {
    if (open) setPlatform(link.platform);
  }, [open, link.platform]);

  const placeholder =
    getPlatform(platform)?.placeholder ?? 'https://example.com';

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-blue-600 font-bold text-sm hover:underline"
      >
        <i className="fas fa-pen text-xs"></i> Edit
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md">
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">
                Edit social link
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all flex items-center justify-center"
                aria-label="Close"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <form action={formAction} className="px-7 py-6 space-y-5">
              <input type="hidden" name="id" value={link.id} />

              <Alert state={state} />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Platform
                </label>
                <select
                  name="platform"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  URL
                </label>
                <input
                  name="url"
                  required
                  type="url"
                  inputMode="url"
                  defaultValue={link.url}
                  placeholder={placeholder}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-300 focus:border-primary-500 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
          </div>
        </div>
      )}
    </>
  );
}
