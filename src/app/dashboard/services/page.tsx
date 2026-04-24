import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { requireActiveBusiness } from '@/lib/activeBusiness';
import AddServiceForm from './AddServiceForm';
import ServiceCard from './ServiceCard';

export const dynamic = 'force-dynamic';

export default async function ServicesManagement() {
  const ctx = await requireActiveBusiness();
  if (!ctx) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 mb-4">
          You don&apos;t have a business yet.
        </p>
        <Link
          href="/dashboard/businesses"
          className="btn-primary px-6 py-3 rounded-xl text-white font-bold inline-block text-sm"
        >
          Create your first business
        </Link>
      </div>
    );
  }

  const { business } = ctx;
  const supabase = await createClient();

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: true });

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">Manage Services</h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Editing services for{' '}
          <span className="font-bold text-gray-700">{business.name}</span>. Add a
          photo and a price range so visitors know what to expect.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-10 items-start">
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-3 sm:space-y-4">
          {!services || services.length === 0 ? (
            <div className="p-6 sm:p-12 border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl text-center text-sm sm:text-base text-gray-400">
              No services yet. Add your first one using the form.
            </div>
          ) : (
            services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </div>

        <div className="order-1 lg:order-2">
          <AddServiceForm />
        </div>
      </div>
    </div>
  );
}
