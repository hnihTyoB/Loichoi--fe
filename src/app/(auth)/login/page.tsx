"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { LogIn, User as UserIcon } from "lucide-react";
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
import { authService } from "@/services/auth.service";
import { useTranslation } from "@/hooks/use-translation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, isMounted } = useTranslation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.login({ email, password });
      toast.success("Đăng nhập thành công! Chúc bạn ngày vui vẻ.");
      window.location.href = "/dashboard";
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại!";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = authService.getDiscordOAuthUrl();
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card/95 shadow-cloud backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-kawaii-mocha shadow-inner animate-bounce-subtle">
          <UserIcon className="h-7 w-7 text-kawaii-mocha" />
        </div>
        <CardTitle className="text-2xl font-black text-kawaii-mocha">
          {isMounted ? t.auth.welcomeBack : "Chào Mừng Trở Lại!"}
        </CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          {isMounted ? t.auth.loginSubtitle : "Đăng nhập để vào thế giới bàn phím Cinnamoroll"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          className="w-full h-12 gap-2.5 rounded-full bg-[#5865F2]/10 hover:bg-[#5865F2]/20 border-2 border-[#5865F2]/30 text-[#5865F2] font-bold bouncy-hover"
          onClick={handleDiscordLogin}
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74c6.45,0,11.55,5.78,11.43,12.74C53.88,60,48.82,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74c6.44,0,11.55,5.78,11.43,12.74C96.12,60,91.08,65.69,84.69,65.69Z" />
          </svg>
          {isMounted ? t.auth.loginDiscord : "Đăng nhập với Discord"}
        </Button>

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
            <Input
              type="password"
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
