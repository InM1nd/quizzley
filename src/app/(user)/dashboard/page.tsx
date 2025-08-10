import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable from "./quizzesTable";
import getUserMetrics from "@/app/actions/getUserMetrics";
import MetricCard from "./metricCard";
import getHeatMapData from "@/app/actions/getHeatMapData";
import SubmissionsHeatMap from "./heatMap";
import SubscribeBtn from "../billing/SubscribeBtn";
import { PRICE_ID } from "@/lib/utils";
import { Suspense } from "react";
import {
  ProfileSkeleton,
  MetricsSkeleton,
  HeatMapSkeleton,
  QuizzesSkeleton,
} from "@/components/skeletons/dashboard-skeleton";
import getUserQuizzes, { UserQuizzes } from "@/app/actions/getUserQuizzes";

// Компонент профиля
const ProfileSection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Искусственная задержка
  const session = await auth();

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800 w-full flex flex-col justify-center">
      <div className="flex flex-col items-center text-center">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-3 sm:mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20 animate-pulse" />
          <img
            src={
              session?.user?.image ||
              "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                session?.user?.name
            }
            alt="Profile"
            className="rounded-full w-full h-full object-cover relative z-10"
          />
        </div>
        <div className="w-full">
          <h2 className="text-base sm:text-lg font-bold truncate">
            {session?.user?.name}
          </h2>
          <p className="text-secondary text-xs sm:text-sm truncate mt-1">
            {session?.user?.email}
          </p>
        </div>
      </div>
    </div>
  );
};

// Компонент метрик
const MetricsSection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Искусственная задержка
  const userData = await getUserMetrics();

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800 w-full">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 h-full">
        {userData && userData?.length > 0 ? (
          <>
            {userData?.map((metric, label) => (
              <div
                key={label}
                className="bg-zinc-800/50 rounded-lg p-3 sm:p-4 backdrop-blur-sm border border-zinc-700/50 hover:border-orange-500/50 transition-all duration-300 flex flex-col justify-center"
              >
                <MetricCard
                  key={label}
                  label={metric.label}
                  value={metric.value}
                />
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
};

// Компонент тепловой карты
const HeatMapSection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Искусственная задержка
  const heatMapData = await getHeatMapData();

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        Quizzes Activity
      </h3>
      <div className="overflow-x-auto">
        {heatMapData ? <SubmissionsHeatMap data={heatMapData.data} /> : null}
      </div>
    </div>
  );
};

// Компонент таблицы квизов
const QuizzesSection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Искусственная задержка
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found!</p>;
  }

  const userQuizzes: UserQuizzes[] = await getUserQuizzes();

  return (
    <div className="bg-zinc-900/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm border border-zinc-800">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
        My Quizzes
      </h3>
      <div className="overflow-x-auto">
        <QuizzesTable quizzes={userQuizzes} />
      </div>
    </div>
  );
};

const page = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="h-10 flex items-center text-center justify-center mb-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary ">
          Dashboard
        </h1>
      </div>

      {/* Верхняя секция: Профиль и Метрики */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Профиль - на мобильных занимает всю ширину, на больших экранах 1 колонку */}
        <div className="lg:col-span-1 flex">
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfileSection />
          </Suspense>
        </div>

        {/* Метрики - на мобильных занимает всю ширину, на больших экранах 2 колонки */}
        <div className="lg:col-span-2 flex">
          <Suspense fallback={<MetricsSkeleton />}>
            <MetricsSection />
          </Suspense>
        </div>
      </div>
      {/* Тепловая карта */}
      <Suspense fallback={<HeatMapSkeleton />}>
        <HeatMapSection />
      </Suspense>
      {/* Таблица квизов */}
      <Suspense fallback={<QuizzesSkeleton />}>
        <QuizzesSection />
      </Suspense>
    </div>
  );
};

export default page;
