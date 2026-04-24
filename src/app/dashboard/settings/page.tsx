import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { requireActiveBusiness } from '@/lib/activeBusiness';
import BusinessInfoForm from './BusinessInfoForm';
import PaymentSettingsForm from './PaymentSettingsForm';

export const dynamic = 'force-dynamic';

const TEMPLATES = [
  { id: 'travel', name: 'Travel & Tours' },
  { id: 'restaurant', name: 'Restaurant / Food' },
  { id: 'fitness', name: 'Fitness / Gym' },
  { id: 'salon', name: 'Beauty / Salon' },
  { id: 'corporate', name: 'Corporate / Services' },
];

export default async function BusinessSettings() {
  const ctx = await requireActiveBusiness();

  // No business yet → redirect-style CTA to the new "My Businesses" page,
  // which is now the canonical place to create the first one.
  if (!ctx) {
    return (
      <div className="max-w-2xl space-y-5 sm:space-y-8">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1">
            Business Settings
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            You don&apos;t have a business yet. Create one to start configuring
            its landing page and payment options.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border-2 border-dashed border-gray-200 text-center">
          <Link
            href="/dashboard/businesses"
            className="btn-primary px-6 py-3 rounded-xl text-white font-bold inline-block text-sm sm:text-base"
          >
            Go to My Businesses
          </Link>
        </div>
      </div>
    );
  }

  const { business } = ctx;
  const supabase = await createClient();

  const { data: paymentSettings } = await supabase
    .from('payment_settings')
    .select('*')
    .eq('business_id', business.id)
    .maybeSingle();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'mywebpages.live';

  return (
    <div className="max-w-2xl space-y-5 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1">
          Business Settings
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Editing settings for{' '}
          <span className="font-bold text-gray-700">{business.name}</span>.{' '}
          <Link
            href="/dashboard/businesses"
            className="text-primary-600 font-bold hover:underline"
          >
            Switch business
          </Link>
        </p>
      </div>

      <BusinessInfoForm
        business={business}
        baseUrl={baseUrl}
        templates={TEMPLATES}
      />

      <PaymentSettingsForm paymentSettings={paymentSettings} />
    </div>
  );
}
