import { MetadataRoute } from 'next';

export default async function manifest({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<MetadataRoute.Manifest> {
  const { slug } = await params;

  let name = 'Travel Agency';
  let logoUrl = '/icons/icon-travel.svg';

  try {
    const { createClient } = await import('@/utils/supabase/server');
    const supabase = await createClient();
    const { data } = await supabase
      .from('businesses')
      .select('name, logo_url')
      .eq('slug', slug)
      .single();
    if (data?.name) name = data.name;
    if (data?.logo_url) logoUrl = data.logo_url;
  } catch {}

  return {
    name,
    short_name: name.split(' ').slice(0, 2).join(' '),
    description: `Book travel services with ${name}`,
    start_url: `/${slug}`,
    display: 'standalone',
    background_color: '#134e4a',
    theme_color: '#0d9488',
    orientation: 'portrait',
    categories: ['travel', 'lifestyle'],
    icons: [
      {
        src: logoUrl,
        sizes: 'any',
        type: logoUrl.endsWith('.svg') ? 'image/svg+xml' : 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-travel.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  };
}
