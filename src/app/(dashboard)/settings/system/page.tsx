"use client";

import Link from "next/link";
import { ArrowLeft, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/use-translation";

export default function SystemSettingsPage() {
  const { t, isMounted } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">
            {isMounted ? t.settings.systemTitle : "Cấu Hình Hệ Thống"}
          </h1>
          <p className="text-sm text-kawaii-mocha/70">
            {isMounted ? t.settings.systemDesc : "Thông tin môi trường runtime và tham số máy chủ"}
          </p>
        </div>
      </div>

      <Card className="rounded-[2.25rem]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner">
              <Cloud className="h-6 w-6" />
            </div>
            <div>
              <CardTitle>{isMounted ? t.settings.runtimeEnv : "Môi Trường Vận Hành"}</CardTitle>
              <CardDescription>{isMounted ? t.settings.runtimeDesc : "Thông số runtime Next.js Frontend & Backend API"}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-kawaii-sky/30 pb-2.5">
            <span className="text-kawaii-mocha/70">{isMounted ? t.settings.uiDesignLabel : "Thiết Kế Giao Diện"}</span>
            <span className="font-bold text-kawaii-mocha">{isMounted ? t.settings.uiDesignValue : "Cute Kawaii (Cinnamoroll Style)"}</span>
          </div>
          <div className="flex justify-between border-b border-kawaii-sky/30 pb-2.5">
            <span className="text-kawaii-mocha/70">{isMounted ? t.settings.frontendFramework : "Frontend Framework"}</span>
            <span className="font-bold text-kawaii-mocha">Next.js 15+ (App Router)</span>
          </div>
          <div className="flex justify-between border-b border-kawaii-sky/30 pb-2.5">
            <span className="text-kawaii-mocha/70">{isMounted ? t.settings.backendEndpoint : "Backend API Endpoint"}</span>
            <span className="font-mono text-xs font-bold text-kawaii-warmbrown">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:9999/api/v1"}</span>
          </div>
          <div className="flex justify-between border-b border-kawaii-sky/30 pb-2.5">
            <span className="text-kawaii-mocha/70">{isMounted ? t.settings.authMode : "Chế độ Xác thực (Auth)"}</span>
            <Badge variant="secondary" className="font-bold">{isMounted ? t.settings.authModeValue : "HTTP-Only Cookie + Discord OAuth"}</Badge>
          </div>
          <div className="flex justify-between border-b border-kawaii-sky/30 pb-2.5">
            <span className="text-kawaii-mocha/70">{isMounted ? t.settings.envMode : "Môi trường"}</span>
            <span className="font-bold uppercase text-kawaii-mocha">{process.env.NODE_ENV}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
