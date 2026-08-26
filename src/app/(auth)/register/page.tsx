"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
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

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, isMounted } = useTranslation();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register({ name, email, password });
      toast.success("Đăng ký thành công! Hãy đăng nhập để bắt đầu.");
      window.location.href = "/login";
    } catch (err: unknown) {
      const errorMsg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordRegister = () => {
    window.location.href = authService.getDiscordOAuthUrl();
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-kawaii-blush/80 bg-card/95 shadow-blush backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <BrandLogo size="md" className="mx-auto h-14 w-14 animate-bounce-subtle" />
        <CardTitle className="text-2xl font-black text-kawaii-mocha">
          {isMounted ? t.auth.joinTitle : "Gia Nhập Loichoi"}
        </CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          {isMounted ? t.auth.joinSubtitle : "Tạo tài khoản để cá nhân hóa bàn phím của bạn"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <DiscordAuthButton onClick={handleDiscordRegister}>
          {isMounted ? t.auth.registerDiscord : "Đăng ký với Discord"}
        </DiscordAuthButton>

        <div className="relative flex items-center justify-center text-xs uppercase">
          <div className="w-full border-t border-kawaii-sky/40" />
          <span className="bg-card px-3 font-bold text-kawaii-mocha/50">
            {isMounted ? t.auth.orEmail : "hoặc email"}
          </span>
          <div className="w-full border-t border-kawaii-sky/40" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">
              {isMounted ? t.auth.fullName : "Họ và tên của bạn"}
            </label>
            <Input
              placeholder="Cinnamoroll Fan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">
              {isMounted ? t.auth.emailAddress : "Địa chỉ Email"}
            </label>
            <Input
              type="email"
              placeholder="user@loichoi.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">
              {isMounted ? t.auth.password : "Mật khẩu bảo mật"}
            </label>
            <PasswordInput
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="kawaiiPink" className="w-full h-12 gap-2 text-base font-bold shadow-blush mt-2" disabled={isLoading}>
            <UserPlus className="h-4 w-4" />
            <span>
              {isLoading
                ? (isMounted ? t.auth.registering : "Đang tạo tài khoản...")
                : (isMounted ? t.auth.registerButton : "Tạo Tài Khoản Mới")}
            </span>
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-kawaii-mocha/70 pt-0">
        {isMounted ? t.auth.alreadyHaveAccount : "Đã có tài khoản?"}{" "}
        <Link href="/login" className="ml-1.5 text-kawaii-warmbrown hover:underline font-bold">
          {isMounted ? t.auth.loginNow : "Đăng nhập ngay"}
        </Link>
      </CardFooter>
    </Card>
  );
}
