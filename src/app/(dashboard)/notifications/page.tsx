"use client";

import { CheckCheck, MessageSquare, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslation } from "@/hooks/use-translation";

export default function NotificationsPage() {
  const { t, isMounted } = useTranslation();

  const notifications = [
    {
      id: "notif-1",
      title: "Đồng bộ vai trò Discord thành công",
      message: "Tài khoản của bạn đã được cấp quyền 'Mod Bàn Phím' từ máy chủ Discord Loichoi.",
      type: "SUCCESS",
      time: "10 phút trước",
      icon: MessageSquare,
    },
    {
      id: "notif-2",
      title: "Cảnh báo bảo mật phiên đăng nhập",
      message: "Phát hiện đăng nhập từ IP mới (14.226.x.x) tại Hà Nội, Việt Nam.",
      type: "WARNING",
      time: "2 giờ trước",
      icon: ShieldAlert,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">
            {isMounted ? t.notifications.title : "Hộp Thư Thông Báo"}
          </h1>
          <p className="text-sm text-kawaii-mocha/70">
            {isMounted ? t.notifications.subtitle : "Tin nhắn hệ thống và thông báo từ cộng đồng"}
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-full font-bold">
          <CheckCheck className="h-4 w-4" />
          <span>{isMounted ? t.notifications.markAllRead : "Đã đọc tất cả"}</span>
        </Button>
      </div>

      <div className="space-y-4">
        {notifications.map((n) => {
          const Icon = n.icon;
          return (
            <Card key={n.id} className="rounded-[2rem] hover:shadow-cloud transition-all duration-300">
              <CardHeader className="flex flex-row items-center gap-4 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-base font-bold">{n.title}</CardTitle>
                  <CardDescription className="text-xs text-kawaii-mocha/70 mt-1 font-medium">{n.message}</CardDescription>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-kawaii-cloud text-kawaii-mocha">{n.time}</span>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
