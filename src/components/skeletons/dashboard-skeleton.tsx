import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800 w-full flex flex-col justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4">
          <Skeleton className="w-full h-full rounded-full" />
        </div>
        <div className="w-full">
          <Skeleton className="h-4 sm:h-5 w-32 mx-auto mb-2" />
          <Skeleton className="h-3 sm:h-4 w-40 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function MetricsSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800 w-full">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm border border-zinc-700/50 flex flex-col justify-center"
          >
            <Skeleton className="h-3 sm:h-4 w-16 mb-2" />
            <Skeleton className="h-6 sm:h-8 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeatMapSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800">
      <Skeleton className="h-4 sm:h-5 w-48 mb-3 sm:mb-4" />
      <div className="overflow-x-auto">
        <Skeleton className="w-full h-32 sm:h-40" />
      </div>
    </div>
  );
}

export function QuizzesSkeleton() {
  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800">
      <Skeleton className="h-4 sm:h-5 w-48 mb-3 sm:mb-4" />
      <div className="overflow-x-auto">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center space-x-4">
                <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="w-48 sm:w-64 h-4" />
                  <Skeleton className="w-32 sm:w-40 h-3" />
                </div>
              </div>
              <Skeleton className="w-20 sm:w-24 h-8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Удаляем DashboardSkeleton, так как он не используется
// и заменяем его на полный скелетон, если потребуется
export function DashboardSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="h-10 flex items-center text-center justify-center mb-4">
        <Skeleton className="h-8 lg:h-10 w-48" />
      </div>

      {/* Верхняя секция: Профиль и Метрики */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Профиль - на мобильных занимает всю ширину, на больших экранах 1 колонку */}
        <div className="lg:col-span-1 flex">
          <ProfileSkeleton />
        </div>

        {/* Метрики - на мобильных занимает всю ширину, на больших экранах 2 колонки */}
        <div className="lg:col-span-2 flex">
          <MetricsSkeleton />
        </div>
      </div>

      {/* Тепловая карта */}
      <HeatMapSkeleton />

      {/* Таблица квизов */}
      <QuizzesSkeleton />
    </div>
  );
}
