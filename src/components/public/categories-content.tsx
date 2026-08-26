"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Grid2X2, Layers3 } from "lucide-react";
import { StatePanel } from "@/components/public/state-panel";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategories } from "@/hooks/use-keyboards";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";

export function CategoriesContent() {
  const { language } = useTranslation();
  const text = getPublicCopy(language);
  const categories = useCategories();

  return (
    <div className="space-y-10">
      <section className="rounded-[2.75rem] border-2 border-kawaii-sky/60 bg-gradient-to-br from-kawaii-cloud via-card to-kawaii-blush/25 px-6 py-10 shadow-cloud md:px-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-kawaii-warmbrown shadow-sm">
          <Layers3 className="h-4 w-4" />
          {text.categories.eyebrow}
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-kawaii-mocha md:text-5xl">{text.categories.title}</h1>
        <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-kawaii-mocha/70 md:text-base">{text.categories.description}</p>
      </section>

      {categories.isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-44 rounded-[2rem]" />)}
        </div>
      ) : null}
      {categories.isError ? (
        <StatePanel icon={AlertTriangle} title={text.categories.error} description={text.explore.errorDesc} actionLabel={text.common.retry} onAction={() => categories.refetch()} />
      ) : null}
      {categories.isSuccess && categories.data.length === 0 ? (
        <StatePanel icon={Grid2X2} title={text.categories.empty} description={text.explore.emptyDesc} />
      ) : null}
      {categories.data?.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.data.map((category, index) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative overflow-hidden rounded-[2rem] border-2 border-kawaii-sky/55 bg-card p-6 shadow-cloud transition-all duration-300 hover:-translate-y-1 hover:border-kawaii-babyblue hover:shadow-cloud-hover"
            >
              <div className={index % 2 === 0 ? "absolute -right-8 -top-8 h-28 w-28 rounded-full bg-kawaii-sky/40" : "absolute -right-8 -top-8 h-28 w-28 rounded-full bg-kawaii-blush/60"} />
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-kawaii-cloud text-kawaii-mocha shadow-inner">
                <Grid2X2 className="h-6 w-6" />
              </div>
              <h2 className="relative mt-5 text-xl font-black text-kawaii-mocha">{category.name}</h2>
              <div className="relative mt-5 flex items-center justify-between border-t border-kawaii-sky/40 pt-4 text-sm font-bold text-kawaii-mocha/60">
                <span>{category.themeCount ?? 0} {text.common.keyboards}</span>
                <span className="inline-flex items-center gap-1 text-kawaii-warmbrown">
                  {text.common.viewAll}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
