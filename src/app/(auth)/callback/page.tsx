"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";

function GenericCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refetch } = useAuth();
  const { t, isMounted } = useTranslation();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error(`Đăng nhập thất bại: ${error}`);
      router.replace("/login");
      return;
    }

    refetch().then(() => {
      toast.success("Đăng nhập thành công! Chào mừng bạn.");
      const storedReturnPath = sessionStorage.getItem("loichoi-auth-return-to");
      sessionStorage.removeItem("loichoi-auth-return-to");
      const safeReturnPath = storedReturnPath && storedReturnPath.startsWith("/") && !storedReturnPath.startsWith("//")
        ? storedReturnPath
        : "/dashboard";
      router.replace(safeReturnPath);
    }).catch(() => {
      const storedReturnPath = sessionStorage.getItem("loichoi-auth-return-to");
      sessionStorage.removeItem("loichoi-auth-return-to");
      const safeReturnPath = storedReturnPath && storedReturnPath.startsWith("/") && !storedReturnPath.startsWith("//")
        ? storedReturnPath
        : "/dashboard";
      router.replace(safeReturnPath);
    });
  }, [router, searchParams, refetch]);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card shadow-cloud">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5865F2]/20 text-[#5865F2] shadow-inner animate-bounce-subtle">
        <MessageSquare className="h-8 w-8" />
      </div>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-kawaii-babyblue border-t-transparent" />
      <h2 className="text-xl font-extrabold text-kawaii-mocha">
        {isMounted ? t.auth.discordConnecting : "Đang xử lý đăng nhập..."}
      </h2>
      <p className="text-sm text-kawaii-mocha/70">
        {isMounted ? t.auth.discordConnectingDesc : "Vui lòng đợi một chút, hệ thống đang đồng bộ tài khoản của bạn!"}
      </p>
    </div>
  );
}

export default function GenericCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card shadow-cloud">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-kawaii-babyblue border-t-transparent" />
          <h2 className="text-xl font-extrabold text-kawaii-mocha">Đang kết nối...</h2>
        </div>
      }
    >
      <GenericCallbackContent />
    </Suspense>
  );
}
