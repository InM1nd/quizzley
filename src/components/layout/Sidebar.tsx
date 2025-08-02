"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  BarChart2,
  CreditCard,
  Star,
  Menu,
  X,
  Home,
  Plus,
  Zap,
  Podcast,
  Clock,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/app/actions/auth-actions";
import { useUIStore } from "@/lib/stores/ui-store";
import Flashcards from "@/app/(user)/flashcards/page";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  status: "in-progress" | "done";
};

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart2,
    status: "done",
  },
  {
    title: "New Quizz",
    href: "/quizz/new",
    icon: Plus,
    status: "done",
  },
  {
    title: "Flashcards",
    href: "/flashcards",
    icon: Zap,
    status: "in-progress",
  },
  {
    title: "Podcasts",
    href: "/podcasts",
    icon: Podcast,
    status: "in-progress",
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
    status: "done",
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: Star,
    status: "done",
  },
];

// Ленивая загрузка компонента профиля
const UserProfile = dynamic(() => import("./UserProfile"), {
  loading: () => (
    <div className="mb-6 mt-2 flex items-center px-2">
      <div className="w-10 h-10 mr-3 bg-zinc-800 rounded-full animate-pulse" />
      <div className="flex flex-col">
        <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
        <div className="w-32 h-3 bg-zinc-800 rounded animate-pulse mt-1" />
      </div>
    </div>
  ),
  ssr: false,
});

export default function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // UI Store
  const {
    sidebarOpen,
    isMobile,
    toggleSidebar,
    setSidebarOpen,
    setMobile,
    lockScroll,
    unlockScroll,
    closeSidebar,
    checkScreenSize,
  } = useUIStore();

  // Оптимизированный обработчик изменения размера экрана с debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkScreenSize, 100);
    };

    checkScreenSize();
    window.addEventListener("resize", debouncedCheck);

    return () => {
      window.removeEventListener("resize", debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, [checkScreenSize]);

  useEffect(() => {
    if (isMobile) {
      if (sidebarOpen) {
        lockScroll();
      } else {
        unlockScroll();
      }
    }

    // Очистка при размонтировании компонента
    return () => {
      if (isMobile) {
        unlockScroll();
      }
    };
  }, [sidebarOpen, isMobile, lockScroll, unlockScroll]);

  const handleNavClick = useCallback(() => {
    if (isMobile) {
      closeSidebar();
    }
  }, [isMobile, closeSidebar]);

  const handleOverlayClick = useCallback(() => {
    if (isMobile && sidebarOpen) {
      closeSidebar();
    }
  }, [isMobile, sidebarOpen, closeSidebar]);

  // Обработчик для предотвращения скролла внутри сайдбара
  const handleSidebarTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (isMobile) {
        e.stopPropagation();
      }
    },
    [isMobile]
  );

  // Memoized sidebar classes
  const sidebarClasses = useMemo(() => {
    return cn(
      "fixed left-0 top-0 z-40 h-full w-full md:w-64 transition-transform duration-300 ",
      isMobile
        ? sidebarOpen
          ? "translate-x-0"
          : "-translate-x-full"
        : "translate-x-0",
      "bg-zinc-900/50 backdrop-blur-md border-r border-zinc-800/50"
    );
  }, [isMobile, sidebarOpen]);

  // memoized nav items
  const navItems = useMemo(() => {
    return mainNavItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={handleNavClick}
        className={cn(
          "flex items-center px-3 py-2 text-md md:text-sm font-medium rounded-full group transition-all duration-300",
          pathname === item.href
            ? "bg-orange-500/10 text-orange-500"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
        )}
      >
        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
        {item.title}
        {item.status === "in-progress" && (
          <Clock className="ml-2 h-4 w-4 text-orange-500 animate-pulse" />
        )}
      </Link>
    ));
  }, [pathname, handleNavClick]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
      window.location.href = "/";
    }
  };
  // Optimized loading placeholder
  if (status === "loading") {
    return (
      <div className="fixed left-0 top-0 z-40 h-full w-64 bg-zinc-900/50">
        <div className="animate-pulse h-full" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 right-4 z-50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/70 ring-1 ring-white/10"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </Button>
      )}

      {/* Sidebar */}
      <div
        className={sidebarClasses}
        onTouchMove={handleSidebarTouchMove}
        onClick={handleOverlayClick}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {session && <UserProfile session={session} />}

          {/* Main navigation */}
          <nav className="space-y-1 flex-1">
            <div className="px-3 py-2">
              <h3 className="text-md md:text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Main
              </h3>
            </div>

            {navItems}
          </nav>

          {/* Sidebar bottom */}
          <div className="pt-2 mt-6 border-t border-zinc-800">
            <Link
              href="/"
              onClick={handleNavClick}
              className="flex items-center px-3 py-2 mt-1 text-md md:text-xs font-medium text-zinc-400 rounded-full hover:text-white hover:bg-zinc-800/50 group transition-all duration-300"
            >
              <Home className="mr-3 h-5 w-5 flex-shrink-0" />
              Home Page
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 mt-1 text-md md:text-sm font-medium text-red-400 rounded-full hover:text-red-300 hover:bg-red-500/10 group transition-all duration-300"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Затемнение фона на мобильных */}
      {/* {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )} */}
    </>
  );
}
