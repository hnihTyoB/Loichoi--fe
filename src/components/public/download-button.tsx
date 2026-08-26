"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, LoaderCircle, LogIn, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";

export type DownloadState = "login" | "forbidden" | "discord" | "missing" | "rate" | "error";

const discordUrl = process.env.NEXT_PUBLIC_DISCORD_INVITE_URL || "https://discord.com";

export function DownloadButton({ slug, errorState }: { slug: string; errorState?: DownloadState }) {
  const { language } = useTranslation();
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

  return (
    <div className="space-y-3">
      <form method="post" action={`/api/download/${encodeURIComponent(slug)}`} onSubmit={() => setIsSubmitting(true)}>
        <Button type="submit" size="lg" className="w-full text-base sm:w-auto sm:min-w-56" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" /> : <Download />}
          {isSubmitting ? text.checking : text.action}
        </Button>
      </form>

      {message ? (
        <div className="max-w-lg rounded-2xl border border-kawaii-blush bg-kawaii-blush/25 p-4 text-sm font-semibold text-kawaii-mocha" role="alert">
          <p>{message}</p>
          {errorState === "login" ? (
            <Button asChild size="sm" variant="outline" className="mt-3 bg-card">
              <Link href={`/login?next=${encodeURIComponent(`/keyboards/${slug}`)}`}><LogIn />{text.loginAction}</Link>
            </Button>
          ) : null}
          {errorState === "discord" ? (
            <Button asChild size="sm" variant="outline" className="mt-3 bg-card">
              <a href={discordUrl} target="_blank" rel="noreferrer"><MessageCircle />{text.discordAction}</a>
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
