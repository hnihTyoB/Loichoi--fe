"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Flame, Grid2X2, Keyboard, LogIn, LogOut, Menu, User as UserIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore } from "@/stores/ui-store";
import { useTranslation } from "@/hooks/use-translation";
import { authService } from "@/services/auth.service";
import { getPublicCopy } from "@/lib/public-copy";
import { cn } from "@/lib/utils";
import { useNotificationStream } from "@/hooks/use-notification-stream";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useUiStore();
  const { t, language, isMounted } = useTranslation();
  const pathname = usePathname();
  const publicText = getPublicCopy(language);
  const { unreadCount } = useNotificationStream(isAuthenticated);

  const publicLinks = [
    { href: "/keyboards", label: publicText.nav.explore, icon: Keyboard },
    { href: "/categories", label: publicText.nav.categories, icon: Grid2X2 },
    { href: "/trending", label: publicText.nav.trending, icon: Flame },
  ];

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 flex min-h-20 w-full flex-wrap items-center justify-between gap-y-2 border-b-2 border-kawaii-sky/30 bg-background/90 px-4 py-3 md:px-8 backdrop-blur-md">
      <div className="flex items-center gap-3">
        {isAuthenticated && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden rounded-full">
            <Menu className="h-5 w-5 text-kawaii-mocha" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
        <Link href="/" className="group flex items-center gap-2.5 font-bold text-xl tracking-tight text-kawaii-mocha">
          <BrandLogo priority alt="" className="transition-transform duration-200 group-hover:scale-105" />
          <span className="font-extrabold bg-gradient-to-r from-kawaii-mocha to-kawaii-warmbrown bg-clip-text text-transparent">
            Loichoi
          </span>
        </Link>
      </div>

      <nav className="order-3 flex w-full items-center justify-center gap-1 lg:order-none lg:w-auto" aria-label="Public navigation">
        {publicLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (pathname.startsWith(`${href}/`) && !pathname.startsWith(`${href}/manage`));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors sm:gap-2 sm:px-4 sm:text-sm",
                active
                  ? "bg-kawaii-sky/55 text-kawaii-mocha"
                  : "text-kawaii-mocha/65 hover:bg-kawaii-cloud hover:text-kawaii-mocha",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <LanguageToggle />
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2.5">
            <Link href="/notifications" className="relative">
              <Button variant="ghost" size="icon" aria-label="Thông báo"><Bell className="h-4 w-4" /></Button>
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-background bg-kawaii-pink px-1 text-[10px] font-black text-kawaii-mocha">{unreadCount > 99 ? "99+" : unreadCount}</span>}
            </Link>
            <Link href="/profile">
              <Button variant="outline" size="sm" className="gap-2 rounded-full border-kawaii-sky/60 bg-kawaii-cloud/50">
                <UserIcon className="h-4 w-4 text-kawaii-mocha" />
                <span className="hidden sm:inline-block font-semibold text-kawaii-mocha">{user?.name || user?.email}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title={isMounted ? t.nav.logout : "Đăng xuất"}
              className="rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full font-bold gap-1.5">
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline-block">{isMounted ? t.nav.login : "Đăng nhập"}</span>
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full font-bold shadow-cloud gap-1.5">
                <UserPlus className="h-4 w-4" />
                <span>{isMounted ? t.nav.register : "Đăng ký"}</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
