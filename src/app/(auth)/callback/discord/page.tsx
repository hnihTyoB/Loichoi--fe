"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

export default function DiscordCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch } = useAuth();
  const { t, isMounted } = useTranslation();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(`Đăng nhập Discord thất bại: ${error}`);
      router.replace("/login");
      return;
    }

    refetch().then(() => {
      toast.success("Đăng nhập Discord thành công! Chào mừng bạn.");
      router.replace("/dashboard");
    }).catch(() => {
      router.replace("/dashboard");
    });
  }, [router, searchParams, refetch]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card shadow-cloud">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5865F2]/20 text-[#5865F2] shadow-inner animate-bounce-subtle">
        <MessageSquare className="h-8 w-8" />
      </div>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-kawaii-babyblue border-t-transparent" />
      <h2 className="text-xl font-extrabold text-kawaii-mocha">
        {isMounted ? t.auth.discordConnecting : "Đang bay vào máy chủ Discord..."}
      </h2>
      <p className="text-sm text-kawaii-mocha/70">
        {isMounted ? t.auth.discordConnectingDesc : "Vui lòng đợi một chút xíu, hệ thống đang đồng bộ tài khoản đáng yêu của bạn!"}
      </p>
    </div>
  );
}
