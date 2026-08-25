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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.success("Thư khôi phục đã bay tới hòm thư của bạn 💌");
      setIsSent(true);
    } catch {
      toast.error("Gửi yêu cầu thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card/95 shadow-cloud backdrop-blur-md">
      <CardHeader className="space-y-2 text-center pb-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-3xl shadow-inner animate-bounce-subtle">
          📬
        </div>
        <CardTitle className="text-2xl font-black text-kawaii-mocha">Quên Mật Khẩu?</CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          Nhập email để chú cún gửi liên kết đặt lại mật khẩu ☁️
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <div className="text-center py-4 space-y-3">
            <div className="text-5xl animate-bounce-subtle">💌</div>
            <p className="text-sm text-kawaii-mocha/80 font-medium">
              Vui lòng kiểm tra hộp thư <strong>{email}</strong> và nhấp vào liên kết để đổi mật khẩu nhé!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-kawaii-mocha ml-1">Địa chỉ Email đã đăng ký</label>
              <Input
                type="email"
                placeholder="user@loichoi.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-bold shadow-cloud mt-2" disabled={isLoading}>
              {isLoading ? "Đang gửi thư ☁️..." : "Gửi Thư Khôi Phục 💌"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="justify-center text-sm text-kawaii-mocha/70 pt-0">
        <Link href="/login" className="text-kawaii-warmbrown hover:underline font-bold">
          Quay lại Đăng nhập 🐾
        </Link>
      </CardFooter>
    </Card>
  );
}
