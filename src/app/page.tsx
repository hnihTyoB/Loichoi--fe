import type { Metadata } from "next";
import { HomeContent } from "@/components/public/home-content";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: { absolute: "Loichoi | Theme bàn phím điện thoại cho iOS và Android" },
  description: "Xem trước nhiều hình ảnh và tải bộ file theme bàn phím điện thoại cho iOS, Android.",
  alternates: { canonical: baseUrl },
  openGraph: {
    title: "Loichoi | Theme bàn phím điện thoại cho iOS và Android",
    description: "Thư viện theme bàn phím điện thoại có nhiều ảnh xem trước và bộ file tải được bảo vệ.",
    url: baseUrl,
    siteName: "Loichoi",
    type: "website",
  },
};

export default function HomePage() {
  return <HomeContent />;
}
