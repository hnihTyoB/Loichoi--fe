import type { MetadataRoute } from "next";
import type { ApiResponse } from "@/types/api.types";
import type { KeyboardCardData, KeyboardCategory, KeyboardListResult } from "@/types/keyboard.types";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999"}/api/v1`;

async function getPublicEntries() {
  try {
    const [keyboardResponse, categoryResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/keyboards?limit=100&sort=LATEST`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }),
      fetch(`${apiBaseUrl}/categories`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) }),
    ]);

    const keyboardPayload = keyboardResponse.ok ? await keyboardResponse.json() as KeyboardListResult : undefined;
    const categoryPayload = categoryResponse.ok ? await categoryResponse.json() as ApiResponse<KeyboardCategory[]> : undefined;

    return {
      keyboards: keyboardPayload?.data || [] as KeyboardCardData[],
      categories: categoryPayload?.data || [],
    };
  } catch {
    return { keyboards: [] as KeyboardCardData[], categories: [] as KeyboardCategory[] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { keyboards, categories } = await getPublicEntries();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/keyboards`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  return [
    ...staticRoutes,
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...keyboards.map((keyboard) => ({
      url: `${baseUrl}/keyboards/${keyboard.slug}`,
      lastModified: keyboard.publishedAt ? new Date(keyboard.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [keyboard.coverUrl],
    })),
  ];
}
