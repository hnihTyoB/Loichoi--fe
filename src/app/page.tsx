import Link from "next/link";
import { ArrowRight, Bot, Cpu, Heart, Keyboard, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/shared/header";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-kawaii-cream text-kawaii-mocha">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28">
          {/* Floating background clouds */}
          <div className="absolute top-12 left-10 text-6xl opacity-30 animate-float">☁️</div>
          <div className="absolute top-24 right-16 text-5xl opacity-40 animate-float-slow">✨</div>
          <div className="absolute bottom-10 left-1/4 text-4xl opacity-30 animate-float">🌸</div>
          <div className="absolute top-1/2 right-10 text-6xl opacity-20 animate-float-slow">☁️</div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            {/* Cute Pill Badge */}
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border-2 border-kawaii-sky/80 bg-kawaii-cloud px-5 py-2 text-sm font-bold text-kawaii-mocha shadow-cloud bouncy-hover">
              <span className="text-lg">☁️</span>
              <span>Cinnamoroll Edition • Bồng Bềnh & Đáng Yêu</span>
              <Sparkles className="h-4 w-4 text-kawaii-warmbrown animate-spin" />
            </div>

            <h1 className="mt-8 text-4xl font-black tracking-tight sm:text-6xl md:text-7xl text-kawaii-mocha leading-tight">
              Tùy Biến Bàn Phím Cơ <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-kawaii-warmbrown via-kawaii-mocha to-kawaii-babyblue bg-clip-text text-transparent">
                Phong Cách Cute Kawaii 🐾
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg text-kawaii-mocha/80 font-medium leading-relaxed">
              Khám phá thế giới bàn phím cơ êm ái như những đám mây. Tích hợp Discord OAuth, phân quyền động (RBAC) và tùy biến layout switch theo sở thích của bạn!
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2 font-bold shadow-cloud bouncy-hover">
                  <span>Vào Bảng Điều Khiển</span> <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="font-bold border-2 border-kawaii-sky bg-white/80 bouncy-hover">
                  <span>Đăng Nhập Discord</span> <span className="text-base">💬</span>
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
                🌸 Tính Năng Cốt Lõi
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-kawaii-mocha">
                Mềm Mại Như Đám Mây, Chuẩn Mực Hiện Đại
              </h2>
              <p className="mt-2 text-sm md:text-base text-kawaii-mocha/70">
                Kết hợp trọn vẹn giữa giao diện dễ thương và kiến trúc Next.js App Router mạnh mẽ.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Feature Card 1 */}
              <div className="rounded-[2.25rem] border-2 border-kawaii-sky/60 bg-card p-8 shadow-cloud transition-all duration-300 bouncy-hover hover:border-kawaii-babyblue">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-2xl shadow-inner">
                  ⌨️
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-kawaii-mocha">Quản Lý Keyboards</h3>
                <p className="mt-2.5 text-sm text-kawaii-mocha/70 leading-relaxed">
                  Cấu hình chi tiết vỏ case, plate gasket mount, switch hotswap và map phím VIA/QMK nhanh chóng.
                </p>
              </div>

              {/* Feature Card 2 */}
              <div className="rounded-[2.25rem] border-2 border-kawaii-blush/80 bg-card p-8 shadow-blush transition-all duration-300 bouncy-hover hover:border-kawaii-pink">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-blush/60 text-2xl shadow-inner">
                  🛡️
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-kawaii-mocha">Phân Quyền Động (RBAC)</h3>
                <p className="mt-2.5 text-sm text-kawaii-mocha/70 leading-relaxed">
                  Kiểm soát ma trận phân quyền chi tiết, bảo vệ trang và nút hành động với PermissionGate linh hoạt.
                </p>
              </div>

              {/* Feature Card 3 */}
              <div className="rounded-[2.25rem] border-2 border-kawaii-sky/60 bg-card p-8 shadow-cloud transition-all duration-300 bouncy-hover hover:border-kawaii-babyblue">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/40 text-2xl shadow-inner">
                  🐾
                </div>
                <h3 className="mt-5 text-xl font-extrabold text-kawaii-mocha">Discord OAuth Gateway</h3>
                <p className="mt-2.5 text-sm text-kawaii-mocha/70 leading-relaxed">
                  Xác thực một chạm với Discord, tự động cấp quyền thành viên theo vai trò trên máy chủ.
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
            <span>☁️</span>
            <span className="font-bold text-kawaii-mocha">Loichoi Kawaii Edition</span>
            <span>🌸</span>
          </div>
          <p className="text-xs text-kawaii-mocha/60">
            © 2026 Loichoi Ecosystem. Thiết kế lấy cảm hứng từ Cinnamoroll & Sanrio.
          </p>
        </div>
      </footer>
    </div>
  );
}
