export function CenteredMessage({
  message,
  variant = 'muted',
}: {
  message: string;
  variant?: 'muted' | 'error';
}) {
  return (
    <main className="flex flex-1 items-center justify-center">
      <p className={variant === 'error' ? 'text-red-400' : 'text-muted'}>
        {message}
      </p>
    </main>
  );
}
