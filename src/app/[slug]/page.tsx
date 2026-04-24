import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import TemplateRenderer from '@/modules/templates/TemplateRenderer';

export default async function BusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch business info
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (businessError || !business) {
    return notFound();
  }

  // Fetch services for this business
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', business.id)
    .order('created_at', { ascending: true });

  // Fetch payment settings for this business
  const { data: paymentSettings } = await supabase
    .from('payment_settings')
    .select('*')
    .eq('business_id', business.id)
    .single();

  // Check booking limits (5 per month on free plan, etc.)
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const { count: monthlyBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', business.id)
    .gte('created_at', firstDayOfMonth.toISOString());

  // Get plan limits from subscriptions
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan')
    .eq('user_id', business.owner_id)
    .single();

  const plan = subscription?.plan || 'free';
  const maxBookings = plan === 'pro' || plan === 'lifetime' ? 9999 : plan === 'starter' ? 50 : 5;
  const bookingLimitReached = (monthlyBookings || 0) >= maxBookings;

  return (
    <main>
      <TemplateRenderer
        business={business}
        services={services || []}
        bookingLimitReached={bookingLimitReached}
        paymentSettings={paymentSettings || null}
      />
    </main>
  );
}
