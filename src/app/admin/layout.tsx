import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminNav from './AdminNav';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'mywebpages Admin',
  manifest: '/admin/manifest.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Admin' },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Top Bar */}
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-y-2 min-h-14 py-2">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
              <span className="font-black text-lg text-gray-900 hidden sm:block">mywebpages</span>
            </Link>
            <span className="text-gray-200 text-xl hidden sm:block">|</span>
            <span className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-widest">System Admin</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <Link href="/dashboard" className="text-xs sm:text-sm font-bold text-gray-600 hover:text-primary-600 transition-colors whitespace-nowrap">
              <i className="fas fa-arrow-left mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Owner </span>Dashboard
            </Link>
            <form action="/auth/signout" method="post">
              <button className="text-xs sm:text-sm font-bold text-gray-400 hover:text-red-500 transition-colors">
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Sub Nav */}
        <AdminNav />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
