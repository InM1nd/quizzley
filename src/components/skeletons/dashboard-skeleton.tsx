import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="col-span-1 bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="w-24 h-24 rounded-full mb-4" />
        <Skeleton className="w-32 h-6 mb-2" />
        <Skeleton className="w-48 h-4" />
      </div>
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2].map((i) => (
        <div
          key={i}
          className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800"
        >
          <Skeleton className="w-24 h-6 mb-4" />
          <Skeleton className="w-16 h-8" />
        </div>
      ))}
    </div>
  );
}

export function HeatMapSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800">
      <Skeleton className="w-48 h-6 mb-4" />
      <Skeleton className="w-full h-32" />
    </div>
  );
}

export function QuizzesSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800">
      <Skeleton className="w-48 h-6 mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="w-48 h-4" />
                <Skeleton className="w-32 h-3" />
              </div>
            </div>
            <Skeleton className="w-24 h-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProfileSkeleton />
        <MetricsSkeleton />
      </div>

      <HeatMapSkeleton />
      <QuizzesSkeleton />
    </div>
  );
}
