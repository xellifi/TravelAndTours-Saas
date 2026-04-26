import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { requireActiveBusiness } from '@/lib/activeBusiness';

export const dynamic = 'force-dynamic';

export default async function BookingsView() {
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

  type BookingRow = {
    id: string;
    client_name: string | null;
    client_email: string | null;
    booking_date: string | null;
    status: string | null;
    services: { name: string | null } | null;
  };

  let bookings: BookingRow[] | null = null;
  let loadError: string | null = null;

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, client_name, client_email, booking_date, status, services(name)')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false });

    if (error) {
      loadError = error.message;
    } else {
      bookings = (data || []) as unknown as BookingRow[];
    }
  } catch (err) {
    loadError = err instanceof Error ? err.message : 'Unknown error';
  }

  async function updateBookingStatus(formData: FormData) {
    'use server';
    const ctx = await requireActiveBusiness();
    if (!ctx) return;
    const supabase = await createClient();
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    // Scope the update to the active business so users can't change bookings
    // they don't own even if the id is tampered with.
    await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .eq('business_id', ctx.business.id);
    revalidatePath('/dashboard/bookings');
  }

  const hasBookings = (bookings?.length ?? 0) > 0;

  if (loadError) {
    return (
      <div>
        <div className="mb-5 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Bookings for{' '}
            <span className="font-bold text-gray-700">{business.name}</span>.
          </p>
        </div>
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-gray-300">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
              <i className="fas fa-triangle-exclamation"></i>
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                Bookings table not set up yet
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                We couldn&apos;t load your bookings. This usually means the{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">bookings</code>{' '}
                table hasn&apos;t been created in your database yet. Run the{' '}
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">bookings_migration.sql</code>{' '}
                file in your Supabase SQL Editor to set it up, then refresh this page.
              </p>
              <details className="text-xs text-gray-500">
                <summary className="cursor-pointer font-semibold">Technical details</summary>
                <pre className="mt-2 p-3 bg-gray-50 rounded-lg overflow-auto whitespace-pre-wrap break-all">
                  {loadError}
                </pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusBadge = (status: string) =>
    status === 'approved' ? 'bg-green-100 text-green-700' :
    status === 'rejected' ? 'bg-red-100 text-red-700' :
    status === 'completed' ? 'bg-blue-100 text-blue-700' :
    'bg-yellow-100 text-yellow-700';

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">Manage Bookings</h1>
          <p className="text-gray-500 text-sm sm:text-base mt-1">
            Bookings for{' '}
            <span className="font-bold text-gray-700">{business.name}</span>.
          </p>
        </div>
        {hasBookings ? (
          <a
            href="/dashboard/bookings/export"
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            <i className="fas fa-download text-xs"></i>
            Export CSV
          </a>
        ) : (
          <span
            aria-disabled
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <i className="fas fa-download text-xs"></i>
            Export CSV
          </span>
        )}
      </div>

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-3">
        {bookings?.map((booking) => (
          <div key={booking.id} className="bg-white rounded-2xl border border-gray-300 p-4">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0 flex-1">
                <p className="font-bold text-gray-900 text-[15px] truncate">{booking.client_name}</p>
                <p className="text-xs text-gray-500 truncate">{booking.client_email}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap ${statusBadge(booking.status)}`}>
                {booking.status}
              </span>
            </div>
            <div className="text-xs text-gray-600 space-y-1 mb-3">
              <p><span className="text-gray-400 font-semibold">Service:</span> {booking.services?.name || 'N/A'}</p>
              <p><span className="text-gray-400 font-semibold">Date:</span> {new Date(booking.booking_date).toLocaleString()}</p>
            </div>
            <form action={updateBookingStatus}>
              <input type="hidden" name="id" value={booking.id} />
              <select
                name="status"
                onChange={(e) => e.target.form?.requestSubmit()}
                className="w-full text-xs font-bold border rounded-lg px-3 py-2 bg-gray-50 outline-none"
              >
                <option value="pending" disabled={booking.status === 'pending'}>Change Status</option>
                <option value="approved">Approve</option>
                <option value="completed">Complete</option>
                <option value="rejected">Reject</option>
              </select>
            </form>
          </div>
        ))}
        {bookings?.length === 0 && (
          <div className="p-8 text-center text-gray-400 text-sm bg-white rounded-2xl border border-gray-300">No bookings yet.</div>
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block bg-white rounded-3xl border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Service</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings?.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{booking.client_name}</p>
                    <p className="text-sm text-gray-500">{booking.client_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                    {booking.services?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(booking.booking_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2">
                        <form action={updateBookingStatus}>
                          <input type="hidden" name="id" value={booking.id} />
                          <select
                            name="status"
                            onChange={(e) => e.target.form?.requestSubmit()}
                            className="text-xs font-bold border rounded-lg px-2 py-1 outline-none"
                          >
                            <option value="pending" disabled={booking.status === 'pending'}>Change Status</option>
                            <option value="approved">Approve</option>
                            <option value="completed">Complete</option>
                            <option value="rejected">Reject</option>
                          </select>
                        </form>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bookings?.length === 0 && (
          <div className="p-12 text-center text-gray-400">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}
