import { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="rounded-xl border border-transparent bg-zinc-900 px-4 py-3 text-foreground outline-none transition-colors focus:border-brand"
    />
  );
}
