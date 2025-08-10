"use client";

import { Button } from "./button";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavMenu } from "@/components/NavMenu";
import { Wand, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { LoginModal } from "../auth/login-modal";

function SignOut() {
  return (
    <Button
      type="button"
      variant="ghost"
      className="text-white font-semibold text-md rounded-full hover:text-white hover:bg-red-500/50"
      onClick={() => signOut()}
    >
      Sign Out
    </Button>
  );
}

export default function ClientHeader({ session }: { session: any }) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  // Активная сессия имеет приоритет над пропсом session
  const activeSession = sessionData || session;

  // Закрыть мобильное меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Закрыть меню при клике по ссылке
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
    setIsOpen(false);
  };

  const navigationLinks = [
    { href: "/features", label: "Features" },
    { href: "/about-us", label: "About" },
    { href: "/roadmap", label: "Roadmap" },
    ...(activeSession?.user
      ? [{ href: "/dashboard", label: "Dashboard" }]
      : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative py-4">
          <nav className="relative z-10 flex items-center justify-between rounded-full bg-zinc-900/70 p-4 backdrop-blur-md border border-white/10">
            <Link
              href="/"
              className="flex items-center gap-1"
            >
              <Image
                src={"/logo.png"}
                alt="Quizzley"
                width={40}
                height={40}
              />
              <h1 className="text-2xl font-extrabold text-white">Quizzley</h1>
            </Link>

            {/* Десктопная навигация */}
            <div className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white px-4 py-2 rounded-full font-semibold text-lg hover:bg-orange-500/50 transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Десктопная авторизация */}
            <div className="hidden md:block">
              {activeSession?.user ? (
                <div className="flex items-center gap-4">
                  {activeSession.user.name && activeSession.user.image && (
                    <Button
                      variant="ghost"
                      className="rounded-full hover:bg-white/20"
                      onClick={navigateToDashboard}
                    >
                      <Image
                        src={activeSession.user.image}
                        alt={activeSession.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    </Button>
                  )}
                  <SignOut />
                </div>
              ) : (
                <LoginModal>
                  <Button
                    variant="outline"
                    className="rounded-full font-semibold text-md border-white/10 bg-green-500/50 text-white hover:bg-white/10 hover:text-white"
                  >
                    Sign In
                  </Button>
                </LoginModal>
              )}
            </div>

            {/* Мобильная кнопка меню */}
            <div className="md:hidden flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>

            {/* Мобильное меню */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -20, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-zinc-900/95 backdrop-blur-md rounded-xl overflow-hidden p-4 ring-1 ring-white/10 shadow-xl"
                >
                  <div className="flex flex-col space-y-4 py-2">
                    {/* Мобильная навигация */}
                    {navigationLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="text-white hover:text-primary py-2 px-4 rounded-lg hover:bg-white/5 transition-colors duration-200"
                        onClick={handleLinkClick}
                      >
                        {link.label}
                      </Link>
                    ))}

                    {/* Разделитель */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>

                    {/* Мобильная авторизация */}
                    {activeSession?.user ? (
                      <div className="flex flex-col space-y-4 py-2">
                        <div className="flex items-center gap-3 px-4">
                          {activeSession.user.image && (
                            <Image
                              src={activeSession.user.image}
                              alt={activeSession.user.name || "User"}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          )}
                          <div>
                            <p className="font-medium text-white">
                              {activeSession.user.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              {activeSession.user.email}
                            </p>
                          </div>
                        </div>
                        <div className="px-4">
                          <Button
                            type="button"
                            variant="ghost"
                            className="w-full justify-center text-white hover:text-white hover:bg-red-500/50"
                            onClick={() => signOut()}
                          >
                            Sign Out
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-2">
                        <LoginModal>
                          <Button
                            variant="outline"
                            className="w-full justify-center rounded-full border-white/10 bg-green-500/50 text-white hover:bg-white/10 hover:text-white"
                          >
                            Sign In
                          </Button>
                        </LoginModal>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </div>
      </div>
    </header>
  );
}
