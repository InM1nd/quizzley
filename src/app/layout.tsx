import type { Metadata } from 'next'
import { Nunito } from "next/font/google";
import "./globals.css";

import ClickSpark from "@/components/ui/click-spark";
import ConditionalHeader from "@/components/ui/conditional-header";
import ConditionalAurora from "@/components/ui/conditional-aurora";
import { getUserSession } from "@/lib/user-session";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

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
      <html
        lang="en"
        className={nunito.variable}
      >
        <body className={"dark"}>
          <Providers>
            <ConditionalAurora />
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
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
