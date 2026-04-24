import type { Metadata } from 'next';
import { ReactNode } from 'react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    manifest: `/${slug}/manifest.webmanifest`,
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'Travel',
    },
    other: {
      'mobile-web-app-capable': 'yes',
    },
  };
}

export default function SlugLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
