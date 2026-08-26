"use client";

import { useEffect } from "react";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t, isMounted } = useTranslation();

  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 bg-kawaii-cream text-kawaii-mocha">
      <div className="rounded-full bg-kawaii-blush/60 p-6 text-kawaii-mocha shadow-inner animate-bounce-subtle">
        <AlertCircle className="h-12 w-12 text-kawaii-warmbrown" />
      </div>
      <h2 className="mt-4 text-2xl font-black text-kawaii-mocha">
        {isMounted ? t.common.errorOccurred : "Ui, đã có sự cố nhỏ xảy ra!"}
      </h2>
      <p className="mt-2 text-sm text-kawaii-mocha/70 max-w-md font-medium">
        {error.message || (isMounted ? t.common.errorDescription : "Hệ thống gặp sự cố không mong muốn trong khi xử lý yêu cầu.")}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()} className="gap-2 font-bold shadow-cloud">
          <RefreshCw className="h-4 w-4" />
          <span>{isMounted ? t.common.retry : "Thử lại"}</span>
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")} className="gap-2 font-bold">
          <Home className="h-4 w-4" />
          <span>{isMounted ? t.common.backToHome : "Về Trang Chủ"}</span>
        </Button>
      </div>
    </div>
  );
}
