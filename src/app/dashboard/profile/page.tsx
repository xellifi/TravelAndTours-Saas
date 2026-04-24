import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  async function updateProfile(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const full_name = formData.get('full_name') as string;
    await supabase.from('users').update({ full_name }).eq('id', user.id);
    revalidatePath('/dashboard/profile');
  }

  async function updatePassword(formData: FormData) {
    'use server';
    const supabase = await createClient();
    const newPassword = formData.get('new_password') as string;
    await supabase.auth.updateUser({ password: newPassword });
    revalidatePath('/dashboard/profile');
  }

  const joinedAt = user.created_at ? new Date(user.created_at).toLocaleDateString('en-PH', {
    year: 'numeric', month: 'long', day: 'numeric'
  }) : 'N/A';

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1">My Profile</h1>
      <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-8">Manage your account information and password.</p>

      {/* Avatar + info */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-4 sm:mb-6 flex items-center gap-4 sm:gap-5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-400 to-primary-700 rounded-full flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-primary-100 flex-shrink-0 uppercase">
          {displayName[0]}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">{displayName}</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">{user.email}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 text-[10px] sm:text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full uppercase tracking-wide max-w-full">
            <i className="fas fa-circle text-[6px] text-green-500 flex-shrink-0"></i>
            <span className="truncate">{profile?.role || 'Owner'} · Joined {joinedAt}</span>
          </span>
        </div>
      </div>

      {/* Update name */}
      <form action={updateProfile} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 mb-4 sm:mb-6 space-y-4 sm:space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Personal Information</h2>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
          <input
            name="full_name"
            defaultValue={profile?.full_name || ''}
            required
            className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
          <input
            value={user.email || ''}
            disabled
            className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl bg-gray-100 border-2 border-transparent outline-none text-gray-400 cursor-not-allowed"
          />
          <p className="mt-1.5 text-[11px] sm:text-xs text-gray-400">Email cannot be changed here. Contact support if needed.</p>
        </div>
        <button type="submit" className="btn-primary w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold text-sm sm:text-base shadow-md shadow-primary-100">
          Save Changes
        </button>
      </form>

      {/* Change password */}
      <form action={updatePassword} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 space-y-4 sm:space-y-5">
        <h2 className="text-base sm:text-lg font-bold text-gray-900">Change Password</h2>
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">New Password</label>
          <input
            name="new_password"
            type="password"
            required
            minLength={6}
            className="w-full px-4 py-3 sm:py-3.5 text-sm sm:text-base rounded-xl bg-gray-50 border-2 border-transparent focus:border-primary-500 outline-none transition-all"
            placeholder="Min. 6 characters"
          />
        </div>
        <button type="submit" className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold text-sm sm:text-base transition-all shadow-md">
          Update Password
        </button>
      </form>
    </div>
  );
}
