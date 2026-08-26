"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Boxes, CalendarClock, ClipboardList, Construction, Flag, FolderTree, Heart, Home, KeyRound, Palette, Settings, ShieldCheck, Sparkles, Users } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { PermissionGate } from "./permission-gate";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

interface NavItem { href: string; icon: React.ComponentType<{ className?: string }>; permission?: string; vi: string; en: string }
const navItems: NavItem[] = [
  { href: "/dashboard", icon: Home, vi: "Tổng quan", en: "Dashboard" },
  { href: "/keyboards/manage", icon: Palette, permission: PERMISSIONS.KEYBOARD_READ, vi: "Quản trị theme", en: "Theme management" },
  { href: "/categories/manage", icon: FolderTree, permission: PERMISSIONS.CATEGORY_READ, vi: "Quản trị danh mục", en: "Category management" },
  { href: "/collections", icon: Boxes, permission: PERMISSIONS.COLLECTION_READ, vi: "Bộ sưu tập", en: "Collections" },
  { href: "/users", icon: Users, permission: PERMISSIONS.USER_READ, vi: "Người dùng", en: "Users" },
  { href: "/roles", icon: ShieldCheck, permission: PERMISSIONS.ROLE_READ, vi: "Vai trò và quyền", en: "Roles & permissions" },
  { href: "/audit-logs", icon: ClipboardList, permission: PERMISSIONS.AUDIT_LOG_READ, vi: "Nhật ký kiểm toán", en: "Audit logs" },
  { href: "/notifications", icon: Bell, vi: "Thông báo", en: "Notifications" },
  { href: "/studio", icon: Palette, permission: PERMISSIONS.STUDIO_ACCESS, vi: "Creator Studio", en: "Creator Studio" },
  { href: "/settings/integrations", icon: KeyRound, permission: PERMISSIONS.API_KEY_READ, vi: "API và Webhook", en: "API & Webhooks" },
  { href: "/settings/system", icon: Flag, permission: PERMISSIONS.SYSTEM_CONFIG_READ, vi: "Cấu hình hệ thống", en: "System configuration" },
  { href: "/settings/maintenance", icon: Construction, permission: PERMISSIONS.MAINTENANCE_READ, vi: "Bảo trì", en: "Maintenance" },
  { href: "/settings/cron", icon: CalendarClock, permission: PERMISSIONS.CRON_JOB_READ, vi: "Tác vụ định kỳ", en: "Scheduled jobs" },
  { href: "/settings", icon: Settings, vi: "Cài đặt", en: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSidebarOpen } = useUiStore();
  const { t, isMounted, language } = useTranslation();
  return <aside className={cn("fixed inset-y-0 left-0 z-30 flex h-full w-72 flex-col border-r-2 border-kawaii-sky/30 bg-card/90 backdrop-blur-md transition-transform duration-300 md:static md:translate-x-0", isSidebarOpen ? "translate-x-0" : "-translate-x-full")}>
    <div className="flex h-20 items-center gap-3 border-b-2 border-kawaii-sky/30 px-6"><BrandLogo priority alt="" /><div><Link href="/dashboard" className="text-base font-extrabold tracking-tight text-kawaii-mocha">Loichoi Console</Link><p className="text-[11px] font-medium text-kawaii-mocha/60">{isMounted ? t.common.brandSubtitle : "Cinnamoroll Edition"}</p></div></div>
    <nav className="flex-1 space-y-1.5 overflow-y-auto p-4"><div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-kawaii-mocha/50">{isMounted ? t.nav.menuTitle : "Danh mục menu"}</div>{navItems.map((item) => {
      const Icon = item.icon;
      const active =
        pathname === item.href ||
        (item.href !== "/dashboard" &&
          pathname.startsWith(`${item.href}/`) &&
          !navItems.some(
            (other) =>
              other.href !== item.href &&
              other.href.startsWith(item.href) &&
              (pathname === other.href || pathname.startsWith(`${other.href}/`))
          ));
      const link = <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 bouncy-hover", active ? "border-2 border-kawaii-sky bg-kawaii-babyblue font-bold text-kawaii-mocha shadow-cloud" : "text-kawaii-mocha/80 hover:bg-kawaii-cloud hover:text-kawaii-mocha")}><div className={cn("flex h-8 w-8 items-center justify-center rounded-xl", active ? "bg-card/70 shadow-sm" : "bg-kawaii-sky/20")}><Icon className="h-4 w-4" /></div><span className="flex-1">{isMounted && language === "en" ? item.en : item.vi}</span>{active && <Sparkles className="h-4 w-4 animate-pulse" />}</Link>;
      return item.permission ? <PermissionGate key={item.href} permission={item.permission}>{link}</PermissionGate> : link;
    })}</nav>
    <div className="border-t-2 border-kawaii-sky/30 p-4"><div className="rounded-2xl border border-kawaii-blush/80 bg-kawaii-blush/30 p-3.5 text-center"><div className="flex items-center justify-center gap-1.5 text-xs font-bold text-kawaii-mocha"><Heart className="h-3.5 w-3.5 fill-kawaii-pink text-kawaii-pink" /><span>{isMounted ? t.nav.greetingFooter : "Chúc bạn ngày vui vẻ!"}</span></div></div></div>
  </aside>;
}
