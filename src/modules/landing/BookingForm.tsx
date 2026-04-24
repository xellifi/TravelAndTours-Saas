'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

interface PaymentSettings {
  gcash_name?: string;
  gcash_number?: string;
  paymaya_name?: string;
  paymaya_number?: string;
  bank_name?: string;
  bank_account_name?: string;
  bank_account_number?: string;
}

interface BookingFormProps {
  businessId: string;
  services: any[];
  isLimitReached: boolean;
  paymentSettings?: PaymentSettings | null;
}

export default function BookingForm({ businessId, services, isLimitReached, paymentSettings }: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  if (isLimitReached) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-8 rounded-3xl text-center text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-lock text-xl"></i>
        </div>
        <h3 className="text-xl font-bold mb-2">Bookings Paused</h3>
        <p>This business has temporarily reached its booking limit for the month. Please try again later or send an inquiry below.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      business_id: businessId,
      service_id: formData.get('service_id') as string,
      client_name: formData.get('name') as string,
      client_email: formData.get('email') as string,
      booking_date: new Date(formData.get('date') as string).toISOString(),
      status: 'pending',
    };

    const { error } = await supabase.from('bookings').insert(data);

    if (error) {
      console.error(error);
      alert('Something went wrong. Please check all fields and try again.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    const hasPayment = paymentSettings && (
      paymentSettings.gcash_number ||
      paymentSettings.paymaya_number ||
      paymentSettings.bank_account_number
    );

    return (
      <div className="space-y-6">
        <div className="bg-primary-50 border border-primary-200 p-8 rounded-3xl text-center text-primary-800">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-calendar-check text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold mb-2">Booking Requested!</h3>
          <p>Your booking request has been received. We will confirm via email shortly.</p>
        </div>

        {hasPayment && (
          <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 px-8 py-5">
              <h4 className="text-white font-bold text-lg">How to Pay</h4>
              <p className="text-primary-100 text-sm mt-0.5">Send your down payment or full payment via any of the methods below, then reply to our email with your payment screenshot.</p>
            </div>

            <div className="divide-y divide-gray-100">
              {paymentSettings?.gcash_number && (
                <div className="px-8 py-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-mobile-alt text-xl text-blue-600"></i>
                  </div>
                  <div>
                    <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-0.5">GCash</p>
                    <p className="font-bold text-gray-900 text-lg">{paymentSettings.gcash_number}</p>
                    {paymentSettings.gcash_name && (
                      <p className="text-sm text-gray-500 mt-0.5">{paymentSettings.gcash_name}</p>
                    )}
                  </div>
                </div>
              )}

              {paymentSettings?.paymaya_number && (
                <div className="px-8 py-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-wallet text-xl text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-xs font-black text-green-600 uppercase tracking-widest mb-0.5">PayMaya / Maya</p>
                    <p className="font-bold text-gray-900 text-lg">{paymentSettings.paymaya_number}</p>
                    {paymentSettings.paymaya_name && (
                      <p className="text-sm text-gray-500 mt-0.5">{paymentSettings.paymaya_name}</p>
                    )}
                  </div>
                </div>
              )}

              {paymentSettings?.bank_account_number && (
                <div className="px-8 py-5 flex items-center gap-5">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-university text-xl text-orange-600"></i>
                  </div>
                  <div>
                    <p className="text-xs font-black text-orange-600 uppercase tracking-widest mb-0.5">
                      Bank Transfer {paymentSettings.bank_name ? `· ${paymentSettings.bank_name}` : ''}
                    </p>
                    <p className="font-bold text-gray-900 text-lg">{paymentSettings.bank_account_number}</p>
                    {paymentSettings.bank_account_name && (
                      <p className="text-sm text-gray-500 mt-0.5">{paymentSettings.bank_account_name}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setSuccess(false)}
          className="w-full text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors py-3 border-2 border-gray-100 rounded-2xl hover:border-gray-200"
        >
          Make another booking
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Your Name</label>
          <input
            name="name"
            required
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
            placeholder="Juan Dela Cruz"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
            placeholder="juan@example.com"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Select Service</label>
          <select
            name="service_id"
            required
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all appearance-none"
          >
            <option value="">Choose a service...</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — ₱{s.price}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Preferred Date & Time</label>
          <input
            name="date"
            type="datetime-local"
            required
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-5 rounded-2xl text-white font-bold text-lg shadow-xl disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Request Booking'}{' '}
        <i className="fas fa-chevron-right ml-2 text-sm"></i>
      </button>
    </form>
  );
}
