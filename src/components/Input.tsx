import { InputHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none focus:border-brand"
    />
  );
}
