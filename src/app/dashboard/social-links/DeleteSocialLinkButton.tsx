'use client';

import { deleteSocialLinkAction } from './actions';

type Props = {
  id: string;
  platformName: string;
};

export default function DeleteSocialLinkButton({ id, platformName }: Props) {
  return (
    <form
      action={deleteSocialLinkAction}
      onSubmit={(e) => {
        if (
          !confirm(`Delete this ${platformName} link? This can't be undone.`)
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 text-red-600 font-bold text-sm hover:underline"
      >
        <i className="fas fa-trash text-xs"></i> Delete
      </button>
    </form>
  );
}
