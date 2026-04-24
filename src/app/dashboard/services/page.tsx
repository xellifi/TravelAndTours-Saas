import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export default async function ServicesManagement() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!business) return <p>Please create a business first.</p>;

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id);

  async function addService(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const description = formData.get('description') as string;

    await supabase.from('services').insert({
      business_id: business.id,
      name,
      price,
      description
    });
    revalidatePath('/dashboard/services');
  }

  async function deleteService(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const id = formData.get('id') as string;
    await supabase.from('services').delete().eq('id', id);
    revalidatePath('/dashboard/services');
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Manage Services</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          {services?.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-gray-200 rounded-3xl text-center text-gray-400">
                No services added yet.
            </div>
          ) : (
            services?.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                  <p className="text-primary-600 font-bold mt-1">₱{service.price}</p>
                </div>
                <form action={deleteService}>
                  <input type="hidden" name="id" value={service.id} />
                  <button className="w-10 h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                    <i className="fas fa-trash"></i>
                  </button>
                </form>
              </div>
            ))
          )}
        </div>

        <div>
          <form action={addService} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-xl font-bold mb-4">Add New Service</h2>
            <input name="name" required placeholder="Service Name" className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none" />
            <input name="price" type="number" step="0.01" required placeholder="Price" className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none" />
            <textarea name="description" placeholder="Short description" className="w-full p-4 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none h-32"></textarea>
            <button className="w-full btn-primary py-4 rounded-xl text-white font-bold">Add Service</button>
          </form>
        </div>
      </div>
    </div>
  );
}
