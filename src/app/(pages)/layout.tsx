import ConditionalHeader from "@/components/ui/conditional-header";
import Aurora from "../../components/ui/aurora";
import { auth } from "@/auth";
import { ReactNode } from "react";
import ConditionalAurora from "@/components/ui/conditional-aurora";

interface PagesLayoutProps {
  children: ReactNode;
}

export default async function PagesLayout({ children }: PagesLayoutProps) {
  const session = await auth();

  return (
    <>
      <ConditionalHeader session={session} />
      <ConditionalAurora />
      {children}
    </>
  );
}
