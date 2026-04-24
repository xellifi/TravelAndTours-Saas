'use client';

import { useActionState } from 'react';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { updatePaymentSettingsAction, type ActionState } from './actions';

type PaymentSettings = {
  gcash_name?: string | null;
  gcash_number?: string | null;
  paymaya_name?: string | null;
  paymaya_number?: string | null;
  bank_name?: string | null;
  bank_account_name?: string | null;
  bank_account_number?: string | null;
} | null;

type Props = {
  paymentSettings: PaymentSettings;
};

export default function PaymentSettingsForm({ paymentSettings }: Props) {
  const [state, action] = useActionState<ActionState, FormData>(
    updatePaymentSettingsAction,
    null,
  );

  return (
    <form
      action={action}
      className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-5 sm:space-y-6"
    >
      <div>
        <h2 className="text-base sm:text-xl font-bold text-gray-900">Payment Settings</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          These details will be shown to clients after they submit a booking request.
        </p>
      </div>

      <Alert state={state} />

      {/* GCash */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
            <i className="fas fa-mobile-alt text-blue-600 text-sm"></i>
          </div>
          <h3 className="font-bold text-gray-800">GCash</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Account Name
            </label>
            <input
              name="gcash_name"
              defaultValue={paymentSettings?.gcash_name || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              GCash Number
            </label>
            <input
              name="gcash_number"
              defaultValue={paymentSettings?.gcash_number || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="09XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* PayMaya */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
            <i className="fas fa-wallet text-green-600 text-sm"></i>
          </div>
          <h3 className="font-bold text-gray-800">PayMaya / Maya</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Account Name
            </label>
            <input
              name="paymaya_name"
              defaultValue={paymentSettings?.paymaya_name || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Maya Number
            </label>
            <input
              name="paymaya_number"
              defaultValue={paymentSettings?.paymaya_number || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="09XX XXX XXXX"
            />
          </div>
        </div>
      </div>

      {/* Bank Transfer */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
            <i className="fas fa-university text-orange-600 text-sm"></i>
          </div>
          <h3 className="font-bold text-gray-800">Bank Transfer</h3>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Bank Name
            </label>
            <input
              name="bank_name"
              defaultValue={paymentSettings?.bank_name || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="BDO / BPI / Metrobank"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Account Name
            </label>
            <input
              name="bank_account_name"
              defaultValue={paymentSettings?.bank_account_name || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="Juan Dela Cruz"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">
              Account Number
            </label>
            <input
              name="bank_account_number"
              defaultValue={paymentSettings?.bank_account_number || ''}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm"
              placeholder="0000 0000 0000"
            />
          </div>
        </div>
      </div>

      <SubmitButton
        className="w-full btn-primary py-3 sm:py-4 rounded-xl text-white font-bold text-sm sm:text-base shadow-md"
        pendingText="Saving…"
      >
        Save Payment Settings
      </SubmitButton>
    </form>
  );
}
