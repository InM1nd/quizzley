"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Обработчик изменения размера экрана
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Первоначальная проверка
    checkScreenSize();

    // Добавляем слушатель изменения размера
    window.addEventListener("resize", checkScreenSize);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  // Закрываем сайдбар на мобильных после клика по ссылке
  const handleNavClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

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
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 transition-transform duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "bg-zinc-900/50 backdrop-blur-sm border-r border-zinc-800/50"
        )}
      >
        {/* Контент сайдбара */}
        <div className="flex flex-col h-full px-4 py-6">
          {/* Профиль пользователя */}
          <div className="mb-6 mt-2 flex items-center px-2">
            <div className="relative w-10 h-10 mr-3">
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="rounded-full w-10 h-10 object-cover"
                />
              ) : (
                <div className="rounded-full w-10 h-10 bg-orange-500/20 flex items-center justify-center text-orange-500">
                  {session.user?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white truncate max-w-[140px]">
                {session.user?.name || "Пользователь"}
              </span>
              <span className="text-xs text-zinc-400 truncate max-w-[140px]">
                {session.user?.email || ""}
              </span>
            </div>
          </div>

          {/* Основная навигация */}
          <nav className="space-y-1 flex-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Main
              </h3>
            </div>

            {mainNavItems.map((item) => (
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
            ))}
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

            <form action={logoutUser}>
              <button
                type="submit"
                onClick={handleNavClick}
                className="flex w-full items-center px-3 py-2 mt-1 text-sm font-medium text-red-400 rounded-md hover:text-red-300 hover:bg-red-500/10 group transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                Log out
              </button>
            </form>
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
