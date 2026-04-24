import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function MarketingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const features = [
    {
      icon: 'fa-layer-group',
      title: 'Multi-Tenant',
      desc: 'Every business gets isolated data with strict row-level security policies — your data is always private.',
      color: 'from-teal-500 to-teal-700',
      bg: 'bg-teal-50',
      text: 'text-teal-600',
    },
    {
      icon: 'fa-magic',
      title: 'Dynamic Templates',
      desc: '5+ premium templates ready for travel, restaurants, gyms, salons, and corporate businesses.',
      color: 'from-orange-500 to-orange-700',
      bg: 'bg-orange-50',
      text: 'text-orange-600',
    },
    {
      icon: 'fa-calendar-check',
      title: 'Booking System',
      desc: 'Clients can book directly from your landing page. Approve, complete, or reject bookings from your dashboard.',
      color: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
    },
    {
      icon: 'fa-envelope-open-text',
      title: 'Inquiry Management',
      desc: 'Capture leads and inquiries from your landing page and reply via email with one click.',
      color: 'from-purple-500 to-purple-700',
      bg: 'bg-purple-50',
      text: 'text-purple-600',
    },
    {
      icon: 'fa-qrcode',
      title: 'GCash & PayMaya',
      desc: 'Accept manual payments via GCash, PayMaya, and bank transfer. Display your QR codes seamlessly.',
      color: 'from-green-500 to-green-700',
      bg: 'bg-green-50',
      text: 'text-green-600',
    },
    {
      icon: 'fa-shield-alt',
      title: 'Secure by Supabase',
      desc: 'Enterprise-grade authentication and real-time database powered by Supabase — built for production.',
      color: 'from-rose-500 to-rose-700',
      bg: 'bg-rose-50',
      text: 'text-rose-600',
    },
  ];

  const plans = [
    { name: 'Free', price: '₱0', period: '', highlight: false, features: ['1 Landing Page', 'Travel Template', '5 Bookings/month', 'Basic Support'] },
    { name: 'Starter', price: '₱299', period: '/mo', highlight: false, features: ['3 Landing Pages', '3 Templates', '50 Bookings/month', 'Email Support'] },
    { name: 'Pro', price: '₱799', period: '/mo', highlight: true, features: ['Unlimited Pages', 'All 5 Templates', 'Unlimited Bookings', 'Priority Support', 'Analytics'] },
    { name: 'Lifetime', price: '₱4,999', period: '', highlight: false, features: ['Everything in Pro', 'One-time Payment', 'Lifetime Updates', 'VIP Support'] },
  ];

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-md shadow-primary-200 flex-shrink-0">
              M
            </div>
            <span className="font-black text-base sm:text-xl text-gray-900 tracking-tight truncate">mywebpages</span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Demo', href: '/jorickz' },
            ].map((l) => (
              <a key={l.label} href={l.href} className="nav-link text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {user ? (
              <Link href="/dashboard" className="btn-primary px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-lg shadow-primary-100 whitespace-nowrap">
                Dashboard <i className="fas fa-arrow-right ml-1 text-[10px] sm:text-xs"></i>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:inline-block text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors px-4 py-2 whitespace-nowrap">
                  Sign In
                </Link>
                <Link href="/login" className="btn-primary px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-white font-bold text-xs sm:text-sm shadow-lg shadow-primary-100 whitespace-nowrap">
                  <span className="sm:hidden">Get Started</span>
                  <span className="hidden sm:inline">Get Started Free</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-primary-900 to-gray-900 pt-16">
        {/* Background pattern */}
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-950/60"></div>

        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl float-anim"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl float-anim" style={{ animationDelay: '3s' }}></div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white/90 text-sm font-medium">Live & Production Ready</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
            Build Your Business<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-accent-500">
              Website in Minutes
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate platform for travel agencies, restaurants, gyms & more.
            Create stunning landing pages, manage bookings, and accept payments via GCash, PayMaya & bank transfer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" className="btn-primary px-8 py-4 rounded-full text-white font-bold text-lg shadow-2xl shadow-accent-500/30 inline-flex items-center justify-center gap-2">
              Start for Free <i className="fas fa-arrow-right text-sm"></i>
            </Link>
            <Link href="/jorickz" target="_blank" className="btn-secondary px-8 py-4 rounded-full text-white font-bold text-lg inline-flex items-center justify-center gap-2">
              <i className="fas fa-eye text-sm"></i> View Demo
            </Link>
          </div>

          <p className="mt-6 text-white/40 text-sm">No credit card needed · Free plan available · Setup in 2 minutes</p>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-600 font-bold text-sm uppercase tracking-widest">Everything you need</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">Built for Real Businesses</h2>
            <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">Every feature you need to launch, manage, and grow your online presence.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className={`w-14 h-14 ${f.bg} ${f.text} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner`}>
                  <i className={`fas ${f.icon}`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-accent-600 font-bold text-sm uppercase tracking-widest">Simple Pricing</span>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mt-3">Pay via GCash or PayMaya</h2>
            <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">Choose a plan and upgrade anytime by sending manual payment. No subscription traps.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-[2rem] p-8 border-2 flex flex-col transition-all ${
                plan.highlight
                  ? 'border-primary-500 bg-gradient-to-b from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-200 scale-105'
                  : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm hover:shadow-md'
              }`}>
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent-500 text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2 text-sm font-medium ${plan.highlight ? 'text-white/80' : 'text-gray-600'}`}>
                      <i className={`fas fa-check text-xs ${plan.highlight ? 'text-accent-300' : 'text-primary-500'}`}></i>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className={`w-full py-3 rounded-xl font-bold text-center transition-all ${
                  plan.highlight
                    ? 'bg-white text-primary-700 hover:bg-gray-50 shadow-lg'
                    : 'btn-primary text-white shadow-md shadow-primary-100'
                }`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-900 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">Ready to go live?</h2>
          <p className="text-primary-100/80 text-lg mb-10">Join businesses already growing with mywebpages. Create your landing page for free — no credit card needed.</p>
          <Link href="/login" className="btn-primary px-10 py-5 rounded-full text-white font-black text-xl shadow-2xl shadow-black/20 inline-flex items-center gap-3">
            <i className="fas fa-rocket"></i> Launch My Page
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
              <span className="font-black text-xl">mywebpages</span>
            </div>
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} mywebpages. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/login" className="text-gray-400 hover:text-white text-sm transition-colors">Sign In</Link>
              <Link href="/jorickz" className="text-gray-400 hover:text-white text-sm transition-colors">Demo</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
