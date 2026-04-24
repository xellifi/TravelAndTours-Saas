import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import type { User } from '@supabase/supabase-js';

export const ACTIVE_BUSINESS_COOKIE = 'mwp_active_business';

export type BusinessRow = {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  template_id: string | null;
  hero_images: string[] | null;
  created_at: string | null;
  [key: string]: unknown;
};

export type OwnerBusinessesResult = {
  user: User;
  businesses: BusinessRow[];
  active: BusinessRow | null;
};

/**
 * Loads every business owned by the signed-in user and resolves which one is
 * currently "active" based on the `mwp_active_business` cookie.
 *
 * Falls back to the user's oldest business when the cookie is missing or
 * points to a business they no longer own. Returns `null` if there is no
 * signed-in user.
 */
export async function getOwnerBusinesses(): Promise<OwnerBusinessesResult | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true });

  const list = (businesses || []) as unknown as BusinessRow[];

  const cookieStore = await cookies();
  const wantedId = cookieStore.get(ACTIVE_BUSINESS_COOKIE)?.value || null;
  const active =
    (wantedId && list.find((b) => b.id === wantedId)) || list[0] || null;

  return { user, businesses: list, active };
}

/**
 * Convenience helper for pages/actions that only need the active business.
 * Returns `null` when there is no signed-in user OR when the user has no
 * businesses yet.
 */
export async function requireActiveBusiness(): Promise<{
  user: User;
  business: BusinessRow;
} | null> {
  const result = await getOwnerBusinesses();
  if (!result || !result.active) return null;
  return { user: result.user, business: result.active };
}
