import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { deleteServiceAction } from './actions';
import AddServiceForm from './AddServiceForm';
import { formatPriceRange } from '@/lib/format';

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
            services.map((service) => {
              const priceLabel = formatPriceRange(
                service.price_min,
                service.price_max,
                service.price,
              );
              return (
                <div
                  key={service.id}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5"
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {service.image_url ? (
                      <Image
                        src={service.image_url}
                        alt={service.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">
                        <i className="fas fa-image" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">
                      {service.name}
                    </h3>
                    {service.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {service.description}
                      </p>
                    )}
                    {priceLabel && (
                      <p className="text-primary-600 font-bold mt-1">{priceLabel}</p>
                    )}
                  </div>

                  <form action={deleteServiceAction}>
                    <input type="hidden" name="id" value={service.id} />
                    <button
                      className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                      aria-label={`Delete ${service.name}`}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </form>
                </div>
              );
            })
          )}
        </div>

        <div>
          <AddServiceForm />
        </div>
      </div>
    </div>
  );
}
