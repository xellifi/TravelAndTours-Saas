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

  return (
    <form
      action={action}
      className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8"
    >
      <h2 className="text-xl font-bold text-gray-900">Business Information</h2>

      <Alert state={state} />

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Business Name
        </label>
        <input
          name="name"
          defaultValue={business?.name || ''}
          required
          className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
          placeholder="My Travel Agency"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Landing Page URL
        </label>
        <div className="flex items-center">
          <span className="px-4 py-4 bg-gray-100 rounded-l-2xl text-gray-500 font-medium text-sm border-2 border-r-0 border-transparent whitespace-nowrap">
            {baseUrl}/
          </span>
          <input
            name="slug"
            defaultValue={business?.slug || ''}
            onChange={(e) => setSlugPreview(e.target.value)}
            required
            className="flex-1 px-4 py-4 rounded-r-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
            placeholder="my-travel-agency"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
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
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">
          Page Template
        </label>
        <select
          name="template_id"
          defaultValue={business?.template_id || 'travel'}
          className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all appearance-none"
        >
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <SubmitButton
        className="w-full btn-primary py-4 rounded-2xl text-white font-bold text-lg shadow-xl"
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
