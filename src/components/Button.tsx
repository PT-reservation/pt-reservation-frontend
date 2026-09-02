import { ButtonHTMLAttributes } from 'react';

export function Button({
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`rounded-md bg-brand px-4 py-2 font-medium text-white hover:bg-brand-hover disabled:opacity-50 ${className}`}
    />
  );
}
