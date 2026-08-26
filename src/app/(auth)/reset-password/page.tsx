"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, KeyRound, Lock } from "lucide-react";
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
import { useTranslation } from "@/hooks/use-translation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { t, isMounted } = useTranslation();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setIsLoading(true);
    try {
      toast.success("Mật khẩu đã được đổi mới thành công.");
      window.location.href = "/login";
    } catch {
      toast.error("Đặt lại mật khẩu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card/95 shadow-cloud backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-kawaii-mocha shadow-inner animate-bounce-subtle">
          <KeyRound className="h-7 w-7 text-kawaii-mocha" />
        </div>
        <CardTitle className="text-2xl font-black text-kawaii-mocha">
          {isMounted ? t.auth.resetPasswordTitle : "Đặt Mật Khẩu Mới"}
        </CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          {isMounted ? t.auth.resetPasswordSubtitle : "Tạo mật khẩu mới an toàn cho tài khoản của bạn"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">
              {isMounted ? t.auth.newPassword : "Mật khẩu mới"}
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">
              {isMounted ? t.auth.confirmPassword : "Xác nhận mật khẩu"}
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 gap-2 text-base font-bold shadow-cloud mt-2" disabled={isLoading}>
            <Lock className="h-4 w-4" />
            <span>
              {isLoading
                ? (isMounted ? t.auth.savingPassword : "Đang lưu mật khẩu mới...")
                : (isMounted ? t.auth.updatePassword : "Cập Nhật Mật Khẩu")}
            </span>
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-kawaii-mocha/70 pt-0">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-kawaii-warmbrown hover:underline font-bold">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isMounted ? t.auth.backToLogin : "Quay lại Đăng nhập"}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
