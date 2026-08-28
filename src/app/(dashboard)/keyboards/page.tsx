import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreContent } from "@/components/public/explore-content";
import { KeyboardGridSkeleton } from "@/components/public/keyboard-grid";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Khám phá theme bàn phím điện thoại",
  description: "Tìm kiếm và lọc theme bàn phím điện thoại theo danh mục, nền tảng và độ phổ biến.",
  alternates: { canonical: `${baseUrl}/keyboards` },
  openGraph: {
    title: "Khám phá theme bàn phím điện thoại | Loichoi",
    description: "Thư viện theme bàn phím điện thoại cho iOS và Android.",
    url: `${baseUrl}/keyboards`,
    type: "website",
  },
};

export default function KeyboardsPage() {
  return (
    <Suspense fallback={<KeyboardGridSkeleton count={30} />}>
      <ExploreContent />
    </Suspense>
  );
}
