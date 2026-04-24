import { createClient } from '@/utils/supabase/server';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Fetch stats (simplified for now)
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  let stats = { bookings: 0, inquiries: 0, services: 0 };

  if (business) {
    const { count: bookingsCount } = await supabase
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id);
    
    const { count: inquiriesCount } = await supabase
      .from('inquiries')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id);

    const { count: servicesCount } = await supabase
      .from('services')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', business.id);

    stats = { 
      bookings: bookingsCount || 0, 
      inquiries: inquiriesCount || 0,
      services: servicesCount || 0
    };
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Dashboard Overview</h1>
      
      {!business ? (
        <div className="bg-primary-50 border border-primary-200 p-8 rounded-3xl text-center">
            <h2 className="text-xl font-bold text-primary-900 mb-4">Complete your Profile</h2>
            <p className="text-primary-700 mb-6">You haven't created a business landing page yet. Let's get started!</p>
            <a href="/dashboard/settings" className="btn-primary px-8 py-3 rounded-full text-white font-bold inline-block">Create Business</a>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <StatCard icon="fa-calendar-check" label="Total Bookings" value={stats.bookings} color="text-green-600" bgColor="bg-green-100" />
            <StatCard icon="fa-envelope-open-text" label="New Inquiries" value={stats.inquiries} color="text-blue-600" bgColor="bg-blue-100" />
            <StatCard icon="fa-concierge-bell" label="Active Services" value={stats.services} color="text-purple-600" bgColor="bg-purple-100" />
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <div className="flex items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                No recent activity to show yet.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const StatCard = ({ icon, label, value, color, bgColor }: any) => (
  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-6">
    <div className={`w-16 h-16 ${bgColor} ${color} rounded-2xl flex items-center justify-center text-2xl`}>
      <i className={`fas ${icon}`}></i>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold text-gray-900">{value}</p>
    </div>
  </div>
);
