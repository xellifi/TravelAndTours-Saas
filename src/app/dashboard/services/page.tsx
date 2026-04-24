import { createClient } from '@/utils/supabase/server';
import AddServiceForm from './AddServiceForm';
import ServiceCard from './ServiceCard';

export const dynamic = 'force-dynamic';

export default async function ServicesManagement() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">Please create your business first in Settings.</p>
      </div>
    );
  }

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: true });

  return (
    <div>
      <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Manage Services</h1>
          <p className="text-gray-500 mt-1">
            Add a photo and a price range so visitors know what to expect.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-4">
          {!services || services.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400">
              No services yet. Add your first one on the right.
            </div>
          ) : (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </div>

        <div>
          <AddServiceForm />
        </div>
      </div>
    </div>
  );
}
