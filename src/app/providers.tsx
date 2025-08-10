"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/session-cache";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        richColors
        className="z-[1000]"
      />
    </QueryClientProvider>
  );
}
