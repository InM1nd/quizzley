"use client";

import Sidebar from "@/components/layout/Sidebar";
import { SessionProvider } from "next-auth/react";

const UserPagesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {/* Основной контейнер */}
      <div className="flex min-h-screen">
        {/* Сайдбар */}
        <Sidebar />

        {/* Основное содержимое */}
        <div className="flex-1 pl-0 lg:pl-64 min-h-screen">
          <main className="p-4">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
};

export default UserPagesLayout;
