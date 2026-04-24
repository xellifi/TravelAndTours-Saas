'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [signedUp, setSignedUp] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    if (loginError) {
      setError(loginError.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: email.split('@')[0] } },
    });
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSignedUp(true);
    }
    setLoading(false);
  };

  if (signedUp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-envelope-open text-2xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Check Your Email</h2>
          <p className="text-gray-500 mb-6">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <button onClick={() => { setSignedUp(false); setMode('login'); }} className="text-primary-600 font-bold hover:underline text-sm">
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-primary-700 to-primary-900 p-16 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white font-black">M</div>
            <span className="font-black text-2xl text-white">mywebpages</span>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-white mb-4 leading-tight">Your business,<br /><span className="text-accent-400">always online.</span></h2>
          <p className="text-primary-200 text-lg leading-relaxed max-w-sm">
            Create stunning landing pages, manage bookings, and accept GCash & PayMaya payments — all in one place.
          </p>
        </div>
        <p className="relative z-10 text-primary-300/60 text-sm">Secured by Supabase · Next.js 16</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-black text-sm">M</div>
            <span className="font-black text-xl text-gray-900">mywebpages</span>
          </Link>

          <h1 className="text-3xl font-black text-gray-900 mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-500 mb-8">
            {mode === 'login' ? 'Sign in to manage your business dashboard.' : 'Start building your business page for free.'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-medium flex items-center gap-2">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-2xl text-white font-bold text-lg shadow-xl shadow-primary-100 disabled:opacity-50 mt-2"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            {mode === 'login' ? (
              <p className="text-gray-500 text-sm">
                Don&apos;t have an account?{' '}
                <button onClick={() => { setMode('signup'); setError(null); }} className="text-primary-600 font-bold hover:underline">Sign Up Free</button>
              </p>
            ) : (
              <p className="text-gray-500 text-sm">
                Already have an account?{' '}
                <button onClick={() => { setMode('login'); setError(null); }} className="text-primary-600 font-bold hover:underline">Sign In</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
