'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { SOCIAL_PLATFORMS, getPlatform } from '@/lib/socialPlatforms';
import { addSocialLinkAction, type SocialLinkFormState } from './actions';

export default function AddSocialLinkForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState<SocialLinkFormState, FormData>(
    addSocialLinkAction,
    null,
  );
  const [platform, setPlatform] = useState<string>(SOCIAL_PLATFORMS[0].id);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      setPlatform(SOCIAL_PLATFORMS[0].id);
      router.refresh();
    }
  }, [state, router]);

  const placeholder =
    getPlatform(platform)?.placeholder ?? 'https://example.com';

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-4"
    >
      <div>
        <h2 className="text-base sm:text-lg font-bold text-gray-900">
          Add a social link
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Pick a platform and paste the full URL to your page or profile.
        </p>
      </div>

      <Alert state={state} />

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Platform
        </label>
        <select
          name="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-3.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none text-sm sm:text-base"
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
          placeholder={placeholder}
          className="w-full p-3.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none text-sm sm:text-base"
        />
        <p className="text-[11px] sm:text-xs text-gray-400 mt-1.5">
          Tip: copy the address bar URL from the page you want to link to.
        </p>
      </div>

      <SubmitButton
        pendingText="Adding…"
        className="w-full btn-primary py-3 sm:py-3.5 rounded-xl text-white font-bold text-sm sm:text-base shadow-md"
      >
        Add link
      </SubmitButton>
    </form>
  );
}
