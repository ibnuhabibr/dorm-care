export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative mx-auto size-12">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-neutral-200 border-t-brand-primary" />
        </div>
        <p className="text-sm font-medium text-neutral-500 animate-pulse">
          Memuat halaman...
        </p>
      </div>
    </div>
  );
}
