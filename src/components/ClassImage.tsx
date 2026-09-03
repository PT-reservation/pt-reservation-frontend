export function ClassImage({
  src,
  alt,
  className = '',
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full rounded-xl object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center rounded-xl bg-brand/10 ${className}`}
    >
      <img src="/logo.png" alt="" className="h-12 w-12 opacity-50" />
    </div>
  );
}
