'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { updateBusinessAction, type ActionState } from './actions';

type Business = {
  name?: string | null;
  slug?: string | null;
  template_id?: string | null;
  operating_hours?: string | null;
  operating_hours_note?: string | null;
} | null;

type Props = {
  business: Business;
  baseUrl: string;
  templates: { id: string; name: string }[];
};

export default function BusinessInfoForm({ business, baseUrl, templates }: Props) {
  const [state, action] = useActionState<ActionState, FormData>(updateBusinessAction, null);
  const router = useRouter();
  const [slugPreview, setSlugPreview] = useState(business?.slug || '');

  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state, router]);

  const isExisting = Boolean(business);

  const slugInputClass =
    'w-full min-w-0 px-3 py-3 sm:px-4 sm:py-3.5 text-sm sm:text-base rounded-r-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all';

  return (
    <form
      action={action}
      className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-5 sm:space-y-6"
    >
      <h2 className="text-base sm:text-xl font-bold text-gray-900">Business Information</h2>

      <Alert state={state} />

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Business Name
        </label>
        <input
          name="name"
          defaultValue={business?.name || ''}
          required
          className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
          placeholder="My Travel Agency"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Landing Page URL
        </label>
        <div className="flex items-stretch">
          <span className="px-2.5 py-3 sm:px-3 sm:py-3.5 bg-gray-100 rounded-l-xl text-gray-500 font-medium text-xs sm:text-sm border-2 border-r-0 border-transparent whitespace-nowrap flex items-center max-w-[45%] truncate">
            {baseUrl}/
          </span>
          <input
            name="slug"
            defaultValue={business?.slug || ''}
            onChange={(e) => setSlugPreview(e.target.value)}
            required
            className={slugInputClass}
            placeholder="my-travel-agency"
          />
        </div>
        <p className="mt-2 text-[11px] sm:text-xs text-gray-400 break-all">
          Letters, numbers, and hyphens only. This is your public URL.
          {slugPreview && (
            <>
              {' '}
              Preview:{' '}
              <span className="font-mono text-gray-600">
                {baseUrl}/
                {slugPreview
                  .toLowerCase()
                  .trim()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-]/g, '')}
              </span>
            </>
          )}
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Page Template
        </label>
        <select
          name="template_id"
          defaultValue={business?.template_id || 'travel'}
          className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
          Operating Hours
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          Shown on your public landing page. Leave blank to hide.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Hours
            </label>
            <input
              name="operating_hours"
              defaultValue={business?.operating_hours || ''}
              className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
              placeholder="Mon – Sat · 9:00 AM – 7:00 PM"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
              Note <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              name="operating_hours_note"
              defaultValue={business?.operating_hours_note || ''}
              className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
              placeholder="Sundays by appointment"
            />
          </div>
        </div>
      </div>

      <SubmitButton
        className="w-full btn-primary py-3 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base shadow-md"
        pendingText={isExisting ? 'Updating…' : 'Creating…'}
      >
        {isExisting ? 'Update Business' : 'Create Business'}
      </SubmitButton>

      {state?.success && state.slug && (
        <a
          href={`/${state.slug}`}
          target="_blank"
          rel="noreferrer"
          className="block text-center text-sm font-bold text-primary-600 hover:underline"
        >
          View your live page →
        </a>
      )}
    </form>
  );
}
