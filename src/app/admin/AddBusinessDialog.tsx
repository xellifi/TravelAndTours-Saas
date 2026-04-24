'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { createBusinessAction, type BusinessFormState } from './actions';

type UserOption = {
  id: string;
  email: string | null;
  full_name: string | null;
};

type Template = { id: string; name: string };

type Props = {
  eligibleUsers: UserOption[];
  templates: Template[];
};

export default function AddBusinessDialog({ eligibleUsers, templates }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState<BusinessFormState, FormData>(
    createBusinessAction,
    null,
  );

  const sortedUsers = useMemo(
    () =>
      [...eligibleUsers].sort((a, b) =>
        (a.email || '').localeCompare(b.email || ''),
      ),
    [eligibleUsers],
  );

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        setOpen(false);
        router.refresh();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-bold hover:bg-primary-700 transition-all shadow-sm"
      >
        <i className="fas fa-plus text-xs"></i> New Business
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
              <h2 className="text-xl font-extrabold text-gray-900">
                Add New Business
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
              <Alert state={state} />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Owner <span className="text-red-500">*</span>
                </label>
                {sortedUsers.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    No eligible users. Every user on the platform already
                    owns a business.
                  </div>
                ) : (
                  <select
                    name="owner_id"
                    required
                    defaultValue=""
                    className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
                  >
                    <option value="" disabled>
                      Pick a user…
                    </option>
                    {sortedUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.email || u.id}
                        {u.full_name ? ` — ${u.full_name}` : ''}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Only users who don&apos;t already own a business are listed.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  required
                  className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
                  placeholder="e.g. Sunshine Travel"
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
                    className="flex-1 p-4 pl-0 bg-transparent outline-none"
                    placeholder="sunshine-travel"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Letters, numbers and dashes only. Must be unique.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Page Template
                </label>
                <select
                  name="template_id"
                  defaultValue="travel"
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
                  pendingText="Creating…"
                  className="flex-1 btn-primary py-3 rounded-xl text-white font-bold"
                >
                  Create Business
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
