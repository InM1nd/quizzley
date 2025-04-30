import { QueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 30, // 30 минут
    },
  },
});

export const sessionKeys = {
  all: ["session"] as const,
  user: () => [...sessionKeys.all, "user"] as const,
};

export const getSessionData = async () => {
  const session = await getSession();
  return session;
};
