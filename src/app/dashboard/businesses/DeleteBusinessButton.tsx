'use client';

import { useActionState, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import {
  deleteOwnerBusinessAction,
  type OwnerBusinessDeleteState,
} from './actions';

type Props = {
  businessId: string;
  businessName: string;
  businessSlug: string;
};

export default function DeleteBusinessButton({
  businessId,
  businessName,
  businessSlug,
}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, formAction] = useActionState<OwnerBusinessDeleteState, FormData>(
    deleteOwnerBusinessAction,
    null,
  );
  const [confirmText, setConfirmText] = useState('');

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => {
        setOpen(false);
        router.refresh();
      }, 800);
      return () => clearTimeout(t);
    }
  }, [state, router]);

  const matches =
    confirmText.trim().toLowerCase() === businessSlug.toLowerCase();

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setConfirmText('');
          setOpen(true);
        }}
        className="inline-flex items-center gap-1.5 text-red-600 font-bold text-sm hover:underline"
      >
        <i className="fas fa-trash text-xs"></i> Delete
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
                Delete Business
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
              <input type="hidden" name="id" value={businessId} />

              <Alert state={state} />

              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800 leading-relaxed">
                <p className="font-bold mb-2">
                  <i className="fas fa-triangle-exclamation mr-1"></i> This
                  cannot be undone.
                </p>
                <p>
                  Deleting <span className="font-bold">{businessName}</span>{' '}
                  will permanently remove its landing page, services, hero
                  images, payment settings, bookings, and inquiries.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                  Type{' '}
                  <span className="font-mono text-red-600">
                    {businessSlug}
                  </span>{' '}
                  to confirm
                </label>
                <input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-red-500 outline-none font-mono text-sm"
                  autoFocus
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
                  pendingText="Deleting…"
                  disabled={!matches}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all disabled:bg-red-300 disabled:cursor-not-allowed"
                >
                  Delete forever
                </SubmitButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
