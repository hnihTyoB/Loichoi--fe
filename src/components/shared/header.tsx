"use client";

import Link from "next/link";
import { LogIn, LogOut, Menu, User as UserIcon, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "./brand-logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageToggle } from "./language-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore } from "@/stores/ui-store";
import { useTranslation } from "@/hooks/use-translation";
import { authService } from "@/services/auth.service";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useUiStore();
  const { t, isMounted } = useTranslation();

  const handleLogout = async () => {
    try {
      await authService.logout();
      window.location.href = "/login";
    } catch {
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center justify-between border-b-2 border-kawaii-sky/30 bg-background/90 px-4 md:px-8 backdrop-blur-md">
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

      <div className="flex items-center gap-2.5 sm:gap-3">
        <LanguageToggle />
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2.5">
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
