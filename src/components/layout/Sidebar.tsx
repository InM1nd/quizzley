"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  CreditCard,
  Star,
  Menu,
  X,
  Home,
  Plus,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/app/actions/auth-actions";
import { sessionKeys, getSessionData } from "@/lib/session-cache";

type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
};

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart2,
  },
  {
    title: "New Quizz",
    href: "/quizz/new",
    icon: Plus,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: Star,
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
  const { data: session, status } = useQuery({
    queryKey: sessionKeys.user(),
    queryFn: getSessionData,
    staleTime: 1000 * 60 * 5, // 5 минут
  });
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Оптимизированный обработчик изменения размера экрана с debounce
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkScreenSize = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      if (isMobileView) {
        setIsOpen(false);
      }
    };

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
  }, []);

  // Закрываем сайдбар на мобильных после клика по ссылке
  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Мемоизируем классы сайдбара
  const sidebarClasses = useMemo(() => {
    return cn(
      "fixed left-0 top-0 z-40 h-full w-64 transition-transform duration-300",
      isMobile
        ? isOpen
          ? "translate-x-0"
          : "-translate-x-full"
        : "translate-x-0",
      "bg-zinc-900/50 backdrop-blur-sm border-r border-zinc-800/50"
    );
  }, [isMobile, isOpen]);

  // Мемоизируем навигационные элементы
  const navItems = useMemo(() => {
    return mainNavItems.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={handleNavClick}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
          pathname === item.href
            ? "bg-orange-500/10 text-orange-500"
            : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
        )}
      >
        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
        {item.title}
      </Link>
    ));
  }, [pathname, handleNavClick]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Оптимизированный плейсхолдер загрузки
  if (status === "pending") {
    return (
      <div className="fixed left-0 top-0 z-40 h-full w-64 bg-zinc-900/50">
        <div className="animate-pulse h-full" />
      </div>
    );
  }

  // Если пользователь не авторизован, не отображаем сайдбар
  if (!session) {
    return null;
  }

  return (
    <>
      {/* Кнопка мобильного меню */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-50 bg-zinc-900/50 backdrop-blur-sm hover:bg-zinc-800/70 ring-1 ring-white/10"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </Button>
      )}

      {/* Сайдбар */}
      <div className={sidebarClasses}>
        <div className="flex flex-col h-full px-4 py-6">
          {session && <UserProfile session={session} />}

          {/* Основная навигация */}
          <nav className="space-y-1 flex-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Main
              </h3>
            </div>

            {navItems}
          </nav>

          {/* Нижняя часть сайдбара */}
          <div className="pt-2 mt-6 border-t border-zinc-800">
            <Link
              href="/"
              onClick={handleNavClick}
              className="flex items-center px-3 py-2 mt-1 text-sm font-medium text-zinc-400 rounded-md hover:text-white hover:bg-zinc-800/50 group transition-colors"
            >
              <Home className="mr-3 h-5 w-5 flex-shrink-0" />
              Home Page
            </Link>

            <button
              onClick={handleLogout}
              className="flex w-full items-center px-3 py-2 mt-1 text-sm font-medium text-red-400 rounded-md hover:text-red-300 hover:bg-red-500/10 group transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              Log out
            </button>
          </div>
        </div>
      </div>

      {/* Затемнение фона на мобильных */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
}
