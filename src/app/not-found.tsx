"use client";

import Link from "next/link";
import { Cloud, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";

export default function NotFound() {
  const { t, isMounted } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center px-4 bg-kawaii-cream text-kawaii-mocha">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-kawaii-sky/30 text-kawaii-babyblue shadow-cloud animate-bounce-subtle">
        <Cloud className="h-16 w-16" />
      </div>
      <h1 className="mt-4 text-7xl font-black text-kawaii-babyblue">404</h1>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-kawaii-mocha">
        {isMounted ? t.common.pageNotFound : "Trang Bị Lạc Giữa Những Đám Mây"}
      </h2>
      <p className="mt-2 text-sm text-kawaii-mocha/70 max-w-md font-medium">
        {isMounted ? t.common.pageNotFoundDesc : "Trang bạn đang tìm kiếm có thể đã bay đi theo chú cún Cinnamoroll rồi. Hãy quay về trang chủ nhé!"}
      </p>
      <div className="mt-6">
        <Link href="/">
          <Button size="lg" className="gap-2 font-bold shadow-cloud">
            <Home className="h-5 w-5" />
            <span>{isMounted ? t.common.backToHome : "Quay về Trang Chủ"}</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
