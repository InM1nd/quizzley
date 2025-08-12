import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ClickSpark from "@/components/ui/click-spark";
import ConditionalAurora from "@/components/ui/conditional-aurora";
import { SessionProvider } from "next-auth/react";
import { Providers } from "./providers";
import Script from "next/script";

const nunito = Nunito({
  subsets: ["latin"],
  // variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Quizzley - AI-Powered Quiz Generator | Create Smart Quizzes",
  description:
    "Transform your learning with Quizzley's AI-powered quiz generator. Create personalized quizzes from any content, upload documents, and get intelligent questions that adapt to your knowledge level.",
  keywords: [
    "AI quiz generator",
    "personalized learning",
    "quiz creation",
    "educational technology",
    "test preparation",
    "adaptive learning",
    "study tools",
    "online quizzes",
    "learning assessment",
    "AI-powered education",
  ],
  authors: [{ name: "Quizzley Team" }],
  creator: "Quizzley",
  publisher: "Quizzley",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://quizzley.io"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Quizzley - AI-Powered Quiz Generator",
    description:
      "Transform your learning with AI-powered quizzes. Create personalized assessments from any content.",
    type: "website",
    locale: "en_US",
    siteName: "Quizzley",
    url: "/",
    images: [
      {
        url: "/images/landing/Question_Showcase.png",
        width: 1200,
        height: 630,
        alt: "Quizzley AI Quiz Generator Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quizzley - AI-Powered Quiz Generator",
    description:
      "Transform your learning with AI-powered quizzes. Create personalized assessments from any content.",
    images: ["/images/landing/Question_Showcase.png"],
    creator: "@quizzley",
    site: "@quizzley",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GXNXZZ1L1Z"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GXNXZZ1L1Z');
          `}
        </Script>
      </body>
    </html>
  );
}
