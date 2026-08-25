"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4 bg-kawaii-cream text-kawaii-mocha">
      <div className="rounded-full bg-kawaii-blush/60 p-6 text-4xl shadow-inner animate-bounce-subtle">
        😿
      </div>
      <h2 className="mt-4 text-2xl font-black text-kawaii-mocha">Ui, đã có sự cố nhỏ xảy ra!</h2>
      <p className="mt-2 text-sm text-kawaii-mocha/70 max-w-md font-medium">
        {error.message || "Hệ thống gặp sự cố không mong muốn trong khi xử lý yêu cầu."}
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={() => reset()} className="font-bold shadow-cloud">
          Thử lại 🐾
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")} className="font-bold">
          Về Trang Chủ ☁️
        </Button>
      </div>
    </div>
  );
}
