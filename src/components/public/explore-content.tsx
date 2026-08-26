"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { KeyboardGrid, KeyboardGridSkeleton } from "@/components/public/keyboard-grid";
import { StatePanel } from "@/components/public/state-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories, useKeyboards } from "@/hooks/use-keyboards";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";
import type { KeyboardSort } from "@/types/keyboard.types";

const validPlatforms = new Set(["ios", "android", "both"]);
const validSorts = new Set<KeyboardSort>(["latest", "popular", "liked", "name-asc", "name-desc"]);

function positivePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

export function ExploreContent({
  mode = "explore",
  fixedCategory,
}: {
  mode?: "explore" | "trending" | "category";
  fixedCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useTranslation();
  const text = getPublicCopy(language);
  const { data: categories = [] } = useCategories();
  const filters = useMemo(() => {
    const platformValue = searchParams.get("platform");
    const sortValue = searchParams.get("sort") as KeyboardSort | null;
    return {
      search: searchParams.get("search")?.trim() || "",
      category: fixedCategory || searchParams.get("category") || "",
      platform: platformValue && validPlatforms.has(platformValue) ? (platformValue as "ios" | "android" | "both") : undefined,
      sort: mode === "trending" ? ("popular" as const) : sortValue && validSorts.has(sortValue) ? sortValue : ("latest" as const),
      page: positivePage(searchParams.get("page")),
    };
  }, [fixedCategory, mode, searchParams]);

  const [searchInput, setSearchInput] = useState(filters.search);
  useEffect(() => setSearchInput(filters.search), [filters.search]);

  const query = useKeyboards({ ...filters, limit: 12 });
  const activeCategory = categories.find((category) => category.slug === fixedCategory);

  function updateUrl(values: Record<string, string | number | undefined>, resetPage = true) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined || value === "" || value === "all") next.delete(key);
      else next.set(key, String(value));
    }
    if (resetPage) next.delete("page");
    const nextQuery = next.toString();
    router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateUrl({ search: searchInput.trim() });
  }

  function clearFilters() {
    setSearchInput("");
    const preserved = new URLSearchParams();
    if (mode === "trending") preserved.set("sort", "popular");
    router.push(preserved.size ? `${pathname}?${preserved}` : pathname, { scroll: false });
  }

  const heading = mode === "trending"
    ? text.trending
    : mode === "category"
      ? {
          eyebrow: text.categories.eyebrow,
          title: activeCategory?.name || fixedCategory || text.categories.title,
          description: text.categories.description,
        }
      : text.explore;

  const totalPages = query.data?.meta.totalPages ?? 1;
  const hasActiveFilters = Boolean(filters.search || (!fixedCategory && filters.category) || filters.platform || (mode !== "trending" && filters.sort !== "latest"));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.75rem] border-2 border-kawaii-sky/60 bg-gradient-to-br from-kawaii-cloud via-card to-kawaii-blush/25 px-6 py-10 shadow-cloud md:px-10">
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-kawaii-sky/40 blur-2xl" />
        <div className="relative max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-card/85 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-kawaii-warmbrown shadow-sm">
            <SlidersHorizontal className="h-4 w-4" />
            {heading.eyebrow}
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-kawaii-mocha md:text-5xl">{heading.title}</h1>
          <p className="mt-4 max-w-2xl text-sm font-medium leading-relaxed text-kawaii-mocha/70 md:text-base">{heading.description}</p>
        </div>
      </section>

      <section className="rounded-[2.25rem] border-2 border-kawaii-sky/55 bg-card p-4 shadow-cloud md:p-6" aria-label="Keyboard filters">
        <form onSubmit={submitSearch} className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-kawaii-mocha/45" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={text.explore.search}
              className="pl-11 pr-11"
              aria-label={text.explore.search}
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  if (filters.search) updateUrl({ search: undefined });
                }}
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-kawaii-mocha/50 hover:bg-kawaii-cloud hover:text-kawaii-mocha"
                aria-label={text.explore.clear}
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
          <Button type="submit" className="md:px-7">
            <Search />
            {language === "vi" ? "Tìm kiếm" : "Search"}
          </Button>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {!fixedCategory ? (
            <label className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
              <span className="ml-2">{text.explore.category}</span>
              <select
                value={filters.category}
                onChange={(event) => updateUrl({ category: event.target.value })}
                className="h-11 w-full rounded-2xl border-2 border-input bg-background px-4 text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25"
              >
                <option value="">{text.explore.allCategories}</option>
                {categories.map((category) => <option key={category.id} value={category.slug}>{category.name}</option>)}
              </select>
            </label>
          ) : null}
          <label className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
            <span className="ml-2">{text.explore.platform}</span>
            <select
              value={filters.platform || ""}
              onChange={(event) => updateUrl({ platform: event.target.value })}
              className="h-11 w-full rounded-2xl border-2 border-input bg-background px-4 text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25"
            >
              <option value="">{text.explore.allPlatforms}</option>
              <option value="ios">iOS</option>
              <option value="android">Android</option>
              <option value="both">iOS + Android</option>
            </select>
          </label>
          {mode !== "trending" ? (
            <label className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
              <span className="ml-2">{text.explore.sort}</span>
              <select
                value={filters.sort}
                onChange={(event) => updateUrl({ sort: event.target.value === "latest" ? undefined : event.target.value })}
                className="h-11 w-full rounded-2xl border-2 border-input bg-background px-4 text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25"
              >
                <option value="latest">{text.explore.latest}</option>
                <option value="popular">{text.explore.popular}</option>
                <option value="liked">{text.explore.liked}</option>
                <option value="name-asc">{text.explore.nameAsc}</option>
                <option value="name-desc">{text.explore.nameDesc}</option>
              </select>
            </label>
          ) : null}
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-sm font-bold text-kawaii-mocha/65">
          <Filter className="h-4 w-4" />
          {query.isLoading ? text.common.loading : `${query.data?.meta.total ?? 0} ${text.explore.results}`}
        </p>
        {hasActiveFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
            <X />
            {text.explore.clear}
          </Button>
        ) : null}
      </div>

      {query.isLoading ? <KeyboardGridSkeleton /> : null}
      {query.isError ? (
        <StatePanel
          icon={AlertTriangle}
          title={text.explore.errorTitle}
          description={text.explore.errorDesc}
          actionLabel={text.common.retry}
          onAction={() => query.refetch()}
        />
      ) : null}
      {query.isSuccess && query.data.data.length === 0 ? (
        <StatePanel
          icon={Search}
          title={text.explore.emptyTitle}
          description={text.explore.emptyDesc}
          actionLabel={hasActiveFilters ? text.explore.clear : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : null}
      {query.isSuccess && query.data.data.length > 0 ? (
        <KeyboardGrid keyboards={query.data.data} locale={language} priorityCount={4} />
      ) : null}

      {query.isSuccess && totalPages > 1 ? (
        <nav className="flex flex-wrap items-center justify-center gap-3 pt-4" aria-label="Pagination">
          <Button
            type="button"
            variant="outline"
            disabled={filters.page <= 1}
            onClick={() => updateUrl({ page: filters.page - 1 }, false)}
          >
            {text.common.previous}
          </Button>
          <span className="rounded-full bg-kawaii-cloud px-5 py-2 text-sm font-extrabold text-kawaii-mocha">
            {text.common.page} {filters.page} {text.common.of} {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            disabled={filters.page >= totalPages}
            onClick={() => updateUrl({ page: filters.page + 1 }, false)}
          >
            {text.common.next}
          </Button>
        </nav>
      ) : null}
    </div>
  );
}
