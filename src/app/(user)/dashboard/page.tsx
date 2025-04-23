import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizzes } from "@/db/schema";
import { auth } from "@/auth";
import QuizzesTable, { Quizz } from "./quizzesTable";
import getUserMetrics from "@/app/actions/getUserMetrics";
import MetricCard from "./metricCard";
import getHeatMapData from "@/app/actions/getHeatMapData";
import SubmissionsHeatMap from "./heatMap";
import SubscribeBtn from "../billing/SubscribeBtn";
import { PRICE_ID } from "@/lib/utils";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found!</p>;
  }

  const userQuizzes: Quizz[] = await db.query.quizzes.findMany({
    where: eq(quizzes.userId, userId),
  });

  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Профиль и метрики */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Профиль */}
        <div className="col-span-1 bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20 animate-pulse" />
              <img
                src={
                  session?.user?.image ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                    session?.user?.name
                }
                alt="Profile"
                className="rounded-full w-24 h-24 object-cover relative z-10"
              />
            </div>
            <div className="w-full">
              <h2 className="text-lg font-bold truncate">
                {session?.user?.name}
              </h2>
              <p className="text-zinc-400 text-sm truncate mt-1">
                {session?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Метрики */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {userData && userData?.length > 0 ? (
            <>
              {userData?.map((metric, label) => (
                <div
                  key={label}
                  className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800 hover:border-orange-500/50 transition-all duration-300"
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

      {/* Тепловая карта */}
      <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">Quizzes Activity</h3>
        {heatMapData ? <SubmissionsHeatMap data={heatMapData.data} /> : null}
      </div>

      {/* Таблица квизов */}
      <div className="bg-zinc-900/50 rounded-xl p-6 backdrop-blur-sm border border-zinc-800">
        <h3 className="text-lg font-semibold mb-4">My Quizzes</h3>
        <QuizzesTable quizzes={userQuizzes} />
      </div>
    </div>
  );
};

export default page;
