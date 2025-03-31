import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from "next-auth/react";
import Header from "@/components/ui/header";
import ClickSpark from "@/components/ui/click-spark";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Quizz AI",
  description: "Generate Quizzez with AI to prepare faster!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SessionProvider>
        <body className={"dark"}>
          <ClickSpark
            sparkColor="#fff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={8}
            duration={400}
          >
            <Header />
            {children}
          </ClickSpark>
        </body>
      </SessionProvider>
    </html>
  );
}
