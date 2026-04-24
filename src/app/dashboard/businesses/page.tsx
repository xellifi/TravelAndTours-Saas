import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOwnerBusinesses } from '@/lib/activeBusiness';
import { setActiveBusinessAction } from './actions';
import AddBusinessDialog from './AddBusinessDialog';
import EditBusinessDialog from './EditBusinessDialog';
import DeleteBusinessButton from './DeleteBusinessButton';

export const dynamic = 'force-dynamic';

const TEMPLATES = [
  { id: 'travel', name: 'Travel & Tours' },
  { id: 'restaurant', name: 'Restaurant / Food' },
  { id: 'fitness', name: 'Fitness / Gym' },
  { id: 'salon', name: 'Beauty / Salon' },
  { id: 'corporate', name: 'Corporate / Services' },
];

export default async function MyBusinessesPage() {
  const result = await getOwnerBusinesses();
  if (!result) redirect('/login');

  const { businesses, active } = result;
  const activeId = active?.id || null;
  const isEmpty = businesses.length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">
            My Businesses
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Each business is its own landing page. Switch between them to manage
            their services, bookings, and settings.
          </p>
        </div>
        {!isEmpty && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400 font-bold">
              {businesses.length} total
            </span>
            <AddBusinessDialog templates={TEMPLATES} />
          </div>
        )}
      </div>

      {isEmpty ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-8 sm:p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-2xl">
            <i className="fas fa-store"></i>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
            Create your first business
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-md mx-auto mb-6">
            Each business gets its own public landing page with services,
            bookings, and inquiries.
          </p>
          <AddBusinessDialog templates={TEMPLATES} variant="large" />
        </div>
      ) : (
        <>
          {/* Mobile: cards */}
          <div className="sm:hidden space-y-3">
            {businesses.map((biz) => {
              const isActive = biz.id === activeId;
              return (
                <div
                  key={biz.id}
                  className={`bg-white rounded-2xl border p-4 ${
                    isActive
                      ? 'border-primary-300 shadow-sm shadow-primary-50'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 truncate">{biz.name}</p>
                      <p className="text-xs text-gray-400 truncate">/{biz.slug}</p>
                    </div>
                    {isActive && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-primary-100 text-primary-700 px-2 py-1 rounded-full whitespace-nowrap">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] mb-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-bold uppercase">
                      {biz.template_id || 'travel'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 items-center">
                    {!isActive && (
                      <form action={setActiveBusinessAction}>
                        <input type="hidden" name="business_id" value={biz.id} />
                        <input
                          type="hidden"
                          name="redirect_to"
                          value="/dashboard/businesses"
                        />
                        <button
                          type="submit"
                          className="text-primary-600 font-bold text-sm hover:underline inline-flex items-center gap-1.5"
                        >
                          <i className="fas fa-arrow-right-arrow-left text-xs"></i>{' '}
                          Switch to
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/${biz.slug}`}
                      target="_blank"
                      className="text-gray-600 font-bold text-sm hover:underline inline-flex items-center gap-1.5"
                    >
                      View <i className="fas fa-external-link-alt text-xs"></i>
                    </Link>
                    <EditBusinessDialog
                      business={{
                        id: biz.id,
                        name: biz.name,
                        slug: biz.slug,
                        template_id: biz.template_id,
                      }}
                      templates={TEMPLATES}
                    />
                    <DeleteBusinessButton
                      businessId={biz.id}
                      businessName={biz.name}
                      businessSlug={biz.slug}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[680px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Business
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Template
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {businesses.map((biz) => {
                    const isActive = biz.id === activeId;
                    return (
                      <tr
                        key={biz.id}
                        className={`transition-colors ${
                          isActive ? 'bg-primary-50/30' : 'hover:bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-900 text-sm">
                            {biz.name}
                          </p>
                          <p className="text-xs text-gray-400 font-medium mt-0.5">
                            /{biz.slug}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full uppercase">
                            {biz.template_id || 'travel'}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full">
                              <i className="fas fa-circle text-[6px]"></i> Active
                            </span>
                          ) : (
                            <form action={setActiveBusinessAction}>
                              <input
                                type="hidden"
                                name="business_id"
                                value={biz.id}
                              />
                              <input
                                type="hidden"
                                name="redirect_to"
                                value="/dashboard/businesses"
                              />
                              <button
                                type="submit"
                                className="text-primary-600 font-bold text-sm hover:underline inline-flex items-center gap-1.5"
                              >
                                <i className="fas fa-arrow-right-arrow-left text-xs"></i>{' '}
                                Switch to
                              </button>
                            </form>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-4 flex-wrap">
                            <Link
                              href={`/${biz.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1.5 text-gray-600 font-bold text-sm hover:underline whitespace-nowrap"
                            >
                              View <i className="fas fa-external-link-alt text-xs"></i>
                            </Link>
                            <EditBusinessDialog
                              business={{
                                id: biz.id,
                                name: biz.name,
                                slug: biz.slug,
                                template_id: biz.template_id,
                              }}
                              templates={TEMPLATES}
                            />
                            <DeleteBusinessButton
                              businessId={biz.id}
                              businessName={biz.name}
                              businessSlug={biz.slug}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
