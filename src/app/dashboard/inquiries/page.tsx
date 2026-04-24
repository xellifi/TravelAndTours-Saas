import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function InquiriesView() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!business) return <p>Please create a business first.</p>;

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Visitor Inquiries</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {inquiries?.map((inquiry) => (
          <div key={inquiry.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{inquiry.name}</h3>
                <p className="text-sm text-primary-600 font-medium">{inquiry.email}</p>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {new Date(inquiry.created_at).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex-1 bg-gray-50 p-6 rounded-2xl text-gray-700 leading-relaxed italic mb-6">
              "{inquiry.message}"
            </div>

            <a 
              href={`mailto:${inquiry.email}?subject=Inquiry from ${inquiry.name}`}
              className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:gap-3 transition-all"
            >
              Reply via Email <i className="fas fa-arrow-right text-xs"></i>
            </a>
          </div>
        ))}
      </div>

      {inquiries?.length === 0 && (
        <div className="p-12 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400">
           No inquiries found.
        </div>
      )}
    </div>
  );
}
