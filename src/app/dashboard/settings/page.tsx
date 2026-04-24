import { createClient } from '@/utils/supabase/server';
import BusinessInfoForm from './BusinessInfoForm';
import PaymentSettingsForm from './PaymentSettingsForm';

const TEMPLATES = [
  { id: 'travel', name: 'Travel & Tours' },
  { id: 'restaurant', name: 'Restaurant / Food' },
  { id: 'fitness', name: 'Fitness / Gym' },
  { id: 'salon', name: 'Beauty / Salon' },
  { id: 'corporate', name: 'Corporate / Services' },
];

export default async function BusinessSettings() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  const { data: paymentSettings } = business
    ? await supabase
        .from('payment_settings')
        .select('*')
        .eq('business_id', business.id)
        .maybeSingle()
    : { data: null };

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'mywebpages.live';

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Business Settings</h1>
        <p className="text-gray-500">
          Configure your landing page, template, and payment details.
        </p>
      </div>

      <BusinessInfoForm business={business} baseUrl={baseUrl} templates={TEMPLATES} />

      {business ? (
        <PaymentSettingsForm paymentSettings={paymentSettings} />
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-800 font-medium flex items-center gap-3">
          <i className="fas fa-info-circle text-amber-500"></i>
          Create your business above first, then you can configure payment settings.
        </div>
      )}
    </div>
  );
}
