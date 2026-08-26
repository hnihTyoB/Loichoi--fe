"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, LockKeyhole, MonitorSmartphone, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { KeyboardCardData, KeyboardPlatform } from "@/types/keyboard.types";

function formatCount(value: number, locale: string) {
  return new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function platformLabel(platform: KeyboardPlatform) {
  if (platform === "IOS") return "iOS";
  if (platform === "ANDROID") return "Android";
  return "iOS + Android";
}

export interface KeyboardCardProps {
  keyboard: KeyboardCardData;
  priority?: boolean;
  className?: string;
  locale?: "vi" | "en";
}

export function KeyboardCard({ keyboard, priority, className, locale = "vi" }: KeyboardCardProps) {
  const protectedTheme = keyboard.accessLevel && keyboard.accessLevel !== "FREE";

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-[2rem] border-2 border-kawaii-sky/60 bg-card shadow-cloud transition-all duration-300 hover:-translate-y-1 hover:border-kawaii-babyblue hover:shadow-cloud-hover",
        className,
      )}
    >
      <Link href={`/keyboards/${keyboard.slug}`} className="block focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30">
        <div className="relative aspect-[4/3] overflow-hidden bg-kawaii-cloud">
          <Image
            src={keyboard.coverUrl}
            alt={keyboard.name}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <Badge className="border-white/70 bg-white/90 text-kawaii-mocha backdrop-blur-sm dark:border-kawaii-sky/40 dark:bg-kawaii-cloud/90">
              <MonitorSmartphone className="h-3.5 w-3.5" />
              {platformLabel(keyboard.platform)}
            </Badge>
            {protectedTheme ? (
              <Badge variant="secondary" className="bg-kawaii-blush/95 backdrop-blur-sm">
                <LockKeyhole className="h-3.5 w-3.5" />
                {keyboard.accessLevel === "PREMIUM" ? "Member" : "Discord"}
              </Badge>
            ) : keyboard.isFeatured ? (
              <Badge variant="secondary" className="bg-kawaii-blush/95 backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Featured
              </Badge>
            ) : null}
          </div>
        </div>

        <div className="p-5">
          <div className="flex min-h-6 flex-wrap gap-1.5">
            {keyboard.categories.slice(0, 2).map((category) => (
              <span
                key={category.id}
                className="rounded-full bg-kawaii-sky/35 px-2.5 py-1 text-[11px] font-bold text-kawaii-mocha"
              >
                {category.name}
              </span>
            ))}
          </div>
          <h3 className="mt-3 line-clamp-2 text-lg font-extrabold leading-snug text-kawaii-mocha transition-colors group-hover:text-kawaii-warmbrown">
            {keyboard.name}
          </h3>
          <div className="mt-4 flex items-center justify-between border-t border-kawaii-sky/40 pt-3 text-xs font-bold text-kawaii-mocha/65">
            <span className="inline-flex items-center gap-1.5">
              <Download className="h-3.5 w-3.5" />
              {formatCount(keyboard.downloadCount, locale === "vi" ? "vi-VN" : "en-US")}
            </span>
            {keyboard.author ? (
              <span className="max-w-[55%] truncate">
                {keyboard.author.fullName || keyboard.author.username || "Loichoi Creator"}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
