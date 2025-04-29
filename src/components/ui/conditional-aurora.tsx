"use client";

import { usePathname } from "next/navigation";
import AuroraLanding from "./aurora-landing";

export default function ConditionalAurora() {
  const pathname = usePathname();
  const isPublicPage =
    !pathname?.startsWith("/dashboard") &&
    !pathname?.startsWith("/quizz") &&
    !pathname?.startsWith("/billing") &&
    !pathname?.startsWith("/feedback");

  if (!isPublicPage) return null;

  return <AuroraLanding />;
}
