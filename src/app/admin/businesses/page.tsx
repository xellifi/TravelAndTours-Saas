import { createAdminClient } from '@/utils/supabase/admin';
import Link from 'next/link';
import CloneBusinessDialog from '../CloneBusinessDialog';

export const dynamic = 'force-dynamic';

export default async function AdminBusinessesPage() {
  // Service-role client bypasses RLS — safe here because the parent admin layout
  // already redirects non-admins away before this page renders.
  const admin = createAdminClient();

  const [{ data: businesses }, { data: allUsers }] = await Promise.all([
    admin
      .from('businesses')
      .select(
        'id, name, slug, owner_id, template_id, created_at, users(email, full_name)',
      )
      .order('created_at', { ascending: false }),
    admin.from('users').select('id, email, full_name'),
  ]);

  const ownerIds = new Set(
    (businesses || []).map((b: { owner_id: string | null }) => b.owner_id),
  );
  const eligibleUsers = (allUsers || []).filter((u) => !ownerIds.has(u.id));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            All Businesses
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Every landing page on the platform. Clone any to a new owner in one click.
          </p>
        </div>
        <span className="text-sm text-gray-400 font-bold">
          {businesses?.length || 0} total
        </span>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Business
                </th>
                <th className="px-4 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Template
                </th>
                <th className="px-4 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Owner
                </th>
                <th className="px-4 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Created
                </th>
                <th className="px-4 sm:px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {businesses?.map((biz: any) => (
                <tr
                  key={biz.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 sm:px-8 py-4 sm:py-5">
                    <p className="font-bold text-gray-900 text-sm">{biz.name}</p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      /{biz.slug}
                    </p>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-5">
                    <span className="px-2 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase">
                      {biz.template_id || 'travel'}
                    </span>
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-5 text-sm">
                    {biz.users?.email ? (
                      <div className="max-w-[160px]">
                        <p className="font-bold text-gray-900 truncate">
                          {biz.users.full_name || (
                            <span className="text-gray-400 italic">No name</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{biz.users.email}</p>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-5 text-sm text-gray-500 whitespace-nowrap">
                    {biz.created_at
                      ? new Date(biz.created_at).toLocaleDateString('en-PH')
                      : '—'}
                  </td>
                  <td className="px-4 sm:px-8 py-4 sm:py-5">
                    <div className="flex items-center justify-end gap-3 sm:gap-5">
                      <CloneBusinessDialog
                        sourceId={biz.id}
                        sourceName={biz.name}
                        sourceSlug={biz.slug}
                        eligibleUsers={eligibleUsers}
                      />
                      <Link
                        href={`/${biz.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-primary-600 font-bold text-sm hover:underline whitespace-nowrap"
                      >
                        View <i className="fas fa-external-link-alt text-xs"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!businesses || businesses.length === 0) && (
          <div className="p-12 sm:p-16 text-center text-gray-400">
            <i className="fas fa-building text-4xl mb-4 block opacity-20"></i>
            No businesses registered yet.
          </div>
        )}
      </div>
    </div>
  );
}
