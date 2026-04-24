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
      <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-5 sm:mb-8">Visitor Inquiries</h1>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {inquiries?.map((inquiry) => (
          <div key={inquiry.id} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start gap-3 mb-4">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">{inquiry.name}</h3>
                <p className="text-xs sm:text-sm text-primary-600 font-medium truncate">{inquiry.email}</p>
              </div>
              <span className="text-[10px] sm:text-xs text-gray-400 font-medium whitespace-nowrap">
                {new Date(inquiry.created_at).toLocaleDateString()}
              </span>
            </div>

            <div className="flex-1 bg-gray-50 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-sm text-gray-700 leading-relaxed italic mb-4 break-words">
              &ldquo;{inquiry.message}&rdquo;
            </div>

            <a
              href={`mailto:${inquiry.email}?subject=Inquiry from ${inquiry.name}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary-600 hover:gap-3 transition-all"
            >
              Reply via Email <i className="fas fa-arrow-right text-xs"></i>
            </a>
          </div>
        ))}
      </div>

      {inquiries?.length === 0 && (
        <div className="p-6 sm:p-12 border-2 border-dashed border-gray-100 rounded-2xl sm:rounded-3xl text-center text-sm sm:text-base text-gray-400">
           No inquiries found.
        </div>
      )}
    </div>
  );
}
