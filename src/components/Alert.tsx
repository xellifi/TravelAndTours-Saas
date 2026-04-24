type Props = {
  state: { success: boolean; message: string } | null;
};

export default function Alert({ state }: Props) {
  if (!state || !state.message) return null;
  const isSuccess = state.success;
  return (
    <div
      role={isSuccess ? 'status' : 'alert'}
      aria-live="polite"
      className={`flex items-start gap-3 px-5 py-4 rounded-2xl text-sm font-medium border ${
        isSuccess
          ? 'bg-green-50 border-green-200 text-green-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      <i
        aria-hidden
        className={`fas ${isSuccess ? 'fa-check-circle' : 'fa-exclamation-circle'} mt-0.5`}
      />
      <span>{state.message}</span>
    </div>
  );
}
