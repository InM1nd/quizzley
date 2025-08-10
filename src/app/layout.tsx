import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

import ClickSpark from "@/components/ui/click-spark";
import ConditionalAurora from "@/components/ui/conditional-aurora";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";

const nunito = Nunito({
  subsets: ["latin"],
  // variable: "--font-nunito",
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
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={nunito.className}
      suppressHydrationWarning={true}
    >
      <body
        className="dark"
        suppressHydrationWarning={true}
      >
        <SessionProvider>
          <Providers>
            <ClickSpark
              sparkColor="#fff"
              sparkSize={10}
              sparkRadius={15}
              sparkCount={8}
              duration={400}
            >
              {children}
            </ClickSpark>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
