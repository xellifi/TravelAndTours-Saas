'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { setActiveBusinessAction } from './businesses/actions';

type BusinessLite = { id: string; name: string; slug: string };

type Props = {
  active: BusinessLite | null;
  businesses: BusinessLite[];
  layout?: 'sidebar' | 'drawer';
};

export default function BusinessSwitcher({
  active,
  businesses,
  layout = 'sidebar',
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!active) {
    return (
      <Link
        href="/dashboard/businesses"
        className={
          layout === 'sidebar'
            ? 'mt-4 block px-3 py-2.5 bg-primary-50 rounded-xl text-center text-xs font-bold text-primary-700 uppercase tracking-widest hover:bg-primary-100 transition-all'
            : 'mt-4 block px-3.5 py-2.5 bg-primary-50 rounded-xl text-center text-xs font-bold text-primary-700 uppercase tracking-widest active:bg-primary-100'
        }
      >
        + Create your first business
      </Link>
    );
  }

  const others = businesses.filter((b) => b.id !== active.id);

  return (
    <div ref={ref} className="relative mt-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-3 py-2.5 bg-primary-50 rounded-xl flex items-center justify-between gap-2 text-left hover:bg-primary-100 transition-all"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-primary-700 uppercase tracking-widest mb-0.5">
            Active Page
          </p>
          <p className="text-sm font-bold text-gray-800 truncate">
            {active.name}
          </p>
        </div>
        <i
          className={`fas fa-chevron-down text-xs text-primary-700 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        ></i>
      </button>

      {open && (
        <div
          className={`absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden ${
            layout === 'drawer' ? '' : ''
          }`}
        >
          {others.length > 0 ? (
            <div className="max-h-64 overflow-y-auto">
              <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Switch to
              </p>
              {others.map((b) => (
                <form key={b.id} action={setActiveBusinessAction}>
                  <input type="hidden" name="business_id" value={b.id} />
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2.5 hover:bg-primary-50 transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-arrow-right-arrow-left text-[10px] text-gray-400"></i>
                    <span className="text-sm font-semibold text-gray-700 truncate">
                      {b.name}
                    </span>
                  </button>
                </form>
              ))}
            </div>
          ) : (
            <p className="px-4 py-3 text-xs text-gray-400">
              You only have one business right now.
            </p>
          )}

          <div className="border-t border-gray-100 bg-gray-50">
            <Link
              href="/dashboard/businesses"
              onClick={() => setOpen(false)}
              className="block px-4 py-3 text-sm font-bold text-primary-700 hover:bg-primary-50 transition-colors"
            >
              <i className="fas fa-cog text-xs mr-2"></i>
              Manage businesses
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
