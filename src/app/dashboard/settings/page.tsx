import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function BusinessSettings() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  // Fetch payment settings
  const { data: paymentSettings } = await supabase
    .from('payment_settings')
    .select('*')
    .eq('business_id', business?.id || '')
    .single();

  async function updateBusiness(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const slug = formData.get('slug') as string;
    const data = {
      name: formData.get('name') as string,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      template_id: formData.get('template_id') as string,
      owner_id: user.id,
    };

    const { data: existingBiz } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    let error;
    if (existingBiz) {
      const { error: e } = await supabase.from('businesses').update(data).eq('id', existingBiz.id);
      error = e;
    } else {
      const { error: e } = await supabase.from('businesses').insert(data);
      error = e;
    }

    if (!error) {
      revalidatePath('/dashboard/settings');
      redirect(`/${data.slug}`);
    }
  }

  async function updatePaymentSettings(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: biz } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (!biz) return;

    const paymentData = {
      business_id: biz.id,
      gcash_name: formData.get('gcash_name') as string,
      gcash_number: formData.get('gcash_number') as string,
      paymaya_name: formData.get('paymaya_name') as string,
      paymaya_number: formData.get('paymaya_number') as string,
      bank_name: formData.get('bank_name') as string,
      bank_account_name: formData.get('bank_account_name') as string,
      bank_account_number: formData.get('bank_account_number') as string,
    };

    await supabase.from('payment_settings').upsert(paymentData, { onConflict: 'business_id' });
    revalidatePath('/dashboard/settings');
  }

  const templates = [
    { id: 'travel', name: 'Travel & Tours' },
    { id: 'restaurant', name: 'Restaurant / Food' },
    { id: 'fitness', name: 'Fitness / Gym' },
    { id: 'salon', name: 'Beauty / Salon' },
    { id: 'corporate', name: 'Corporate / Services' },
  ];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'mywebpages.live';

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Business Settings</h1>
        <p className="text-gray-500">Configure your landing page, template, and payment details.</p>
      </div>

      {/* Business Info */}
      <form action={updateBusiness} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
        <h2 className="text-xl font-bold text-gray-900">Business Information</h2>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Business Name</label>
          <input
            name="name"
            defaultValue={business?.name || ''}
            required
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
            placeholder="My Travel Agency"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Landing Page URL</label>
          <div className="flex items-center">
            <span className="px-4 py-4 bg-gray-100 rounded-l-2xl text-gray-500 font-medium text-sm border-2 border-r-0 border-transparent whitespace-nowrap">
              {baseUrl}/
            </span>
            <input
              name="slug"
              defaultValue={business?.slug || ''}
              required
              className="flex-1 px-4 py-4 rounded-r-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
              placeholder="my-travel-agency"
            />
          </div>
          <p className="mt-2 text-xs text-gray-400">Letters, numbers, and hyphens only. This is your public URL.</p>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Page Template</label>
          <select
            name="template_id"
            defaultValue={business?.template_id || 'travel'}
            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all appearance-none"
          >
            {templates.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="w-full btn-primary py-4 rounded-2xl text-white font-bold text-lg shadow-xl">
          {business ? 'Update Business' : 'Create Business'}
        </button>
      </form>

      {/* Payment Settings */}
      {business && (
        <form action={updatePaymentSettings} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Payment Settings</h2>
            <p className="text-sm text-gray-500 mt-1">These details will be shown to clients after they submit a booking request.</p>
          </div>

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
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Account Name</label>
                <input name="gcash_name" defaultValue={paymentSettings?.gcash_name || ''} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm" placeholder="Juan Dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">GCash Number</label>
                <input name="gcash_number" defaultValue={paymentSettings?.gcash_number || ''} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm" placeholder="09XX XXX XXXX" />
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
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Account Name</label>
                <input name="paymaya_name" defaultValue={paymentSettings?.paymaya_name || ''} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm" placeholder="Juan Dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Maya Number</label>
                <input name="paymaya_number" defaultValue={paymentSettings?.paymaya_number || ''} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm" placeholder="09XX XXX XXXX" />
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
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Bank Name</label>
                <input name="bank_name" defaultValue={paymentSettings?.bank_name || ''} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm" placeholder="BDO / BPI / Metrobank" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Account Name</label>
                <input name="bank_account_name" defaultValue={paymentSettings?.bank_account_name || ''} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm" placeholder="Juan Dela Cruz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wide">Account Number</label>
                <input name="bank_account_number" defaultValue={paymentSettings?.bank_account_number || ''} className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all text-sm" placeholder="0000 0000 0000" />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full btn-primary py-4 rounded-2xl text-white font-bold text-lg shadow-xl">
            Save Payment Settings
          </button>
        </form>
      )}

      {!business && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-sm text-amber-800 font-medium flex items-center gap-3">
          <i className="fas fa-info-circle text-amber-500"></i>
          Create your business above first, then you can configure payment settings.
        </div>
      )}
    </div>
  );
}
