"use client";

import {
  ClipboardList,
  Cloud,
  Heart,
  Keyboard,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, isMounted } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-[2.5rem] border-2 border-kawaii-sky/80 bg-gradient-to-r from-kawaii-cloud via-card to-kawaii-blush/40 p-6 md:p-8 shadow-cloud flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card/90 text-xs font-bold text-kawaii-mocha border border-kawaii-sky/50 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-kawaii-warmbrown" />
            <span>{isMounted ? t.dashboard.consoleTitle : "Cinnamoroll Dashboard Console"}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-kawaii-mocha">
            {isMounted ? t.dashboard.welcome : "Xin chào"}, {user?.name || user?.email}!
          </h1>
          <p className="text-sm md:text-base text-kawaii-mocha/75 font-medium">
            {isMounted ? t.dashboard.welcomeQuestion : "Hôm nay bạn muốn thiết kế và tùy biến bàn phím cơ nào?"}
          </p>
        </div>
        <div className="text-kawaii-babyblue animate-float">
          <Cloud className="h-16 w-16 md:h-20 md:w-20" />
        </div>
      </div>

      {/* Metric Cards / Biscuit Style */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-[2rem] border-2 border-kawaii-sky/60 bg-card p-6 shadow-cloud bouncy-hover">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
              {isMounted ? t.dashboard.keyboardsManaged : "Bàn Phím Quản Lý"}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha">
              <Keyboard className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kawaii-mocha">128</div>
          <p className="text-xs font-bold text-kawaii-warmbrown mt-1.5">
            {isMounted ? t.dashboard.keyboardsGrowth : "+12 mẫu mới tháng này"}
          </p>
        </Card>

        <Card className="rounded-[2rem] border-2 border-kawaii-blush/80 bg-card p-6 shadow-blush bouncy-hover">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
              {isMounted ? t.dashboard.communityMembers : "Thành Viên"}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-blush/60 text-kawaii-mocha">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kawaii-mocha">1,420</div>
          <p className="text-xs font-bold text-kawaii-warmbrown mt-1.5">
            {isMounted ? t.dashboard.communityGrowth : "+18% tăng trưởng cộng đồng"}
          </p>
        </Card>

        <Card className="rounded-[2rem] border-2 border-kawaii-sky/60 bg-card p-6 shadow-cloud bouncy-hover">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
              {isMounted ? t.dashboard.rolesConfigured : "Phân Quyền Roles"}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-kawaii-mocha">6 Roles</div>
          <p className="text-xs font-bold text-kawaii-warmbrown mt-1.5">
            {isMounted ? t.dashboard.rolesActive : "Dynamic RBAC kích hoạt"}
          </p>
        </Card>

        <Card className="rounded-[2rem] border-2 border-kawaii-blush/80 bg-card p-6 shadow-blush bouncy-hover">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-bold text-kawaii-mocha/70 uppercase tracking-wider">
              {isMounted ? t.dashboard.systemHealth : "Hệ Thống"}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-kawaii-blush/60 text-kawaii-mocha">
              <Heart className="h-5 w-5 fill-kawaii-pink text-kawaii-pink" />
            </div>
          </div>
          <div className="text-3xl font-black text-kawaii-mocha">
            {isMounted ? t.dashboard.systemStatus : "Hoạt Động Tốt"}
          </div>
          <p className="text-xs font-bold text-emerald-600 mt-1.5">
            {isMounted ? t.dashboard.systemUptime : "Uptime 99.98% êm ái"}
          </p>
        </Card>
      </div>

      {/* Quick Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-[2.25rem]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-kawaii-sky/30 text-kawaii-mocha">
                <ClipboardList className="h-4 w-4" />
              </div>
              <CardTitle>{isMounted ? t.dashboard.recentActivity : "Hoạt Động Gần Đây"}</CardTitle>
            </div>
            <CardDescription>
              {isMounted ? t.dashboard.recentActivityDesc : "Nhật ký sự kiện và đồng bộ dữ liệu"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-kawaii-sky/30 pb-3">
              <div>
                <p className="font-bold text-kawaii-mocha">
                  {isMounted ? t.dashboard.act1Title : "Thành viên mới kết nối Discord OAuth"}
                </p>
                <p className="text-xs text-kawaii-mocha/60">cinnamo_fan#2026</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-kawaii-cloud text-kawaii-mocha">
                {isMounted ? t.dashboard.act1Time : "5 phút trước"}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-kawaii-sky/30 pb-3">
              <div>
                <p className="font-bold text-kawaii-mocha">
                  {isMounted ? t.dashboard.act2Title : "Thêm bàn phím mới: Loichoi Kawaii 75"}
                </p>
                <p className="text-xs text-kawaii-mocha/60">
                  {isMounted ? t.dashboard.act2By : "Bởi Admin"}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-kawaii-cloud text-kawaii-mocha">
                {isMounted ? t.dashboard.act2Time : "30 phút trước"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2.25rem]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#5865F2]/20 text-[#5865F2]">
                <MessageSquare className="h-4 w-4" />
              </div>
              <CardTitle>{isMounted ? t.dashboard.discordGateway : "Cổng Kết Nối Discord"}</CardTitle>
            </div>
            <CardDescription>
              {isMounted ? t.dashboard.discordGatewayDesc : "Trạng thái máy chủ và gán role tự động"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl border-2 border-kawaii-sky/60 bg-kawaii-cloud/60 p-5 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-sm text-kawaii-mocha">
                  {isMounted ? t.dashboard.discordConnected : "Máy Chủ Discord Loichoi: Đang Kết Nối"}
                </span>
              </div>
              <p className="text-xs text-kawaii-mocha/70 leading-relaxed font-medium">
                {isMounted ? t.dashboard.discordDesc : "Tự động đồng bộ quyền hạn người dùng theo cấp bậc thành viên máy chủ Discord để truy cập các tính năng bàn phím đặc quyền."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
