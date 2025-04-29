"use client";

import Sidebar from "@/components/layout/Sidebar";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

// Отдельный компонент для сайдбара
const SidebarWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="w-64 min-h-screen bg-zinc-900/50 animate-pulse" />
      }
    >
      <Sidebar />
    </Suspense>
  );
};

// Отдельный компонент для основного контента
const MainContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex-1 pl-0 lg:pl-64 min-h-screen">
      <main className="p-4">
        <Suspense
          fallback={<div className="animate-pulse h-screen bg-zinc-900/50" />}
        >
          {children}
        </Suspense>
      </main>
    </div>
  );
};

const UserPagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <SidebarWrapper />
        <MainContent>{children}</MainContent>
      </div>
    </SessionProvider>
  );
};

export default UserPagesLayout;
