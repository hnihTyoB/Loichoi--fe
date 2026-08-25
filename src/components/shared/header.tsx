"use client";

import Link from "next/link";
import { LogOut, Menu, Sparkles, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useUiStore } from "@/stores/ui-store";
import { authService } from "@/services/auth.service";

export function Header() {
  const { user, isAuthenticated } = useAuth();
  const { toggleSidebar } = useUiStore();

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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-kawaii-sky/40 border border-kawaii-sky text-lg shadow-sm transition-transform duration-200 group-hover:scale-110">
            ☁️
          </div>
          <span className="font-extrabold bg-gradient-to-r from-kawaii-mocha to-kawaii-warmbrown bg-clip-text text-transparent">
            Loichoi <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-kawaii-blush/60 text-kawaii-mocha border border-kawaii-blush">Kawaii 🌸</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {isAuthenticated ? (
          <div className="flex items-center gap-2.5">
            <Link href="/profile">
              <Button variant="outline" size="sm" className="gap-2 rounded-full border-kawaii-sky/60 bg-kawaii-cloud/50">
                <span className="text-xs">🐾</span>
                <span className="hidden sm:inline-block font-semibold text-kawaii-mocha">{user?.name || user?.email}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              title="Đăng xuất"
              className="rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="rounded-full font-bold">
                Đăng nhập
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="rounded-full font-bold shadow-cloud">
                Đăng ký ✨
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
