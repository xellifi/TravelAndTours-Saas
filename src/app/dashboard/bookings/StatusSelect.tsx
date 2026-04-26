'use client';

type StatusSelectProps = {
  bookingId: string;
  currentStatus: string | null;
  action: (formData: FormData) => void;
  variant?: 'mobile' | 'desktop';
};

export default function StatusSelect({
  bookingId,
  currentStatus,
  action,
  variant = 'desktop',
}: StatusSelectProps) {
  const className =
    variant === 'mobile'
      ? 'w-full text-xs font-bold border rounded-lg px-3 py-2 bg-gray-50 outline-none'
      : 'text-xs font-bold border rounded-lg px-2 py-1 outline-none';

  return (
    <form action={action}>
      <input type="hidden" name="id" value={bookingId} />
      <select
        name="status"
        defaultValue=""
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className={className}
      >
        <option value="" disabled>
          Change Status
        </option>
        <option value="approved" disabled={currentStatus === 'approved'}>
          Approve
        </option>
        <option value="completed" disabled={currentStatus === 'completed'}>
          Complete
        </option>
        <option value="rejected" disabled={currentStatus === 'rejected'}>
          Reject
        </option>
      </select>
    </form>
  );
}
