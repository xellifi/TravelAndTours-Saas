'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: 'fa-chart-line', exact: true },
  { href: '/admin/users', label: 'Users', icon: 'fa-users' },
  { href: '/admin/businesses', label: 'Businesses', icon: 'fa-building' },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-8 flex gap-1">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                active
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <i className={`fas ${link.icon} text-xs`} />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
