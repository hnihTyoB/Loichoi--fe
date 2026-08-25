"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Root Error:", error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="flex min-h-screen flex-col items-center justify-center p-4 text-center font-sans bg-background text-foreground">
        <h1 className="text-4xl font-bold text-destructive">Lỗi Hệ Thống Nghiêm Trọng</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          {error.message || "Root layout gặp lỗi nghiêm trọng không thể tiếp tục render."}
        </p>
        <div className="mt-6">
          <Button onClick={() => reset()}>Khởi động lại</Button>
        </div>
      </body>
    </html>
  );
}
