"use client";

import Link from "next/link";
import { Bot, CalendarClock, Construction, Server } from "lucide-react";
import { AsyncState } from "@/components/shared/admin-ui";
import { PermissionGate } from "@/components/shared/permission-gate";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";
import { PERMISSIONS } from "@/lib/constants";
import { SETTINGS_ACCESS_PERMISSIONS } from "@/lib/dashboard-access";

export default function SettingsPage() {
  const { t, isMounted } = useTranslation();

  const settingModules = [
    {
      title: isMounted ? t.settings.integrationsTitle : "Tích Hợp & API Keys",
      description: isMounted ? t.settings.integrationsDesc : "Cấu hình Discord Bot OAuth, Webhooks và các dịch vụ bên thứ ba.",
      href: "/settings/integrations",
      icon: Bot,
      permissions: [PERMISSIONS.API_KEY_READ, PERMISSIONS.WEBHOOK_READ],
    },
    {
      title: isMounted ? t.settings.systemTitle : "Cấu Hình Hệ Thống",
      description: isMounted ? t.settings.systemDesc : "Quản lý tham số toàn cục, chế độ bảo trì và các giới hạn API.",
      href: "/settings/system",
      icon: Server,
      permissions: [PERMISSIONS.SYSTEM_CONFIG_READ],
    },
    {
      title: isMounted ? t.settings.maintenanceTitle : "Chế Độ Bảo Trì",
      description: isMounted ? t.settings.maintenanceDesc : "Bật chế độ chặn toàn bộ hoặc chỉ đọc và cấu hình danh sách được phép bỏ qua.",
      href: "/settings/maintenance",
      icon: Construction,
      permissions: [PERMISSIONS.MAINTENANCE_READ, PERMISSIONS.MAINTENANCE_MANAGE],
    },
    {
      title: isMounted ? t.settings.cronTitle : "Tác Vụ Định Kỳ",
      description: isMounted ? t.settings.cronDesc : "Theo dõi lịch và kích hoạt thủ công các tác vụ nền.",
      href: "/settings/cron",
      icon: CalendarClock,
      permissions: [PERMISSIONS.CRON_JOB_READ],
    },
  ];

  return (
    <PermissionGate permissions={SETTINGS_ACCESS_PERMISSIONS} fallback={<AsyncState error />}>
      <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">
          {isMounted ? t.settings.title : "Cài Đặt Hệ Thống"}
        </h1>
        <p className="text-sm text-kawaii-mocha/70">
          {isMounted ? t.settings.subtitle : "Thiết lập cấu hình vận hành và tích hợp dịch vụ"}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingModules.map((item) => {
          const Icon = item.icon;
          return (
            <PermissionGate key={item.href} permissions={item.permissions}>
              <Link href={item.href}>
                <Card className="rounded-[2.25rem] hover:border-kawaii-babyblue hover:shadow-cloud-hover transition-all duration-300 cursor-pointer h-full bouncy-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-kawaii-mocha">{item.title}</CardTitle>
                        <CardDescription className="text-xs text-kawaii-mocha/70 mt-1">{item.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </PermissionGate>
          );
        })}
      </div>
      </div>
    </PermissionGate>
  );
}
