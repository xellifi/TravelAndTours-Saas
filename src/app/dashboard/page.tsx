import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { requireActiveBusiness } from '@/lib/activeBusiness';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const ctx = await requireActiveBusiness();

  if (!ctx) {
    return (
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-5 sm:mb-8">
          Dashboard Overview
        </h1>
        <div className="bg-primary-50 border border-primary-200 p-6 sm:p-8 rounded-2xl sm:rounded-3xl text-center">
          <h2 className="text-lg sm:text-xl font-bold text-primary-900 mb-3 sm:mb-4">
            Create your first business
          </h2>
          <p className="text-primary-700 text-sm sm:text-base mb-5 sm:mb-6">
            You haven&apos;t created a business landing page yet. Let&apos;s get
            started!
          </p>
          <Link
            href="/dashboard/businesses"
            className="btn-primary px-7 py-3 rounded-full text-white font-bold inline-block text-sm sm:text-base"
          >
            Add a Business
          </Link>
        </div>
      </div>
    );
  }

  const { business } = ctx;
  const supabase = await createClient();

  const [{ count: bookingsCount }, { count: inquiriesCount }, { count: servicesCount }] =
    await Promise.all([
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', business.id),
      supabase
        .from('inquiries')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', business.id),
      supabase
        .from('services')
        .select('id', { count: 'exact', head: true })
        .eq('business_id', business.id),
    ]);

  const stats = {
    bookings: bookingsCount || 0,
    inquiries: inquiriesCount || 0,
    services: servicesCount || 0,
  };

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1">
          Showing stats for{' '}
          <span className="font-bold text-gray-700">{business.name}</span>.{' '}
          <Link
            href="/dashboard/businesses"
            className="text-primary-600 font-bold hover:underline"
          >
            Switch business
          </Link>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 mb-6 sm:mb-10">
        <StatCard
          icon="fa-calendar-check"
          label="Total Bookings"
          value={stats.bookings}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon="fa-envelope-open-text"
          label="New Inquiries"
          value={stats.inquiries}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon="fa-concierge-bell"
          label="Active Services"
          value={stats.services}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
      </div>

      <div className="bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-300">
        <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Recent Activity</h3>
        <div className="flex items-center justify-center h-32 sm:h-40 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-2xl px-4 text-center">
          No recent activity to show yet.
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: string;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-300 flex items-center gap-4 sm:gap-5">
    <div
      className={`w-12 h-12 sm:w-14 sm:h-14 ${bgColor} ${color} rounded-2xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0`}
    >
      <i className={`fas ${icon}`}></i>
    </div>
    <div className="min-w-0">
      <p className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider leading-tight">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
        {value}
      </p>
    </div>
  </div>
);
