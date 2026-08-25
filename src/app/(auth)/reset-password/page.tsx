"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    setIsLoading(true);
    try {
      toast.success("Mật khẩu đã được đổi mới thành công 🌸");
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-3xl shadow-inner animate-bounce-subtle">
          🔑
        </div>
        <CardTitle className="text-2xl font-black text-kawaii-mocha">Đặt Mật Khẩu Mới</CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          Tạo mật khẩu mới an toàn cho tài khoản của bạn ☁️
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">Mật khẩu mới</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">Xác nhận mật khẩu</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base font-bold shadow-cloud mt-2" disabled={isLoading}>
            {isLoading ? "Đang lưu mật khẩu mới 🐾..." : "Cập Nhật Mật Khẩu ✨"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-kawaii-mocha/70 pt-0">
        <Link href="/login" className="text-kawaii-warmbrown hover:underline font-bold">
          Quay lại Đăng nhập 🐾
        </Link>
      </CardFooter>
    </Card>
  );
}
