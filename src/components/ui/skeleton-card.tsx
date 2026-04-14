type SkeletonCardProps = {
  lines?: number;
};

export function SkeletonCard({ lines = 3 }: SkeletonCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="h-4 w-2/3 animate-pulse rounded bg-neutral-200" />
      <div className="mt-4 space-y-2">
        {Array.from({ length: lines }).map((_, idx) => (
          <div key={idx} className="h-3 w-full animate-pulse rounded bg-neutral-100" />
        ))}
      </div>
      <div className="mt-5 h-9 w-32 animate-pulse rounded-xl bg-neutral-200" />
    </div>
  );
}
