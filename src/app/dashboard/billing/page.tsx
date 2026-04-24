import { createClient } from '@/utils/supabase/server';

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
      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Subscription & Billing</h1>
      <p className="text-gray-500 mb-10">Manage your plan. Upgrade by sending manual payment via GCash, PayMaya, or bank transfer.</p>

      {/* Current Plan Banner */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Plan</p>
          <h2 className="text-3xl font-black text-primary-600 uppercase">{currentPlan}</h2>
          {subscription?.current_period_end && (
            <p className="text-sm text-gray-500 mt-1">
              Renews on {new Date(subscription.current_period_end).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
        <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
          <i className="fas fa-crown text-2xl text-primary-500"></i>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const isActive = currentPlan === plan.id;
          return (
            <div key={plan.id} className={`p-8 rounded-[2rem] border-2 flex flex-col transition-all ${
              isActive
                ? 'border-primary-500 bg-primary-50/30 shadow-lg shadow-primary-50'
                : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm hover:shadow-md'
            }`}>
              {isActive && (
                <div className="text-xs font-black text-primary-700 uppercase tracking-widest bg-primary-100 px-3 py-1 rounded-full self-start mb-4">
                  ✓ Active
                </div>
              )}
              <h3 className={`text-xl font-black mb-1 ${plan.color}`}>{plan.name}</h3>
              <p className="text-3xl font-extrabold text-gray-900 mb-1">{plan.price}<span className="text-sm text-gray-400 font-medium">{plan.period}</span></p>
              <ul className="space-y-3 my-6 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2 text-sm text-gray-600 font-medium">
                    <i className="fas fa-check text-primary-500 mt-0.5 flex-shrink-0"></i> {feat}
                  </li>
                ))}
              </ul>
              {!isActive && (
                <a
                  href="#how-to-upgrade"
                  className="w-full py-3 rounded-xl font-bold text-center btn-primary text-white shadow-md shadow-primary-100 block"
                >
                  Upgrade to {plan.name}
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* How to Upgrade */}
      <div id="how-to-upgrade" className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">How to Upgrade</h2>
          <p className="text-gray-500 mt-1">Send payment via any of the methods below, then email us with your payment screenshot and the plan you want.</p>
        </div>

        <div className="divide-y divide-gray-100">
          {/* GCash */}
          <div className="p-8 flex items-start gap-6">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-mobile-alt text-2xl text-blue-600"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">GCash</h3>
              <p className="text-gray-500 text-sm mb-3">Send to the following GCash account:</p>
              <div className="inline-flex flex-col gap-1 bg-blue-50 rounded-xl p-4">
                <span className="text-sm font-bold text-gray-900">{platformPayment.gcash.name}</span>
                <span className="text-xl font-black text-blue-700">{platformPayment.gcash.number}</span>
              </div>
            </div>
          </div>

          {/* PayMaya */}
          <div className="p-8 flex items-start gap-6">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-wallet text-2xl text-green-600"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">PayMaya / Maya</h3>
              <p className="text-gray-500 text-sm mb-3">Send to the following Maya account:</p>
              <div className="inline-flex flex-col gap-1 bg-green-50 rounded-xl p-4">
                <span className="text-sm font-bold text-gray-900">{platformPayment.paymaya.name}</span>
                <span className="text-xl font-black text-green-700">{platformPayment.paymaya.number}</span>
              </div>
            </div>
          </div>

          {/* Bank Transfer */}
          <div className="p-8 flex items-start gap-6">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-university text-2xl text-orange-600"></i>
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">Bank Transfer</h3>
              <p className="text-gray-500 text-sm mb-3">Direct bank deposit or online transfer:</p>
              <div className="inline-flex flex-col gap-1 bg-orange-50 rounded-xl p-4">
                <span className="text-xs font-bold text-orange-600 uppercase tracking-wide">{platformPayment.bank.bank}</span>
                <span className="text-sm font-bold text-gray-900">{platformPayment.bank.name}</span>
                <span className="text-xl font-black text-orange-700">{platformPayment.bank.number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* After payment */}
        <div className="p-8 bg-gray-50 border-t border-gray-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="fas fa-info-circle text-primary-600"></i>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">After sending payment</h4>
              <p className="text-sm text-gray-600">
                Email your payment screenshot to <a href="mailto:support@mywebpages.live" className="text-primary-600 font-bold hover:underline">support@mywebpages.live</a> with the subject <strong>"Plan Upgrade – [Your Email]"</strong>.
                Your plan will be activated within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
