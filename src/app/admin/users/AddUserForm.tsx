'use client';

import { useActionState, useEffect, useRef } from 'react';
import SubmitButton from '@/components/SubmitButton';
import Alert from '@/components/Alert';
import { addUserAction, type UserActionState } from './actions';

export default function AddUserForm() {
  const [state, formAction] = useActionState<UserActionState, FormData>(
    addUserAction,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <div className="bg-white p-7 rounded-3xl shadow-sm border border-gray-100">
      <h2 className="text-lg font-extrabold text-gray-900 mb-1">Add a New User</h2>
      <p className="text-xs text-gray-500 mb-5">
        Creates a confirmed account immediately. They can log in with the
        password you set.
      </p>

      <form ref={formRef} action={formAction} className="space-y-4">
        <Alert state={state} />

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="user@example.com"
            className="w-full p-3.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Full Name
          </label>
          <input
            name="full_name"
            placeholder="Juan Dela Cruz"
            className="w-full p-3.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            name="password"
            type="text"
            required
            minLength={6}
            placeholder="At least 6 characters"
            className="w-full p-3.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none font-mono"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Share this with the user. They can change it later.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            defaultValue="owner"
            className="w-full p-3.5 bg-gray-50 rounded-xl border border-transparent focus:border-primary-500 outline-none"
          >
            <option value="owner">Owner — can build a business page</option>
            <option value="client">Client — books / inquires only</option>
            <option value="admin">Admin — full platform access</option>
          </select>
        </div>

        <SubmitButton
          pendingText="Creating…"
          className="w-full btn-primary py-3.5 rounded-xl text-white font-bold"
        >
          Create User
        </SubmitButton>
      </form>
    </div>
  );
}
