"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Download, FileArchive, Grid2X2, Images, MonitorSmartphone, ShieldCheck, UserRound } from "lucide-react";
import { DownloadButton, type DownloadState } from "@/components/public/download-button";
import { KeyboardGrid, KeyboardGridSkeleton } from "@/components/public/keyboard-grid";
import { StatePanel } from "@/components/public/state-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useKeyboard, useKeyboards } from "@/hooks/use-keyboards";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";
import type { KeyboardDetail } from "@/types/keyboard.types";

function platformLabel(platform: KeyboardDetail["platform"]) {
  if (platform === "IOS") return "iOS";
  if (platform === "ANDROID") return "Android";
  return "iOS + Android";
}

function accessLabel(access: KeyboardDetail["accessLevel"]) {
  if (access === "FREE") return "Free";
  if (access === "PREMIUM") return "Member";
  if (access === "DISCORD_ROLE") return "Discord Role";
  return "Discord Member";
}

function KeyboardGallery({ keyboard, previewLabel, previewDescription, imageUnit }: {
  keyboard: KeyboardDetail;
  previewLabel: string;
  previewDescription: string;
  imageUnit: string;
}) {
  const images = [
    { id: "cover", url: keyboard.coverUrl, altText: keyboard.name, position: -1 },
    ...keyboard.previewImages,
  ].filter((image, index, all) => all.findIndex((candidate) => candidate.url === image.url) === index);
  const [selectedId, setSelectedId] = useState(images[0].id);
  const selected = images.find((image) => image.id === selectedId) || images[0];

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2.75rem] border-2 border-kawaii-sky/65 bg-gradient-to-br from-kawaii-cloud to-kawaii-blush/30 shadow-cloud">
        <Image src={selected.url} alt={selected.altText || keyboard.name} fill priority sizes="(max-width: 1024px) 100vw, 58vw" className="object-contain p-2 md:p-4" />
        <div className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-1.5 text-xs font-extrabold text-kawaii-mocha shadow-sm backdrop-blur dark:border-kawaii-sky/40 dark:bg-kawaii-cloud/90">
          <Images className="h-3.5 w-3.5" />
          {images.findIndex((image) => image.id === selected.id) + 1} / {images.length}
        </div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-extrabold text-kawaii-mocha">{previewLabel}</h2>
          <p className="mt-1 text-xs font-medium text-kawaii-mocha/60">{previewDescription}</p>
        </div>
        <span className="shrink-0 rounded-full bg-kawaii-cloud px-3 py-1 text-xs font-bold text-kawaii-mocha/65">{images.length} {imageUnit}</span>
      </div>

      <div className="flex snap-x gap-3 overflow-x-auto pb-2" aria-label={previewLabel}>
        {images.map((image) => {
          const selectedImage = image.id === selected.id;
          return (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedId(image.id)}
              aria-pressed={selectedImage}
              className={selectedImage
                ? "relative aspect-[4/3] w-28 shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-kawaii-warmbrown bg-kawaii-cloud shadow-cloud"
                : "relative aspect-[4/3] w-28 shrink-0 snap-start overflow-hidden rounded-2xl border-2 border-kawaii-sky/50 bg-kawaii-cloud opacity-75 transition hover:opacity-100"}
            >
              <Image src={image.url} alt={image.altText || keyboard.name} fill sizes="112px" className="object-cover" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function KeyboardDetailContent({ slug, initialData, downloadState }: { slug: string; initialData?: KeyboardDetail; downloadState?: DownloadState }) {
  const { language } = useTranslation();
  const text = getPublicCopy(language);
  const keyboard = useKeyboard(slug, initialData);
  const categorySlug = keyboard.data?.categories[0]?.slug;
  const related = useKeyboards({ category: categorySlug, limit: 5, sort: "popular" });

  if (keyboard.isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-56 rounded-full" />
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <Skeleton className="aspect-[4/3] rounded-[2.5rem]" />
          <div className="space-y-5"><Skeleton className="h-12 w-full rounded-full" /><Skeleton className="h-24 w-full rounded-3xl" /><Skeleton className="h-12 w-56 rounded-full" /></div>
        </div>
      </div>
    );
  }

  if (keyboard.isError || !keyboard.data) {
    return (
      <StatePanel
        icon={AlertTriangle}
        title={text.explore.errorTitle}
        description={text.explore.errorDesc}
        actionLabel={text.common.retry}
        onAction={() => keyboard.refetch()}
      />
    );
  }

  const item = keyboard.data;
  const relatedItems = related.data?.data.filter((candidate) => candidate.id !== item.id).slice(0, 4) ?? [];

  return (
    <article className="space-y-14">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href="/keyboards"><ArrowLeft />{text.detail.back}</Link>
      </Button>

      <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <KeyboardGallery keyboard={item} previewLabel={text.detail.preview} previewDescription={text.detail.previewDescription} imageUnit={text.detail.imageUnit} />

        <div className="rounded-[2.5rem] border-2 border-kawaii-sky/60 bg-card p-6 shadow-cloud md:p-8">
          <div className="flex flex-wrap gap-2">
            {item.isFeatured ? <Badge variant="secondary">Featured</Badge> : null}
            {item.categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`}>
                <Badge>{category.name}</Badge>
              </Link>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-kawaii-mocha md:text-5xl">{item.name}</h1>
          {item.author ? (
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-kawaii-mocha/60">
              <UserRound className="h-4 w-4" />
              {item.author.fullName || item.author.username || "Loichoi Creator"}
            </p>
          ) : null}

          <dl className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl bg-kawaii-cloud/65 p-4">
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55"><MonitorSmartphone className="h-4 w-4" />{text.detail.platform}</dt>
              <dd className="mt-1 font-extrabold text-kawaii-mocha">{platformLabel(item.platform)}</dd>
            </div>
            <div className="rounded-2xl bg-kawaii-blush/35 p-4">
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55"><ShieldCheck className="h-4 w-4" />{text.detail.access}</dt>
              <dd className="mt-1 font-extrabold text-kawaii-mocha">{accessLabel(item.accessLevel)}</dd>
            </div>
            <div className="rounded-2xl bg-kawaii-cloud/65 p-4">
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55"><Download className="h-4 w-4" />{text.common.downloads}</dt>
              <dd className="mt-1 font-extrabold text-kawaii-mocha">{new Intl.NumberFormat(language === "vi" ? "vi-VN" : "en-US").format(item.downloadCount)}</dd>
            </div>
            <div className="rounded-2xl bg-kawaii-blush/35 p-4">
              <dt className="flex items-center gap-2 text-xs font-bold text-kawaii-mocha/55"><Grid2X2 className="h-4 w-4" />{text.detail.categories}</dt>
              <dd className="mt-1 truncate font-extrabold text-kawaii-mocha">{item.categories.map((category) => category.name).join(", ")}</dd>
            </div>
          </dl>

          <div className="mt-7 rounded-3xl border-2 border-kawaii-sky/55 bg-kawaii-cloud/35 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-kawaii-sky/55 text-kawaii-mocha shadow-inner">
                <FileArchive className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-black text-kawaii-mocha">{text.detail.packageTitle}</h2>
                <p className="mt-1 text-xs font-bold text-kawaii-warmbrown">{text.detail.packageIncludes}</p>
              </div>
            </div>
            <p className="mt-3 text-xs font-medium leading-relaxed text-kawaii-mocha/65">{text.detail.packageDescription}</p>
            <div className="mt-4">
            <DownloadButton slug={item.slug} errorState={downloadState} />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2.5rem] border-2 border-kawaii-sky/45 bg-kawaii-cloud/30 p-6 md:p-9">
        <h2 className="text-2xl font-black text-kawaii-mocha">{text.detail.about}</h2>
        <p className="mt-4 whitespace-pre-line text-sm font-medium leading-7 text-kawaii-mocha/75 md:text-base">
          {item.description || text.detail.noDescription}
        </p>
      </section>

      <section>
        <div className="mb-7">
          <h2 className="text-2xl font-black text-kawaii-mocha md:text-3xl">{text.detail.related}</h2>
          <p className="mt-2 text-sm font-medium text-kawaii-mocha/65">{text.detail.relatedDesc}</p>
        </div>
        {related.isLoading ? <KeyboardGridSkeleton count={4} /> : null}
        {relatedItems.length > 0 ? <KeyboardGrid keyboards={relatedItems} locale={language} /> : null}
      </section>
    </article>
  );
}
