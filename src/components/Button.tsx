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
      className={`rounded-full px-5 py-2.5 font-medium transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100 ${variantClass} ${className}`}
    />
  );
}
