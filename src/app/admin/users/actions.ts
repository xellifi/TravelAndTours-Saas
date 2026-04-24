'use server';

import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export type UserActionState = {
  success: boolean;
  message: string;
} | null;

const VALID_ROLES = ['admin', 'owner', 'client'] as const;
type Role = (typeof VALID_ROLES)[number];

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false };

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  return { user, isAdmin: profile?.role === 'admin' };
}

export async function addUserAction(
  _prev: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const { user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) {
    return { success: false, message: 'Admin access required.' };
  }

  const email = ((formData.get('email') as string) || '').trim().toLowerCase();
  const password = ((formData.get('password') as string) || '').trim();
  const fullName = ((formData.get('full_name') as string) || '').trim();
  const roleRaw = ((formData.get('role') as string) || 'owner').trim();

  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (password.length < 6) {
    return { success: false, message: 'Password must be at least 6 characters.' };
  }
  if (!VALID_ROLES.includes(roleRaw as Role)) {
    return { success: false, message: 'Invalid role.' };
  }
  const role = roleRaw as Role;

  let admin;
  try {
    admin = createAdminClient();
  } catch (e) {
    return {
      success: false,
      message: (e as Error).message,
    };
  }

  // Create the auth user.
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (createError || !created?.user) {
    return {
      success: false,
      message: createError?.message || 'Failed to create user.',
    };
  }

  // The public.users row may have been created by a trigger; either way, set
  // the role and full name.
  const newUserId = created.user.id;
  const { error: profileError } = await admin
    .from('users')
    .upsert(
      { id: newUserId, email, full_name: fullName || null, role },
      { onConflict: 'id' },
    );

  if (profileError) {
    return {
      success: true,
      message: `User created, but profile update failed: ${profileError.message}`,
    };
  }

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  return { success: true, message: `User "${email}" created as ${role}.` };
}

export async function updateUserRoleAction(formData: FormData): Promise<void> {
  const { user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) return;

  const targetId = (formData.get('id') as string) || '';
  const roleRaw = (formData.get('role') as string) || '';
  if (!targetId || !VALID_ROLES.includes(roleRaw as Role)) return;

  // Don't let the admin demote themselves accidentally.
  if (targetId === user.id && roleRaw !== 'admin') return;

  const admin = createAdminClient();
  await admin.from('users').update({ role: roleRaw }).eq('id', targetId);

  revalidatePath('/admin/users');
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const { user, isAdmin } = await assertAdmin();
  if (!user || !isAdmin) return;

  const targetId = (formData.get('id') as string) || '';
  if (!targetId || targetId === user.id) return;

  const admin = createAdminClient();

  // Cascade should clean up businesses + dependents if FK is set up that way.
  // To be safe, also delete the public.users row, then auth user.
  await admin.from('users').delete().eq('id', targetId);
  await admin.auth.admin.deleteUser(targetId);

  revalidatePath('/admin/users');
  revalidatePath('/admin');
  revalidatePath('/admin/businesses');
}
