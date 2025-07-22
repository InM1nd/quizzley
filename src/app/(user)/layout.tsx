import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Suspense } from "react";

async function UserLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const SidebarSkeleton = () => (
    <div className="fixed left-0 top-0 z-40 h-full w-64 bg-zinc-900/50 backdrop-blur-md border-r border-zinc-800/50">
      <div className="animate-pulse h-full p-4">
        <div className="w-full h-20 bg-zinc-800 rounded-lg mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-10 bg-zinc-800 rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-zinc-900 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      <Suspense fallback={<SidebarSkeleton />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 transition-all duration-300 lg:pl-64">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}

export default UserLayout;
