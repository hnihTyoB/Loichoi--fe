"use client";

import Link from "next/link";
import { ArrowRight, Cloud, Heart, Keyboard, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";
import { BrandLogo } from "@/components/shared/brand-logo";
import { useTranslation } from "@/hooks/use-translation";

export default function HomePage() {
  const { t, isMounted } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-kawaii-cream text-kawaii-mocha">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Floating background clouds and sparkles */}
          <div className="absolute top-12 left-10 opacity-30 animate-float pointer-events-none">
            <Cloud className="h-16 w-16 text-kawaii-babyblue" />
          </div>
          <div className="absolute top-24 right-16 opacity-40 animate-float-slow pointer-events-none">
            <Sparkles className="h-12 w-12 text-kawaii-warmbrown" />
          </div>
          <div className="absolute bottom-10 left-1/4 opacity-30 animate-float pointer-events-none">
            <Heart className="h-10 w-10 fill-kawaii-pink text-kawaii-pink" />
          </div>
          <div className="absolute top-1/2 right-10 opacity-20 animate-float-slow pointer-events-none">
            <Cloud className="h-20 w-20 text-kawaii-babyblue" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            {/* Cute Pill Badge */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border-2 border-kawaii-sky/80 bg-kawaii-cloud px-5 py-2 text-sm font-bold text-kawaii-mocha shadow-cloud bouncy-hover">
              <Cloud className="h-4 w-4 text-kawaii-mocha" />
              <span>{isMounted ? t.home.badge : "Cinnamoroll Edition • Bồng Bềnh & Đáng Yêu"}</span>
              <Sparkles className="h-4 w-4 text-kawaii-warmbrown animate-spin" />
            </div>

            <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-6xl md:text-7xl text-kawaii-mocha leading-tight">
              {isMounted ? t.home.heroTitle : "Tùy Biến Bàn Phím Cơ"} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-kawaii-warmbrown via-kawaii-mocha to-kawaii-babyblue bg-clip-text text-transparent">
                {isMounted ? t.home.heroTitleSub : "Phong Cách Cute Kawaii"}
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-kawaii-mocha/80 font-medium leading-relaxed">
              {isMounted ? t.home.heroDescription : "Khám phá thế giới bàn phím cơ êm ái như những đám mây. Tích hợp Discord OAuth, phân quyền động (RBAC) và tùy biến layout switch theo sở thích của bạn!"}
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 font-bold shadow-cloud bouncy-hover">
                  <span>{isMounted ? t.home.enterDashboard : "Vào Bảng Điều Khiển"}</span> <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="gap-2 border-2 border-kawaii-sky bg-card/80 font-bold bouncy-hover">
                  <MessageSquare className="h-4 w-4 text-[#5865F2]" />
                  <span>{isMounted ? t.home.loginDiscord : "Đăng Nhập Discord"}</span>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features / Biscuit Cards Section */}
        <section className="relative border-t-2 border-kawaii-sky/30 bg-kawaii-cloud/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-kawaii-blush/60 text-xs font-bold text-kawaii-mocha border border-kawaii-blush">
                <Heart className="h-3.5 w-3.5 fill-kawaii-pink text-kawaii-pink" />
                <span>{isMounted ? t.home.coreFeaturesBadge : "Tính Năng Cốt Lõi"}</span>
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-kawaii-mocha">
                {isMounted ? t.home.coreFeaturesTitle : "Mềm Mại Như Đám Mây, Chuẩn Mực Hiện Đại"}
              </h2>
              <p className="mt-2 text-sm md:text-base text-kawaii-mocha/70">
                {isMounted ? t.home.coreFeaturesDesc : "Kết hợp trọn vẹn giữa giao diện dễ thương và kiến trúc Next.js App Router mạnh mẽ."}
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="rounded-[2.25rem] border-2 border-kawaii-sky/60 bg-card p-8 shadow-cloud transition-all duration-300 bouncy-hover hover:border-kawaii-babyblue">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner">
                  <Keyboard className="h-7 w-7 text-kawaii-mocha" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-kawaii-mocha">
                  {isMounted ? t.home.feature1Title : "Quản Lý Keyboards"}
                </h3>
                <p className="mt-2.5 text-sm text-kawaii-mocha/70 leading-relaxed">
                  {isMounted ? t.home.feature1Desc : "Cấu hình chi tiết vỏ case, plate gasket mount, switch hotswap và map phím VIA/QMK nhanh chóng."}
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="rounded-[2.25rem] border-2 border-kawaii-blush/80 bg-card p-8 shadow-blush transition-all duration-300 bouncy-hover hover:border-kawaii-pink">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-blush/60 text-kawaii-mocha shadow-inner">
                  <ShieldCheck className="h-7 w-7 text-kawaii-mocha" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-kawaii-mocha">
                  {isMounted ? t.home.feature2Title : "Phân Quyền Động (RBAC)"}
                </h3>
                <p className="mt-2.5 text-sm text-kawaii-mocha/70 leading-relaxed">
                  {isMounted ? t.home.feature2Desc : "Kiểm soát ma trận phân quyền chi tiết, bảo vệ trang và nút hành động với PermissionGate linh hoạt."}
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="rounded-[2.25rem] border-2 border-kawaii-sky/60 bg-card p-8 shadow-cloud transition-all duration-300 bouncy-hover hover:border-kawaii-babyblue">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-kawaii-mocha shadow-inner">
                  <MessageSquare className="h-7 w-7 text-kawaii-mocha" />
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-kawaii-mocha">
                  {isMounted ? t.home.feature3Title : "Discord OAuth Gateway"}
                </h3>
                <p className="mt-2.5 text-sm text-kawaii-mocha/70 leading-relaxed">
                  {isMounted ? t.home.feature3Desc : "Xác thực một chạm với Discord, tự động cấp quyền thành viên theo vai trò trên máy chủ."}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cloud Wave Footer */}
      <footer className="relative border-t-2 border-kawaii-sky/30 bg-card py-10 text-center text-sm text-kawaii-mocha/70">
        <div className="container mx-auto px-4 space-y-2">
          <div className="flex justify-center items-center gap-2 text-base">
            <BrandLogo alt="" />
            <span className="font-bold text-kawaii-mocha">Loichoi Kawaii Edition</span>
            <Heart className="h-3.5 w-3.5 fill-kawaii-pink text-kawaii-pink" />
          </div>
          <p className="text-xs text-kawaii-mocha/60">
            © 2026 Loichoi Ecosystem. {isMounted ? t.home.footerNote : "Thiết kế lấy cảm hứng từ Cinnamoroll & Sanrio."}
          </p>
        </div>
      </footer>
    </div>
  );
}
