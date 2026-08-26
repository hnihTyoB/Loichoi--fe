"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { BrandLogo } from "@/components/shared/brand-logo";
import { DiscordAuthButton } from "@/components/shared/discord-auth-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { authService } from "@/services/auth.service";
import { useTranslation } from "@/hooks/use-translation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, isMounted } = useTranslation();

  const getSafeReturnPath = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const next = searchParams.get("next") || searchParams.get("redirect");
    return next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login({ email, password });
      toast.success("Đăng nhập thành công! Chúc bạn ngày vui vẻ.");
      window.location.href = getSafeReturnPath();
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    const returnPath = getSafeReturnPath();
    if (returnPath !== "/dashboard") {
      sessionStorage.setItem("loichoi-auth-return-to", returnPath);
    }
    window.location.href = authService.getDiscordOAuthUrl();
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card/95 shadow-cloud backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <BrandLogo size="md" className="mx-auto h-14 w-14 animate-bounce-subtle" />
        <CardTitle className="text-2xl font-black text-kawaii-mocha">
          {isMounted ? t.auth.welcomeBack : "Chào Mừng Trở Lại!"}
        </CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          {isMounted ? t.auth.loginSubtitle : "Đăng nhập để vào thế giới bàn phím Cinnamoroll"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DiscordAuthButton onClick={handleDiscordLogin}>
          {isMounted ? t.auth.loginDiscord : "Đăng nhập với Discord"}
        </DiscordAuthButton>

        <div className="relative flex items-center justify-center text-xs uppercase my-2">
          <div className="border-t border-kawaii-sky/40 w-full" />
          <span className="bg-card px-3 text-kawaii-mocha/50 font-bold">
            {isMounted ? t.auth.orEmail : "hoặc email"}
          </span>
          <div className="border-t border-kawaii-sky/40 w-full" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">
              {isMounted ? t.auth.emailAddress : "Địa chỉ Email"}
            </label>
            <Input
              type="email"
              placeholder="cinnamoroll@loichoi.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-bold text-kawaii-mocha">
                {isMounted ? t.auth.password : "Mật khẩu"}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-kawaii-warmbrown hover:underline font-semibold"
              >
                {isMounted ? t.auth.forgotPassword : "Quên mật khẩu?"}
              </Link>
            </div>
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 gap-2 text-base font-bold shadow-cloud mt-2" disabled={isLoading}>
            <LogIn className="h-4 w-4" />
            <span>
              {isLoading
                ? (isMounted ? t.auth.loggingIn : "Đang bay đến máy chủ...")
                : (isMounted ? t.auth.loginButton : "Đăng Nhập Ngay")}
            </span>
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-kawaii-mocha/70 pt-0">
        {isMounted ? t.auth.noAccount : "Chưa có tài khoản?"}{" "}
        <Link href="/register" className="ml-1.5 text-kawaii-warmbrown hover:underline font-bold">
          {isMounted ? t.auth.registerNow : "Đăng ký thành viên"}
        </Link>
      </CardFooter>
    </Card>
  );
}
