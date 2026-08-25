"use client";

import Link from "next/link";
import { ArrowLeft, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/settings">
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-kawaii-mocha">Tích Hợp & API Keys 🤖</h1>
          <p className="text-sm text-kawaii-mocha/70">Quản lý Discord OAuth Gateway và các Webhooks</p>
        </div>
      </div>

      <Card className="rounded-[2.25rem]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5865F2]/20 text-[#5865F2] text-2xl shadow-inner">
                💬
              </div>
              <div>
                <CardTitle className="text-lg">Discord OAuth Gateway</CardTitle>
                <CardDescription className="text-xs">Đồng bộ tự động vai trò máy chủ Discord</CardDescription>
              </div>
            </div>
            <Badge variant="default" className="font-bold bg-emerald-100 text-emerald-800 border-emerald-300">
              ✨ Đang hoạt động
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">Discord Client ID</label>
            <Input value={process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "123456789012345678"} readOnly className="bg-muted/40 font-mono text-xs" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">OAuth Redirect URI</label>
            <Input value="http://localhost:3000/callback/discord" readOnly className="bg-muted/40 font-mono text-xs" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
