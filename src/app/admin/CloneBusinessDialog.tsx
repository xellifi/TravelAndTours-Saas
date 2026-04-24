'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { cloneBusinessAction, type CloneBusinessState } from './actions';

type UserOption = {
  id: string;
  email: string | null;
  full_name: string | null;
};

type Props = {
  sourceId: string;
  sourceName: string;
  sourceSlug: string;
  eligibleUsers: UserOption[];
};

export default function CloneBusinessDialog({
  sourceId,
  sourceName,
  sourceSlug,
  eligibleUsers,
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState<CloneBusinessState, FormData>(
    cloneBusinessAction,
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
      const t = setTimeout(() => setOpen(false), 1200);
      return () => clearTimeout(t);
    }
  }, [state]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-purple-600 font-bold text-sm hover:underline"
      >
        <i className="fas fa-copy text-xs"></i> Clone
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
                  Clone Business
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Source: <span className="font-bold">{sourceName}</span>{' '}
                  <span className="text-gray-300">/{sourceSlug}</span>
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
              <input type="hidden" name="source_id" value={sourceId} />

              <Alert state={state} />

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Assign To <span className="text-red-500">*</span>
                </label>
                {sortedUsers.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    No users on the platform yet.
                  </div>
                ) : (
                  <select
                    name="target_user_id"
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
                  Owners can have any number of businesses.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  New Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="new_name"
                  required
                  defaultValue={`${sourceName} (Copy)`}
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
                    name="new_slug"
                    required
                    defaultValue={`${sourceSlug}-copy`}
                    className="flex-1 p-4 pl-0 bg-transparent outline-none"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Letters, numbers and dashes only. Must be unique.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800 leading-relaxed">
                <p className="font-bold mb-1">
                  <i className="fas fa-info-circle mr-1"></i> What gets cloned
                </p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>Business info &amp; template</li>
                  <li>All services (with copies of their images)</li>
                  <li>Hero / main page images</li>
                  <li>Payment settings (GCash, PayMaya, bank)</li>
                </ul>
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
                  pendingText="Cloning…"
                  className="flex-1 btn-primary py-3 rounded-xl text-white font-bold"
                >
                  Clone &amp; Assign
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
