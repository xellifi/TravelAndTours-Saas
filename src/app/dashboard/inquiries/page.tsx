import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { requireActiveBusiness } from '@/lib/activeBusiness';

export const dynamic = 'force-dynamic';

export default async function InquiriesView() {
  const ctx = await requireActiveBusiness();
  if (!ctx) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-gray-300 text-center">
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

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">Visitor Inquiries</h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Inquiries for{' '}
          <span className="font-bold text-gray-700">{business.name}</span>.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {inquiries?.map((inquiry) => (
          <div key={inquiry.id} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-300 flex flex-col">
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
