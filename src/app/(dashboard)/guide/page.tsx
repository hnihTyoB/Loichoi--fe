import type { Metadata } from "next";
import { Suspense } from "react";
import { GuideContent } from "@/components/public/guide-content";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Hướng dẫn cài đặt & sử dụng theme bàn phím",
  description: "Cẩm nang hướng dẫn chi tiết cách tải, cài đặt file theme .bdi cho iOS, .bds cho Android, đồng bộ tài khoản Discord và tham gia Creator Studio trên Loichoi.",
  alternates: { canonical: `${baseUrl}/guide` },
  openGraph: {
    title: "Hướng dẫn cài đặt & sử dụng theme | Loichoi",
    description: "Cẩm nang hướng dẫn chi tiết cách tải, cài đặt file theme .bdi cho iOS, .bds cho Android trên Loichoi.",
    url: `${baseUrl}/guide`,
    type: "website",
  },
};

export default function GuidePage() {
  return (
    <Suspense>
      <GuideContent />
    </Suspense>
  );
}
