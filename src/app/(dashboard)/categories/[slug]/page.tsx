import type { Metadata } from "next";
import { Suspense } from "react";
import { ExploreContent } from "@/components/public/explore-content";
import { KeyboardGridSkeleton } from "@/components/public/keyboard-grid";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const readableName = slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
  return {
    title: `${readableName} mobile keyboard themes`,
    description: `Khám phá các theme bàn phím điện thoại thuộc danh mục ${readableName} trên Loichoi.`,
    alternates: { canonical: `${baseUrl}/categories/${slug}` },
  };
}

export default async function CategoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <Suspense fallback={<KeyboardGridSkeleton />}>
      <ExploreContent mode="category" fixedCategory={slug} />
    </Suspense>
  );
}
