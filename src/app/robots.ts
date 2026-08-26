import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/dashboard",
        "/users",
        "/roles",
        "/settings",
        "/profile",
        "/notifications",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/callback/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
