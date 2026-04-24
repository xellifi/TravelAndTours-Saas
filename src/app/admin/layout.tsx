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
    <div
      className="min-h-screen bg-gray-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Admin Top Bar */}
      <header
        className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-8 flex items-center justify-between gap-2 min-h-14 py-2">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center text-white font-black text-sm">M</div>
              <span className="font-black text-lg text-gray-900 hidden sm:block">mywebpages</span>
            </Link>
            <span className="text-gray-200 text-xl hidden sm:block">|</span>
            <span className="text-[10px] sm:text-sm font-bold text-red-600 uppercase tracking-widest leading-tight">
              <span className="sm:hidden">Admin</span>
              <span className="hidden sm:inline">System Admin</span>
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <Link href="/dashboard" className="inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-3 sm:py-2 rounded-full sm:rounded-md text-sm font-bold text-gray-600 hover:text-primary-600 hover:bg-gray-100 sm:hover:bg-transparent transition-colors whitespace-nowrap">
              <i className="fas fa-arrow-left text-base sm:text-sm sm:mr-2"></i>
              <span className="hidden sm:inline">Owner Dashboard</span>
            </Link>
            <form action="/auth/signout" method="post">
              <button
                aria-label="Sign out"
                className="inline-flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-2 rounded-full sm:rounded-md text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-gray-100 sm:hover:bg-transparent transition-colors"
              >
                <i className="fas fa-sign-out-alt text-base sm:hidden"></i>
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Sub Nav */}
        <AdminNav />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-5 sm:py-10">
        {children}
      </main>
    </div>
  );
}
