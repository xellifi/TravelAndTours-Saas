import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import AddUserForm from './AddUserForm';
import UserRow from './UserRow';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  // Service-role client bypasses RLS — safe here because the parent admin layout
  // already redirects non-admins away before this page renders.
  const admin = createAdminClient();
  const [{ data: users }, { data: businesses }] = await Promise.all([
    admin
      .from('users')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false }),
    admin.from('businesses').select('id, name, slug, owner_id'),
  ]);

  const businessByOwner = new Map(
    (businesses || []).map((b) => [b.owner_id, b]),
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Manage Users
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Add new accounts, change roles, or remove users from the platform.
          </p>
        </div>
        <span className="text-sm text-gray-400 font-bold">
          {users?.length || 0} total
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Business
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="px-4 sm:px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users?.map((u) => {
                  const biz = businessByOwner.get(u.id);
                  return (
                    <UserRow
                      key={u.id}
                      id={u.id}
                      email={u.email}
                      fullName={u.full_name}
                      role={u.role}
                      createdAt={u.created_at}
                      businessName={biz?.name || null}
                      businessSlug={biz?.slug || null}
                      isSelf={u.id === currentUser?.id}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
          {(!users || users.length === 0) && (
            <div className="p-12 sm:p-16 text-center text-gray-400">
              <i className="fas fa-users text-4xl mb-4 block opacity-20"></i>
              No users yet.
            </div>
          )}
        </div>

        <div>
          <AddUserForm />
        </div>
      </div>
    </div>
  );
}
