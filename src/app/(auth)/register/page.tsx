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
import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await authService.register({ name, email, password });
      toast.success("Đăng ký thành công! Hãy đăng nhập để bắt đầu 🌸");
      window.location.href = "/login";
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-kawaii-blush/80 bg-card/95 shadow-blush backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-blush/40 text-3xl shadow-inner animate-bounce-subtle">
          🌸
        </div>
        <CardTitle className="text-2xl font-black text-kawaii-mocha">Gia Nhập Loichoi</CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          Tạo tài khoản để cá nhân hóa bàn phím của bạn ☁️
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">Họ và tên của bạn</label>
            <Input
              placeholder="Cinnamoroll Cún Con"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">Địa chỉ Email</label>
            <Input
              type="email"
              placeholder="user@loichoi.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-kawaii-mocha ml-1">Mật khẩu bảo mật</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" variant="kawaiiPink" className="w-full h-12 text-base font-bold shadow-blush mt-2" disabled={isLoading}>
            {isLoading ? "Đang tạo tài khoản 🐾..." : "Tạo Tài Khoản Mới ✨"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-kawaii-mocha/70 pt-0">
        Đã có tài khoản?{" "}
        <Link href="/login" className="ml-1.5 text-kawaii-warmbrown hover:underline font-bold">
          Đăng nhập ngay ☁️
        </Link>
      </CardFooter>
    </Card>
  );
}
