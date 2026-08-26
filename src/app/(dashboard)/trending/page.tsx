import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreContent } from "@/components/public/explore-content";
import { KeyboardGridSkeleton } from "@/components/public/keyboard-grid";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Theme bàn phím điện thoại thịnh hành",
  description: "Khám phá những theme bàn phím điện thoại có nhiều lượt tải nhất trên Loichoi.",
  alternates: { canonical: `${baseUrl}/trending` },
  openGraph: { title: "Giao diện thịnh hành | Loichoi", url: `${baseUrl}/trending`, type: "website" },
};

export default function TrendingPage() {
  return (
    <Suspense fallback={<KeyboardGridSkeleton />}>
      <ExploreContent mode="trending" />
    </Suspense>
  );
}
