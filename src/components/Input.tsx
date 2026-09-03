import { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="rounded-xl border border-transparent bg-black/30 px-4 py-3 text-foreground outline-none transition-colors focus:border-brand"
    />
  );
}
