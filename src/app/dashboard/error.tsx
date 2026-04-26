'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[dashboard error]', error);
  }, [error]);

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-300 p-6 sm:p-10">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
          <i className="fas fa-circle-exclamation"></i>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-1">
            Something went wrong on this page
          </h1>
          <p className="text-sm text-gray-600">
            The page failed to render. Details below — share them if you need
            help debugging.
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Error message
          </p>
          <pre className="whitespace-pre-wrap break-all text-gray-800 text-xs font-mono">
            {error.message || '(no message — production build hides details)'}
          </pre>
        </div>

        {error.digest && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Digest
            </p>
            <pre className="whitespace-pre-wrap break-all text-gray-800 text-xs font-mono">
              {error.digest}
            </pre>
            <p className="text-[11px] text-gray-500 mt-2">
              Look this digest up in your Vercel function logs to see the full
              stack trace.
            </p>
          </div>
        )}

        {error.stack && (
          <details className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Stack trace
            </summary>
            <pre className="whitespace-pre-wrap break-all text-gray-700 text-xs font-mono mt-2">
              {error.stack}
            </pre>
          </details>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          <i className="fas fa-rotate-right text-xs"></i>
          Try again
        </button>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          <i className="fas fa-house text-xs"></i>
          Back to dashboard
        </a>
      </div>
    </div>
  );
}
