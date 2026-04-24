import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .single();

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name')
    .eq('id', user.id)
    .single();

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const isAdmin = profile?.role === 'admin';

  const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: 'fa-chart-pie' },
    { name: 'Services', href: '/dashboard/services', icon: 'fa-list' },
    { name: 'Main Page Images', href: '/dashboard/hero-images', icon: 'fa-images' },
    { name: 'Bookings', href: '/dashboard/bookings', icon: 'fa-calendar-check' },
    { name: 'Inquiries', href: '/dashboard/inquiries', icon: 'fa-envelope-open-text' },
    { name: 'Business Settings', href: '/dashboard/settings', icon: 'fa-building' },
    { name: 'Profile', href: '/dashboard/profile', icon: 'fa-user-circle' },
    { name: 'Billing & Plans', href: '/dashboard/billing', icon: 'fa-credit-card' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 shadow-sm z-30">
        {/* Logo */}
        <div className="p-6 border-b border-gray-50">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-md shadow-primary-100">
              M
            </div>
            <span className="font-black text-xl text-gray-900">mywebpages</span>
          </Link>
          {business && (
            <div className="mt-4 px-3 py-2.5 bg-primary-50 rounded-xl">
              <p className="text-xs font-bold text-primary-700 uppercase tracking-widest mb-0.5">Active Page</p>
              <p className="text-sm font-bold text-gray-800 truncate">{business.name}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3.5 px-4 py-3 text-gray-600 font-medium hover:bg-primary-50 hover:text-primary-700 rounded-xl transition-all group"
            >
              <i className={`fas ${item.icon} w-4 text-center text-gray-400 group-hover:text-primary-600 transition-colors`}></i>
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}

          {isAdmin && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                href="/admin"
                className="flex items-center gap-3.5 px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-all text-sm"
              >
                <i className="fas fa-shield-alt w-4 text-center"></i> System Admin
              </Link>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          {business && (
            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-50 text-primary-700 font-bold text-xs uppercase tracking-widest hover:bg-primary-100 transition-all mb-3"
            >
              <i className="fas fa-external-link-alt text-xs"></i> View My Page
            </Link>
          )}

          {/* User info */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-black uppercase text-sm flex-shrink-0">
              {displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
              <form action="/auth/signout" method="post">
                <button className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-0.5">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-10 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="text-sm text-gray-500">
            Welcome back, <span className="font-bold text-gray-800">{displayName}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/profile" className="w-9 h-9 bg-gray-100 hover:bg-primary-50 rounded-full flex items-center justify-center text-gray-500 hover:text-primary-600 transition-all">
              <i className="fas fa-user text-sm"></i>
            </Link>
          </div>
        </div>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
