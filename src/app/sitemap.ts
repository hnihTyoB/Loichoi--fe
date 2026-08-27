import type { MetadataRoute } from "next";
import type { KeyboardCardData, KeyboardListResult } from "@/types/keyboard.types";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999"}/api/v1`;

async function getPublicEntries() {
  try {
    const keyboardResponse = await fetch(`${apiBaseUrl}/keyboards?limit=100&sort=LATEST`, { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) });

    const keyboardPayload = keyboardResponse.ok ? await keyboardResponse.json() as KeyboardListResult : undefined;
    return keyboardPayload?.data || [] as KeyboardCardData[];
  } catch {
    return [] as KeyboardCardData[];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const keyboards = await getPublicEntries();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/keyboards`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/trending`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
  ];

  return [
    ...staticRoutes,
    ...keyboards.map((keyboard) => ({
      url: `${baseUrl}/keyboards/${keyboard.slug}`,
      lastModified: keyboard.publishedAt ? new Date(keyboard.publishedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [keyboard.coverUrl],
    })),
  ];
}
