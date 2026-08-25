import Link from "next/link";
import { Bot, Server, Settings, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  const settingModules = [
    {
      title: "Tích Hợp & API Keys",
      description: "Cấu hình Discord Bot OAuth, Webhooks và các dịch vụ bên thứ ba.",
      href: "/settings/integrations",
      icon: Bot,
      emoji: "🤖",
    },
    {
      title: "Cấu Hình Hệ Thống",
      description: "Quản lý tham số toàn cục, chế độ bảo trì và các giới hạn API.",
      href: "/settings/system",
      icon: Server,
      emoji: "⚙️",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">Cài Đặt Hệ Thống ⚙️</h1>
        <p className="text-sm text-kawaii-mocha/70">Thiết lập cấu hình vận hành và tích hợp dịch vụ</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {settingModules.map((item) => {
          return (
            <Link key={item.href} href={item.href}>
              <Card className="rounded-[2.25rem] hover:border-kawaii-babyblue hover:shadow-cloud-hover transition-all duration-300 cursor-pointer h-full bouncy-hover">
                <CardHeader>
                  <div className="flex items-center gap-3.5">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-2xl shadow-inner">
                      {item.emoji}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription className="text-xs text-kawaii-mocha/70 mt-1">{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
