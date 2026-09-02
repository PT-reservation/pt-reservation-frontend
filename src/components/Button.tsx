import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const variantClass =
    variant === 'primary'
      ? 'bg-brand hover:bg-brand-hover text-white'
      : 'bg-zinc-800 hover:bg-zinc-700 text-foreground';

  return (
    <button
      {...props}
      className={`rounded-md px-4 py-2 font-medium disabled:opacity-50 ${variantClass} ${className}`}
    />
  );
}
