"use client";

import { usePathname } from "next/navigation";
import ClientHeader from "./header";

export default function ConditionalHeader({ session }: { session: any }) {
  const pathname = usePathname();

  // Проверяем, находимся ли мы внутри приложения
  const isAppRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/feedback") ||
    pathname.startsWith("/quizz");

  // Не отображаем хедер на маршрутах приложения
  if (isAppRoute) {
    return null;
  }

  // Отображаем хедер на всех остальных маршрутах
  return <ClientHeader session={session} />;
}
