import { createClient } from '@/utils/supabase/server';

export type Plan = 'free' | 'starter' | 'pro' | 'lifetime';

export interface PlanLimits {
  maxLandings: number;
  templatesAllowed: string[];
  maxBookingsPerMonth: number;
}

const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxLandings: 1,
    templatesAllowed: ['travel'],
    maxBookingsPerMonth: 5,
  },
  starter: {
    maxLandings: 3,
    templatesAllowed: ['travel', 'restaurant', 'fitness'],
    maxBookingsPerMonth: 50,
  },
  pro: {
    maxLandings: 999,
    templatesAllowed: ['travel', 'restaurant', 'fitness', 'salon', 'corporate'],
    maxBookingsPerMonth: 9999,
  },
  lifetime: {
    maxLandings: 999,
    templatesAllowed: ['travel', 'restaurant', 'fitness', 'salon', 'corporate'],
    maxBookingsPerMonth: 9999,
  },
};

export async function getSubscriptionLimits(userId: string): Promise<PlanLimits> {
  const supabase = await createClient();

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', userId)
    .single();

  const plan = (subscription?.plan as Plan) || 'free';
  return PLAN_LIMITS[plan];
}

export { PLAN_LIMITS };
