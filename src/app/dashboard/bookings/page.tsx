import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function BookingsView() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!business) return <p>Please create a business first.</p>;

  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, services(name)')
    .eq('business_id', business.id)
    .order('created_at', { ascending: false });

  async function updateBookingStatus(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const id = formData.get('id') as string;
    const status = formData.get('status') as string;
    await supabase.from('bookings').update({ status }).eq('id', id);
    revalidatePath('/dashboard/bookings');
  }

  const hasBookings = (bookings?.length ?? 0) > 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Manage Bookings</h1>
        {hasBookings ? (
          <a
            href="/dashboard/bookings/export"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Export CSV
          </a>
        ) : (
          <span
            aria-disabled
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-gray-100 text-gray-400 cursor-not-allowed"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Export CSV
          </span>
        )}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
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
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    booking.status === 'approved' ? 'bg-green-100 text-green-700' :
                    booking.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
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
        {bookings?.length === 0 && (
          <div className="p-12 text-center text-gray-400">No bookings yet.</div>
        )}
      </div>
    </div>
  );
}
