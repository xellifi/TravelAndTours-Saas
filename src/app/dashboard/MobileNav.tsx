'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

type MenuItem = { name: string; href: string; icon: string };

type Props = {
  menuItems: MenuItem[];
  bottomItems: MenuItem[];
  displayName: string;
  business: { name: string; slug: string } | null;
  isAdmin: boolean;
};

export default function MobileNav({
  menuItems,
  bottomItems,
  displayName,
  business,
  isAdmin,
}: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const activeItem =
    [...menuItems].reverse().find((m) =>
      m.href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(m.href),
    ) || menuItems[0];

  return (
    <>
      {/* Mobile App Bar */}
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="flex items-center justify-between h-14 px-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="w-11 h-11 -ml-1 flex items-center justify-center rounded-full text-gray-700 active:bg-gray-100"
          >
            <i className="fas fa-bars text-lg"></i>
          </button>
          <div className="flex-1 min-w-0 px-2 text-center">
            <p className="text-base font-extrabold text-gray-900 truncate leading-tight">
              {activeItem.name}
            </p>
            {business && (
              <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider truncate leading-tight">
                {business.name}
              </p>
            )}
          </div>
          <Link
            href="/dashboard/profile"
            aria-label="Profile"
            className="w-10 h-10 -mr-1 flex items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white font-black uppercase text-sm"
          >
            {displayName[0]}
          </Link>
        </div>
      </header>

      {/* Drawer Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md shadow-primary-100">
                M
              </div>
              <span className="font-black text-xl text-gray-900">mywebpages</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="w-10 h-10 flex items-center justify-center rounded-full text-gray-500 active:bg-gray-100"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
          {business && (
            <div className="mt-4 px-3.5 py-2.5 bg-primary-50 rounded-xl">
              <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest mb-0.5">
                Active Page
              </p>
              <p className="text-sm font-bold text-gray-800 truncate">{business.name}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl transition-colors ${
                  active
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 active:bg-gray-100'
                }`}
              >
                <i
                  className={`fas ${item.icon} w-5 text-center text-base ${
                    active ? 'text-primary-600' : 'text-gray-400'
                  }`}
                ></i>
                <span className="text-[15px] font-semibold">{item.name}</span>
              </Link>
            );
          })}

          {isAdmin && (
            <div className="pt-3 mt-3 border-t border-gray-100">
              <Link
                href="/admin"
                className="flex items-center gap-3.5 px-4 py-3.5 text-red-600 font-bold rounded-xl active:bg-red-50 text-[15px]"
              >
                <i className="fas fa-shield-alt w-5 text-center"></i> System Admin
              </Link>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-3" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}>
          {business && (
            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-bold text-xs uppercase tracking-widest active:bg-primary-100"
            >
              <i className="fas fa-external-link-alt text-xs"></i> View My Page
            </Link>
          )}
          <div className="flex items-center gap-3 px-1">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-black uppercase text-sm flex-shrink-0">
              {displayName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
              <form action="/auth/signout" method="post">
                <button className="text-xs text-gray-500 active:text-red-500 mt-0.5">
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Bottom Tab Bar */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-5 h-16">
          {bottomItems.slice(0, 4).map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === '/dashboard'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-0.5 ${
                  active ? 'text-primary-600' : 'text-gray-500'
                }`}
              >
                <i className={`fas ${item.icon} text-[17px]`}></i>
                <span className="text-[10px] font-bold leading-none mt-0.5">{item.name}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-gray-500 active:text-primary-600"
          >
            <i className="fas fa-ellipsis-h text-[17px]"></i>
            <span className="text-[10px] font-bold leading-none mt-0.5">More</span>
          </button>
        </div>
      </nav>
    </>
  );
}
