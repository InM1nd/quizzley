import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from "@clerk/nextjs";

import ClickSpark from "@/components/ui/click-spark";
import ConditionalHeader from "@/components/ui/conditional-header";
import { getUserSession } from "@/lib/user-session";
import Aurora from "@/components/ui/aurora";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizz AI",
  description: "Generate Quizzez with AI to prepare faster!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  return (
    <SessionProvider>
      <html lang="en">
        <body className={"dark"}>
          <ClickSpark
            sparkColor="#fff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <ConditionalHeader session={session} />

            {children}
          </ClickSpark>
        </body>
      </html>
    </SessionProvider>
  );
}
