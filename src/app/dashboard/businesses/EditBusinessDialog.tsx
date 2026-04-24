'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import {
  updateOwnerBusinessAction,
  type OwnerBusinessFormState,
} from './actions';

type Template = { id: string; name: string };

type Props = {
  business: {
    id: string;
    name: string;
    slug: string;
    template_id: string | null;
  };
  templates: Template[];
};

export default function EditBusinessDialog({ business, templates }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState<OwnerBusinessFormState, FormData>(
    updateOwnerBusinessAction,
    null,
  );

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        setOpen(false);
        router.refresh();
      }, 900);
      return () => clearTimeout(t);
    }
  }, [state, router]);

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
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Edit Business
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  <span className="font-bold">{business.name}</span>{' '}
                  <span className="text-gray-300">/{business.slug}</span>
                </p>
              </div>
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
              <input type="hidden" name="id" value={business.id} />

              <Alert state={state} />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  required
                  defaultValue={business.name}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Landing Page URL <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center bg-gray-50 rounded-xl border border-transparent focus-within:border-primary-500 overflow-hidden">
                  <span className="pl-4 pr-2 text-gray-400 text-sm">/</span>
                  <input
                    name="slug"
                    required
                    defaultValue={business.slug}
                    className="flex-1 p-4 pl-0 bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Page Template
                </label>
                <select
                  name="template_id"
                  defaultValue={business.template_id || 'travel'}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
                >
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
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
