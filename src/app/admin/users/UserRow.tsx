'use client';

import { updateUserRoleAction, deleteUserAction } from './actions';

type Props = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: string | null;
  createdAt: string | null;
  businessName: string | null;
  businessSlug: string | null;
  isSelf: boolean;
};

const ROLE_BADGE: Record<string, string> = {
  admin: 'bg-red-50 text-red-700',
  owner: 'bg-primary-50 text-primary-700',
  client: 'bg-gray-100 text-gray-600',
};

export default function UserRow({
  id,
  email,
  fullName,
  role,
  createdAt,
  businessName,
  businessSlug,
  isSelf,
}: Props) {
  const currentRole = role || 'owner';
  const badgeClass = ROLE_BADGE[currentRole] || 'bg-gray-100 text-gray-600';

  return (
    <tr className="hover:bg-gray-50/50 transition-colors">
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-700 text-white font-black flex items-center justify-center uppercase flex-shrink-0">
            {(fullName || email || '?')[0]}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">
              {fullName || <span className="text-gray-400 italic">No name</span>}
              {isSelf && (
                <span className="ml-2 text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  You
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 truncate">{email || '—'}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <span
          className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${badgeClass}`}
        >
          {currentRole}
        </span>
      </td>

      <td className="px-6 py-5 text-sm text-gray-600">
        {businessName ? (
          <div>
            <p className="font-bold text-gray-900">{businessName}</p>
            <p className="text-xs text-gray-400">/{businessSlug}</p>
          </div>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>

      <td className="px-6 py-5 text-sm text-gray-500">
        {createdAt ? new Date(createdAt).toLocaleDateString('en-PH') : '—'}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center justify-end gap-2">
          <form action={updateUserRoleAction} className="flex items-center gap-2">
            <input type="hidden" name="id" value={id} />
            <select
              name="role"
              defaultValue={currentRole}
              disabled={isSelf}
              className="text-xs font-bold p-2 bg-gray-50 rounded-lg border border-gray-200 focus:border-primary-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="owner">Owner</option>
              <option value="client">Client</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={isSelf}
              className="text-xs font-bold px-3 py-2 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </form>

          <form
            action={deleteUserAction}
            onSubmit={(e) => {
              if (
                !confirm(
                  `Permanently delete ${email || 'this user'}? This also removes their business and all related data.`,
                )
              ) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={id} />
            <button
              type="submit"
              disabled={isSelf}
              className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Delete user"
              title={isSelf ? "You can't delete yourself" : 'Delete user'}
            >
              <i className="fas fa-trash text-xs" />
            </button>
          </form>
        </div>
      </td>
    </tr>
  );
}
