import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single();

  const currentPlan = subscription?.plan || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '₱0',
      period: '',
      color: 'text-gray-800',
      features: ['1 Landing Page', 'Travel Template only', '5 Bookings/month', 'Community Support'],
    },
    {
      id: 'starter',
      name: 'Starter',
      price: '₱299',
      period: '/month',
      color: 'text-blue-700',
      features: ['3 Landing Pages', '3 Templates', '50 Bookings/month', 'Email Support'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '₱799',
      period: '/month',
      color: 'text-primary-700',
      features: ['Unlimited Pages', 'All 5 Templates', 'Unlimited Bookings', 'Priority Support', 'Analytics'],
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '₱4,999',
      period: ' one-time',
      color: 'text-accent-700',
      features: ['Everything in Pro', 'One-time Payment', 'Lifetime Updates', 'VIP Support'],
    },
  ];

  // Platform payment info for plan upgrades
  const platformPayment = {
    gcash: { name: 'mywebpages Admin', number: '09XX XXX XXXX' },
    paymaya: { name: 'mywebpages Admin', number: '09XX XXX XXXX' },
    bank: { bank: 'BDO', name: 'mywebpages Inc.', number: '0000 0000 0000' },
  };

  return (
    <div>
      <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1">Subscription &amp; Billing</h1>
      <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-8">Manage your plan. Upgrade by sending manual payment via GCash, PayMaya, or bank transfer.</p>

      {/* Current Plan Banner */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-300 mb-5 sm:mb-8 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Current Plan</p>
          <h2 className="text-2xl sm:text-3xl font-black text-primary-600 uppercase">{currentPlan}</h2>
          {subscription?.current_period_end && (
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Renews on {new Date(subscription.current_period_end).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-50 rounded-2xl flex items-center justify-center flex-shrink-0">
          <i className="fas fa-crown text-xl sm:text-2xl text-primary-500"></i>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-10">
        {plans.map((plan) => {
          const isActive = currentPlan === plan.id;
          return (
            <div key={plan.id} className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border-2 flex flex-col transition-all ${
              isActive
                ? 'border-primary-500 bg-primary-50/30'
                : 'border-gray-300 bg-white hover:border-gray-400'
            }`}>
              {isActive && (
                <div className="text-[10px] sm:text-xs font-black text-primary-700 uppercase tracking-widest bg-primary-100 px-2.5 py-1 rounded-full self-start mb-3">
                  ✓ Active
                </div>
              )}
              <h3 className={`text-lg sm:text-xl font-black mb-1 ${plan.color}`}>{plan.name}</h3>
              <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 break-words">{plan.price}<span className="text-xs sm:text-sm text-gray-400 font-medium">{plan.period}</span></p>
              <ul className="space-y-2 sm:space-y-2.5 my-4 sm:my-5 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-medium">
                    <i className="fas fa-check text-primary-500 mt-0.5 flex-shrink-0 text-xs"></i> <span>{feat}</span>
                  </li>
                ))}
              </ul>
              {!isActive && (
                <a
                  href="#how-to-upgrade"
                  className="w-full py-2.5 sm:py-3 rounded-xl font-bold text-center btn-primary text-white text-sm shadow-md shadow-primary-100 block"
                >
                  Upgrade
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* How to Upgrade */}
      <div id="how-to-upgrade" className="bg-white rounded-2xl sm:rounded-3xl border border-gray-300 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">How to Upgrade</h2>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">Send payment via any of the methods below, then email us with your payment screenshot and the plan you want.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {/* GCash */}
          <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-mobile-alt text-lg sm:text-2xl text-blue-600"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">GCash</h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-2">Send to the following GCash account:</p>
              <div className="inline-flex flex-col gap-0.5 bg-blue-50 rounded-xl p-3 max-w-full">
                <span className="text-xs sm:text-sm font-bold text-gray-900 break-words">{platformPayment.gcash.name}</span>
                <span className="text-base sm:text-xl font-black text-blue-700 break-all">{platformPayment.gcash.number}</span>
              </div>
            </div>
          </div>

          {/* PayMaya */}
          <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-wallet text-lg sm:text-2xl text-green-600"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">PayMaya / Maya</h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-2">Send to the following Maya account:</p>
              <div className="inline-flex flex-col gap-0.5 bg-green-50 rounded-xl p-3 max-w-full">
                <span className="text-xs sm:text-sm font-bold text-gray-900 break-words">{platformPayment.paymaya.name}</span>
                <span className="text-base sm:text-xl font-black text-green-700 break-all">{platformPayment.paymaya.number}</span>
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="p-4 sm:p-6 flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-14 sm:h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-university text-lg sm:text-2xl text-orange-600"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">Bank Transfer</h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-2">Direct bank deposit or online transfer:</p>
              <div className="inline-flex flex-col gap-0.5 bg-orange-50 rounded-xl p-3 max-w-full">
                <span className="text-[10px] sm:text-xs font-bold text-orange-600 uppercase tracking-wide">{platformPayment.bank.bank}</span>
                <span className="text-xs sm:text-sm font-bold text-gray-900 break-words">{platformPayment.bank.name}</span>
                <span className="text-base sm:text-xl font-black text-orange-700 break-all">{platformPayment.bank.number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* After payment */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="fas fa-info-circle text-primary-600 text-sm sm:text-base"></i>
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm sm:text-base text-gray-900 mb-1">After sending payment</h4>
              <p className="text-xs sm:text-sm text-gray-600 break-words">
                Email your payment screenshot to <a href="mailto:support@mywebpages.live" className="text-primary-600 font-bold hover:underline break-all">support@mywebpages.live</a> with the subject <strong>&ldquo;Plan Upgrade – [Your Email]&rdquo;</strong>.
                Your plan will be activated within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
