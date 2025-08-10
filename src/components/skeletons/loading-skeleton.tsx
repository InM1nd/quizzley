export function LoadingSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-4 h-4 bg-zinc-800 rounded animate-pulse"></div>
      <div className="w-20 h-4 bg-zinc-800 rounded animate-pulse"></div>
    </div>
  );
}
