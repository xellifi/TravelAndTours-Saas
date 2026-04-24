export type SocialPlatformId =
  | 'facebook'
  | 'messenger'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'whatsapp'
  | 'telegram'
  | 'viber'
  | 'website';

export type SocialPlatform = {
  id: SocialPlatformId;
  name: string;
  /** Font Awesome class (without the family prefix). */
  icon: string;
  /** Set to `true` for plain icons (`fas`), otherwise `fab` brand. */
  isSolid?: boolean;
  /** Helpful placeholder shown in the URL input. */
  placeholder: string;
  /** Brand-ish accent color used for the chip badge. */
  brandClass: string;
};

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'fa-facebook-f',
    placeholder: 'https://facebook.com/your-page',
    brandClass: 'bg-[#1877F2] text-white',
  },
  {
    id: 'messenger',
    name: 'Messenger',
    icon: 'fa-facebook-messenger',
    placeholder: 'https://m.me/your-page',
    brandClass: 'bg-[#0084FF] text-white',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'fa-instagram',
    placeholder: 'https://instagram.com/your-handle',
    brandClass:
      'bg-gradient-to-br from-[#feda75] via-[#fa7e1e] to-[#d62976] text-white',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'fa-tiktok',
    placeholder: 'https://tiktok.com/@your-handle',
    brandClass: 'bg-black text-white',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'fa-youtube',
    placeholder: 'https://youtube.com/@your-channel',
    brandClass: 'bg-[#FF0000] text-white',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'fa-x-twitter',
    placeholder: 'https://x.com/your-handle',
    brandClass: 'bg-black text-white',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'fa-linkedin-in',
    placeholder: 'https://linkedin.com/company/your-page',
    brandClass: 'bg-[#0A66C2] text-white',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: 'fa-whatsapp',
    placeholder: 'https://wa.me/63XXXXXXXXXX',
    brandClass: 'bg-[#25D366] text-white',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    icon: 'fa-telegram',
    placeholder: 'https://t.me/your-handle',
    brandClass: 'bg-[#26A5E4] text-white',
  },
  {
    id: 'viber',
    name: 'Viber',
    icon: 'fa-viber',
    placeholder: 'viber://chat?number=63XXXXXXXXXX',
    brandClass: 'bg-[#7360F2] text-white',
  },
  {
    id: 'website',
    name: 'Website',
    icon: 'fa-globe',
    isSolid: true,
    placeholder: 'https://your-website.com',
    brandClass: 'bg-gray-700 text-white',
  },
];

const PLATFORM_MAP = new Map<string, SocialPlatform>(
  SOCIAL_PLATFORMS.map((p) => [p.id, p]),
);

export function getPlatform(id: string | null | undefined): SocialPlatform | null {
  if (!id) return null;
  return PLATFORM_MAP.get(id) || null;
}

/** Shape of a single social link as stored on `businesses.social_links`. */
export type SocialLinkRecord = {
  id: string;
  platform: SocialPlatformId | string;
  url: string;
};

/**
 * Reads `business.social_links` defensively — accepts any unknown shape and
 * keeps only items that look like real links.
 */
export function readSocialLinks(
  raw: unknown,
): SocialLinkRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (x): x is SocialLinkRecord =>
        !!x &&
        typeof x === 'object' &&
        typeof (x as SocialLinkRecord).id === 'string' &&
        typeof (x as SocialLinkRecord).platform === 'string' &&
        typeof (x as SocialLinkRecord).url === 'string' &&
        (x as SocialLinkRecord).url.trim().length > 0,
    )
    .map((x) => ({
      id: x.id,
      platform: x.platform,
      url: x.url,
    }));
}

const URL_PREFIXES = [
  'http://',
  'https://',
  'mailto:',
  'tel:',
  'viber://',
  'sms:',
];

/**
 * Light validation + normalization: trims, auto-prefixes `https://` when the
 * input is clearly a bare domain, returns `null` if the URL is empty or
 * obviously broken.
 */
export function normalizeUrl(input: string): string | null {
  const v = (input || '').trim();
  if (!v) return null;

  const lower = v.toLowerCase();
  if (URL_PREFIXES.some((p) => lower.startsWith(p))) {
    return v;
  }

  // Bare domain like "facebook.com/foo" — assume https.
  if (/^[a-z0-9.-]+\.[a-z]{2,}/i.test(v)) {
    return `https://${v}`;
  }

  return null;
}
