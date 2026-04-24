import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import CloneBusinessDialog from './CloneBusinessDialog';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Fetch all platform data (auth + role guard is handled by admin/layout.tsx)
  const [
    { data: businesses },
    { count: usersCount },
    { count: bookingsCount },
    { count: inquiriesCount },
    { data: allUsers },
  ] = await Promise.all([
    supabase
      .from('businesses')
      .select(
        'id, name, slug, owner_id, template_id, created_at, users(email)',
      ),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('bookings').select('id', { count: 'exact', head: true }),
    supabase.from('inquiries').select('id', { count: 'exact', head: true }),
    supabase.from('users').select('id, email, full_name'),
  ]);

  // Eligible users for cloning = anyone who doesn't already own a business.
  const ownerIds = new Set(
    (businesses || []).map((b: { owner_id: string | null }) => b.owner_id),
  );
  const eligibleUsers = (allUsers || []).filter((u) => !ownerIds.has(u.id));

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            System <span className="text-primary-600">Admin</span>
          </h1>
          <p className="text-gray-500 mt-1">Platform-wide overview and business management.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <AdminStatCard label="Platform Users" value={usersCount || 0} icon="fa-users" color="text-blue-600" bg="bg-blue-50" />
        <AdminStatCard label="Active Businesses" value={businesses?.length || 0} icon="fa-building" color="text-purple-600" bg="bg-purple-50" />
        <AdminStatCard label="Total Bookings" value={bookingsCount || 0} icon="fa-calendar-alt" color="text-green-600" bg="bg-green-50" />
        <AdminStatCard label="Total Inquiries" value={inquiriesCount || 0} icon="fa-envelope-open-text" color="text-orange-600" bg="bg-orange-50" />
      </div>

      {/* Businesses Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">All Businesses</h2>
          <span className="text-sm text-gray-400">{businesses?.length || 0} total</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Business</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Template</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Owner Email</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">Created</th>
              <th className="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {businesses?.map((biz: any) => (
              <tr key={biz.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-8 py-5">
                  <p className="font-bold text-gray-900">{biz.name}</p>
                  <p className="text-xs text-gray-400 font-medium mt-0.5">/{biz.slug}</p>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-bold rounded-full uppercase">
                    {biz.template_id || 'travel'}
                  </span>
                </td>
                <td className="px-8 py-5 text-sm text-gray-600">
                  {biz.users?.email || <span className="text-gray-300">—</span>}
                </td>
                <td className="px-8 py-5 text-sm text-gray-500">
                  {biz.created_at ? new Date(biz.created_at).toLocaleDateString('en-PH') : '—'}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-5">
                    <CloneBusinessDialog
                      sourceId={biz.id}
                      sourceName={biz.name}
                      sourceSlug={biz.slug}
                      eligibleUsers={eligibleUsers}
                    />
                    <Link
                      href={`/${biz.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-primary-600 font-bold text-sm hover:underline"
                    >
                      View Page <i className="fas fa-external-link-alt text-xs"></i>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!businesses || businesses.length === 0) && (
          <div className="p-16 text-center text-gray-400">
            <i className="fas fa-building text-4xl mb-4 block opacity-20"></i>
            No businesses registered yet.
          </div>
        )}
      </div>
    </div>
  );
}

const AdminStatCard = ({ label, value, icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`w-14 h-14 ${bg} ${color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);
