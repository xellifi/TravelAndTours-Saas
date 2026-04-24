'use client';

import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  pendingText?: string;
  className?: string;
};

export default function SubmitButton({ children, pendingText, className = '' }: Props) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`${className} inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity`}
    >
      {pending && (
        <span
          aria-hidden
          className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
        />
      )}
      <span>{pending ? pendingText ?? 'Saving…' : children}</span>
    </button>
  );
}
