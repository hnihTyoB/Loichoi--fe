"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, LoaderCircle, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";

export type DownloadState = "login" | "forbidden" | "discord" | "missing" | "rate" | "error";

const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.com";

export function DownloadButton({ slug, errorState }: { slug: string; errorState?: DownloadState }) {
  const { language } = useTranslation();
  const auth = useAuth();
  const text = getPublicCopy(language).download;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const message = errorState === "login"
    ? text.login
    : errorState === "missing"
      ? text.missing
      : errorState === "rate"
        ? text.rate
        : errorState === "discord" || errorState === "forbidden"
          ? text.forbidden
          : errorState === "error"
            ? text.error
            : undefined;
  const requiresLogin = !auth.isLoading && !auth.isAuthenticated;

  if (requiresLogin || errorState === "login") {
    return (
      <div className="w-full rounded-2xl border border-kawaii-blush bg-kawaii-blush/25 p-4 text-center text-sm font-semibold text-kawaii-mocha" role="alert">
        <p>{text.login}</p>
        <Button asChild className="mt-4 w-full">
          <Link href={`/login?next=${encodeURIComponent(`/keyboards/${slug}`)}`}><LogIn />{text.loginAction}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      <form className="w-full" method="post" action={`/api/download/${encodeURIComponent(slug)}`} onSubmit={() => setIsSubmitting(true)}>
        <Button type="submit" size="lg" className="w-full text-base" disabled={auth.isLoading || isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Download />}
          {isSubmitting ? text.checking : text.action}
        </Button>
      </form>

      {message ? (
        <div className="w-full rounded-2xl border border-kawaii-blush bg-kawaii-blush/25 p-4 text-center text-sm font-semibold text-kawaii-mocha" role="alert">
          <p>{message}</p>
          {errorState === "discord" ? (
            <Button asChild size="sm" variant="outline" className="mt-3 w-full bg-card">
              <a href={discordUrl} target="_blank" rel="noreferrer"><MessageCircle />{text.discordAction}</a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
