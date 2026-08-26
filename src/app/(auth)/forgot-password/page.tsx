"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { t, isMounted } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.success("Thư khôi phục đã được gửi tới hòm thư của bạn.");
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
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-kawaii-sky/30 text-kawaii-mocha shadow-inner animate-bounce-subtle">
          <Mail className="h-7 w-7 text-kawaii-mocha" />
        </div>
        <CardTitle className="text-2xl font-black text-kawaii-mocha">
          {isMounted ? t.auth.forgotPasswordTitle : "Quên Mật Khẩu?"}
        </CardTitle>
        <CardDescription className="text-sm text-kawaii-mocha/70">
          {isMounted ? t.auth.forgotPasswordSubtitle : "Nhập email để nhận liên kết đặt lại mật khẩu"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSent ? (
          <div className="text-center py-4 space-y-3">
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-kawaii-sky/30 text-kawaii-mocha shadow-inner animate-bounce-subtle">
                <Mail className="h-8 w-8 text-kawaii-mocha" />
              </div>
            </div>
            <p className="text-sm text-kawaii-mocha/80 font-medium">
              Vui lòng kiểm tra hộp thư <strong>{email}</strong> và nhấp vào liên kết để đổi mật khẩu nhé!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-kawaii-mocha ml-1">
                {isMounted ? t.auth.emailAddress : "Địa chỉ Email đã đăng ký"}
              </label>
              <Input
                type="email"
                placeholder="user@loichoi.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 gap-2 text-base font-bold shadow-cloud mt-2" disabled={isLoading}>
              <Mail className="h-4 w-4" />
              <span>
                {isLoading
                  ? (isMounted ? t.auth.sendingEmail : "Đang gửi thư...")
                  : (isMounted ? t.auth.sendResetEmail : "Gửi Thư Khôi Phục")}
              </span>
            </Button>
          </form>
        )}
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
