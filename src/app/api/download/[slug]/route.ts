import { NextRequest, NextResponse } from "next/server";
import { isSupportedDownloadUrl } from "@/lib/download-url";

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:9999").replace(/\/$/, "");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function detailRedirect(request: NextRequest, slug: string, state: string) {
  const target = new URL(`/keyboards/${slug}`, request.nextUrl.origin);
  target.searchParams.set("download", state);
  return NextResponse.redirect(target, 303);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!slugPattern.test(slug)) return detailRedirect(request, slug, "missing");

  try {
    const response = await fetch(`${backendUrl}/api/v1/keyboards/${encodeURIComponent(slug)}/download`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") || "",
        "user-agent": request.headers.get("user-agent") || "Loichoi Web",
      },
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) return detailRedirect(request, slug, "error");

      if (!isSupportedDownloadUrl(location)) {
        return detailRedirect(request, slug, "error");
      }

      const destination = new URL(location);
      return NextResponse.redirect(destination, 302);
    }

    const payload = await response.json().catch(() => ({ code: "INTERNAL_SERVER_ERROR" })) as { code?: string };
    if (response.status === 401) return detailRedirect(request, slug, "login");
    if (response.status === 403 && payload.code?.startsWith("DISCORD_")) return detailRedirect(request, slug, "discord");
    if (response.status === 403) return detailRedirect(request, slug, "forbidden");
    if (response.status === 404) return detailRedirect(request, slug, "missing");
    if (response.status === 429) return detailRedirect(request, slug, "rate");
    return detailRedirect(request, slug, "error");
  } catch {
    return detailRedirect(request, slug, "error");
  }
}
