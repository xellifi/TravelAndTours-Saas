import Link from 'next/link';
import { requireActiveBusiness } from '@/lib/activeBusiness';
import {
  readSocialLinks,
  getPlatform,
  SOCIAL_PLATFORMS,
} from '@/lib/socialPlatforms';
import AddSocialLinkForm from './AddSocialLinkForm';
import EditSocialLinkDialog from './EditSocialLinkDialog';
import DeleteSocialLinkButton from './DeleteSocialLinkButton';

export const dynamic = 'force-dynamic';

export default async function SocialLinksPage() {
  const ctx = await requireActiveBusiness();

  if (!ctx) {
    return (
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
        <p className="text-gray-500 mb-4">
          You don&apos;t have a business yet.
        </p>
        <Link
          href="/dashboard/businesses"
          className="btn-primary px-6 py-3 rounded-xl text-white font-bold inline-block text-sm"
        >
          Create your first business
        </Link>
      </div>
    );
  }

  const { business } = ctx;
  const links = readSocialLinks(business.social_links);

  return (
    <div>
      <div className="mb-5 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900">
          Social Links
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mt-1 max-w-2xl">
          Showing the social links visitors will see on{' '}
          <span className="font-bold text-gray-700">{business.name}</span>&apos;s
          landing page. Add as many as you want — they&apos;ll appear in the
          contact section of your public page.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 sm:gap-8 items-start">
        {/* Existing links */}
        <div className="lg:col-span-2 order-2 lg:order-1 space-y-3 sm:space-y-4">
          {links.length === 0 ? (
            <div className="p-6 sm:p-12 border-2 border-dashed border-gray-200 rounded-2xl sm:rounded-3xl text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center text-xl">
                <i className="fas fa-share-nodes"></i>
              </div>
              <p className="text-sm sm:text-base text-gray-500 mb-1">
                No social links yet.
              </p>
              <p className="text-xs sm:text-sm text-gray-400">
                Add your first one using the form on the right.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                {links.length} link{links.length === 1 ? '' : 's'}
              </p>
              {links.map((link) => {
                const platform = getPlatform(link.platform);
                const family = platform?.isSolid ? 'fas' : 'fab';
                const iconClass = platform?.icon || 'fa-link';
                const displayName = platform?.name || link.platform;
                const brand = platform?.brandClass || 'bg-gray-700 text-white';

                return (
                  <div
                    key={link.id}
                    className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4"
                  >
                    <div
                      className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${brand}`}
                    >
                      <i className={`${family} ${iconClass}`}></i>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-gray-900 text-sm sm:text-base">
                        {displayName}
                      </p>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs sm:text-sm text-gray-500 hover:text-primary-600 hover:underline break-all line-clamp-1"
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 flex-shrink-0">
                      <EditSocialLinkDialog link={link} />
                      <DeleteSocialLinkButton
                        id={link.id}
                        platformName={displayName}
                      />
                    </div>
                  </div>
                );
              })}
            </>
          )}

          {/* Supported platforms hint */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 sm:p-5">
            <p className="text-[11px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Supported platforms
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIAL_PLATFORMS.map((p) => (
                <span
                  key={p.id}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-[11px] sm:text-xs font-semibold text-gray-700"
                >
                  <i className={`${p.isSolid ? 'fas' : 'fab'} ${p.icon} text-gray-400`} />
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Add form */}
        <div className="order-1 lg:order-2 space-y-3">
          <AddSocialLinkForm />
          {business.slug && links.length > 0 && (
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
