import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import TemplateRenderer from '@/modules/templates/TemplateRenderer';

export const revalidate = 60;

export default async function BusinessLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch business info first — we need its id for the rest.
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (businessError || !business) {
    return notFound();
  }

  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  // Run the rest of the queries in parallel — they all key off business.id /
  // owner_id and were previously sequential, which made the page feel slow.
  const [
    { data: services },
    { data: paymentSettings },
    { count: monthlyBookings },
    { data: subscription },
  ] = await Promise.all([
    supabase
      .from('services')
      .select('*')
      .eq('business_id', business.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('payment_settings')
      .select('*')
      .eq('business_id', business.id)
      .maybeSingle(),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id)
      .gte('created_at', firstDayOfMonth.toISOString()),
    supabase
      .from('subscriptions')
      .select('plan')
      .eq('user_id', business.owner_id)
      .maybeSingle(),
  ]);

  const plan = subscription?.plan || 'free';
  const maxBookings =
    plan === 'pro' || plan === 'lifetime' ? 9999 : plan === 'starter' ? 50 : 5;
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
