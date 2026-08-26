import type { Metadata } from "next";
import { CategoriesContent } from "@/components/public/categories-content";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Danh mục theme bàn phím điện thoại",
  description: "Khám phá các bộ sưu tập theme bàn phím điện thoại theo phong cách trên Loichoi.",
  alternates: { canonical: `${baseUrl}/categories` },
  openGraph: { title: "Danh mục giao diện | Loichoi", url: `${baseUrl}/categories`, type: "website" },
};

export default function CategoriesPage() {
  return <CategoriesContent />;
}
