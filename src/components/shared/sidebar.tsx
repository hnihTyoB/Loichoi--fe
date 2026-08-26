"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FolderTree,
  Heart,
  Home,
  Keyboard,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { useTranslation } from "@/hooks/use-translation";
import { PermissionGate } from "./permission-gate";
import { PERMISSIONS } from "@/lib/constants";
import { BrandLogo } from "./brand-logo";

interface NavItem {
  id: "dashboard" | "keyboards" | "categories" | "users" | "roles" | "notifications" | "settings";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const navItems: NavItem[] = [
  { id: "dashboard", href: "/dashboard", icon: Home },
  { id: "keyboards", href: "/keyboards", icon: Keyboard },
  { id: "categories", href: "/categories", icon: FolderTree },
  { id: "users", href: "/users", icon: Users, permission: PERMISSIONS.USER_READ },
  { id: "roles", href: "/roles", icon: ShieldCheck, permission: PERMISSIONS.ROLE_READ },
  { id: "notifications", href: "/notifications", icon: Bell },
  { id: "settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useUiStore();
  const { t, isMounted } = useTranslation();

  const getNavTitle = (id: NavItem["id"]) => {
    if (!isMounted) {
      switch (id) {
        case "dashboard": return "Tổng quan";
        case "keyboards": return "Bàn phím (Keyboards)";
        case "categories": return "Danh mục";
        case "users": return "Người dùng";
        case "roles": return "Phân quyền (Roles)";
        case "notifications": return "Thông báo";
        case "settings": return "Cài đặt";
      }
    }
    return t.nav[id];
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-full w-72 flex-col border-r-2 border-kawaii-sky/30 bg-card/90 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-20 items-center border-b-2 border-kawaii-sky/30 px-6 gap-3">
        <BrandLogo priority alt="" />
        <div>
          <Link href="/dashboard" className="font-extrabold text-base tracking-tight text-kawaii-mocha">
            Loichoi Console
          </Link>
          <p className="text-[11px] font-medium text-kawaii-mocha/60">
            {isMounted ? t.common.brandSubtitle : "Cinnamoroll Edition"}
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-kawaii-mocha/50">
          {isMounted ? t.nav.menuTitle : "Danh Mục Menu"}
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const title = getNavTitle(item.id);

          const linkElement = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200 bouncy-hover",
                isActive
                  ? "bg-kawaii-babyblue text-kawaii-mocha shadow-cloud border-2 border-kawaii-sky font-bold"
                  : "text-kawaii-mocha/80 hover:bg-kawaii-cloud hover:text-kawaii-mocha"
              )}
            >
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-xl",
                isActive ? "bg-card/70 text-foreground shadow-sm" : "bg-kawaii-sky/20 text-kawaii-mocha/80"
              )}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{title}</span>
              {isActive && <Sparkles className="h-4 w-4 text-kawaii-mocha animate-pulse" />}
            </Link>
          );

          if (item.permission) {
            return (
              <PermissionGate key={item.href} permission={item.permission}>
                {linkElement}
              </PermissionGate>
            );
          }

          return linkElement;
        })}
      </nav>

      <div className="p-4 border-t-2 border-kawaii-sky/30">
        <div className="rounded-2xl border border-kawaii-blush/80 bg-kawaii-blush/30 p-3.5 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-kawaii-mocha">
            <Heart className="h-3.5 w-3.5 fill-kawaii-pink text-kawaii-pink" />
            <span>{isMounted ? t.nav.greetingFooter : "Chúc bạn ngày vui vẻ!"}</span>
          </div>
          <p className="text-[11px] text-kawaii-mocha/70 mt-0.5">
            {isMounted ? t.nav.greetingFooterSub : "Bồng bềnh trên từng phím gõ"}
          </p>
        </div>
      </div>
    </aside>
  );
}
