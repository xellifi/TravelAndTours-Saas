import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'mywebpages Admin',
    short_name: 'Admin',
    description: 'System administration dashboard for mywebpages',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#1e293b',
    theme_color: '#0d9488',
    orientation: 'portrait',
    categories: ['business', 'productivity'],
    icons: [
      {
        src: '/icons/icon-admin.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-admin.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
