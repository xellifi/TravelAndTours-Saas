import {
  getPlatform,
  readSocialLinks,
  type SocialLinkRecord,
} from '@/lib/socialPlatforms';

type Variant = 'dark' | 'light' | 'plain';

type Props = {
  /** Either the raw `business.social_links` value or an already-parsed array. */
  links: unknown;
  variant?: Variant;
  className?: string;
  /** Hides the wrapper entirely when there are no links. */
  hideIfEmpty?: boolean;
};

/**
 * Renders the icons for the business's configured social links. Used by the
 * public landing page templates.
 */
export default function SocialLinks({
  links,
  variant = 'dark',
  className = '',
  hideIfEmpty = false,
}: Props) {
  const list: SocialLinkRecord[] = Array.isArray(links)
    ? (links as SocialLinkRecord[])
    : readSocialLinks(links);

  const visible = list.filter((l) => getPlatform(l.platform) !== null);

  if (visible.length === 0) {
    if (hideIfEmpty) return null;
    return null;
  }

  const baseClass =
    variant === 'dark'
      ? 'bg-white/10 ring-1 ring-white/20 text-white hover:bg-accent-500 hover:ring-accent-500'
      : variant === 'light'
        ? 'bg-gray-100 ring-1 ring-gray-200 text-gray-700 hover:bg-primary-600 hover:text-white hover:ring-primary-600'
        : 'bg-transparent text-current hover:opacity-70';

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {visible.map((link) => {
        const platform = getPlatform(link.platform)!;
        const family = platform.isSolid ? 'fas' : 'fab';
        return (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.name}
            title={platform.name}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${baseClass}`}
          >
            <i className={`${family} ${platform.icon}`} />
          </a>
        );
      })}
    </div>
  );
}
