import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import "./globals.css";

import ClickSpark from "@/components/ui/click-spark";
import ConditionalHeader from "@/components/ui/conditional-header";
import { getUserSession } from "@/lib/user-session";
import Aurora from "@/components/ui/aurora";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizzley - AI-Powered Quiz Generator",
  description:
    "Generate personalized quizzes with AI to prepare faster and learn more effectively. Create, share, and take quizzes on any topic!",
  keywords: [
    "quiz",
    "AI",
    "education",
    "learning",
    "test preparation",
    "study tools",
  ],
  authors: [{ name: "Quizzley Team" }],
  openGraph: {
    title: "Quizzley - AI-Powered Quiz Generator",
    description:
      "Generate personalized quizzes with AI to prepare faster and learn more effectively.",
    type: "website",
    locale: "en_US",
    siteName: "Quizzley",
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzley - AI-Powered Quiz Generator",
    description:
      "Generate personalized quizzes with AI to prepare faster and learn more effectively.",
  },
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
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
