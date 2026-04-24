import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import AddHeroImageForm from './AddHeroImageForm';
import { deleteHeroImageAction } from './actions';
import { MAX_HERO_IMAGES } from './constants';

export const dynamic = 'force-dynamic';

export default async function HeroImagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: business } = await supabase
    .from('businesses')
    .select('id, slug, hero_images')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!business) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500">
          Please create your business first in{' '}
          <Link
            href="/dashboard/settings"
            className="text-primary-600 font-bold hover:underline"
          >
            Business Settings
          </Link>
          .
        </p>
      </div>
    );
  }

  const heroImages: string[] = Array.isArray(business.hero_images)
    ? business.hero_images.filter(Boolean)
    : [];
  const remainingSlots = Math.max(0, MAX_HERO_IMAGES - heroImages.length);

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">
          Main Page Images
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-2xl">
          Upload up to {MAX_HERO_IMAGES} photos to feature in the hero section
          of your landing page. They&apos;ll rotate automatically.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-8 items-start">
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-4">
          {heroImages.length === 0 ? (
            <div className="p-6 sm:p-12 border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl text-center text-sm text-gray-400">
              No images yet. Add your first one using the form.
              <br />
              While empty, your hero will show your business logo as a fallback.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {heroImages.map((url, i) => (
                <div
                  key={url}
                  className="relative group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <Image
                      src={url}
                      alt={`Hero image ${i + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-sm">
                      #{i + 1}
                    </div>
                  </div>
                  <form
                    action={deleteHeroImageAction}
                    className="p-2 sm:p-3 flex items-center justify-end"
                  >
                    <input type="hidden" name="url" value={url} />
                    <button
                      className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5"
                      aria-label={`Delete hero image ${i + 1}`}
                    >
                      <i className="fas fa-trash text-xs" /> <span className="hidden sm:inline">Delete</span>
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3 order-1 lg:order-2">
          <AddHeroImageForm remainingSlots={remainingSlots} />
          {business.slug && heroImages.length > 0 && (
            <Link
              href={`/${business.slug}`}
              target="_blank"
              className="block text-center px-4 py-3 rounded-xl bg-primary-50 text-primary-700 font-bold text-sm hover:bg-primary-100 transition-all"
            >
              <i className="fas fa-external-link-alt mr-2" />
              View live page
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
