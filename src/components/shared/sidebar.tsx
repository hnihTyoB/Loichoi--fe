"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  FolderTree,
  Home,
  Keyboard,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import { PermissionGate } from "./permission-gate";
import { PERMISSIONS } from "@/lib/constants";

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji?: string;
  permission?: string;
}

const navItems: NavItem[] = [
  { title: "Tổng quan", href: "/dashboard", icon: Home, emoji: "☁️" },
  { title: "Bàn phím (Keyboards)", href: "/keyboards", icon: Keyboard, emoji: "⌨️", permission: PERMISSIONS.KEYBOARD_READ },
  { title: "Danh mục", href: "/categories", icon: FolderTree, emoji: "📂" },
  { title: "Người dùng", href: "/users", icon: Users, emoji: "🐾", permission: PERMISSIONS.USER_READ },
  { title: "Phân quyền (Roles)", href: "/roles", icon: ShieldCheck, emoji: "🛡️", permission: PERMISSIONS.ROLE_READ },
  { title: "Thông báo", href: "/notifications", icon: Bell, emoji: "🔔" },
  { title: "Cài đặt", href: "/settings", icon: Settings, emoji: "⚙️" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useUiStore();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex h-full w-72 flex-col border-r-2 border-kawaii-sky/30 bg-card/90 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-20 items-center border-b-2 border-kawaii-sky/30 px-6 gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-xl shadow-inner">
          🐾
        </div>
        <div>
          <Link href="/dashboard" className="font-extrabold text-base tracking-tight text-kawaii-mocha">
            Loichoi Console
          </Link>
          <p className="text-[11px] font-medium text-kawaii-mocha/60">Cinnamoroll Edition ☁️</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto p-4">
        <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-kawaii-mocha/50">
          Danh Mục Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

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
              <span className="text-base">{item.emoji}</span>
              <span className="flex-1">{item.title}</span>
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
          <p className="text-xs font-bold text-kawaii-mocha">✨ Chúc bạn ngày vui vẻ!</p>
          <p className="text-[11px] text-kawaii-mocha/70 mt-0.5">Bồng bềnh trên từng phím gõ ☁️</p>
        </div>
      </div>
    </aside>
  );
}
