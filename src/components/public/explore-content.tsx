"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, ArrowUpDown, ChevronDown, Filter, Grid2X2, MonitorSmartphone, Palette, Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { KeyboardGrid, KeyboardGridSkeleton } from "@/components/public/keyboard-grid";
import { StatePanel } from "@/components/public/state-panel";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useCategories, useColors, useKeyboards, useStyles } from "@/hooks/use-keyboards";
import { useTranslation } from "@/hooks/use-translation";
import { getPublicCopy } from "@/lib/public-copy";
import type { KeyboardSort } from "@/types/keyboard.types";

const validPlatforms = new Set(["ios", "android", "both"]);
const validSorts = new Set<KeyboardSort>(["latest", "popular", "liked", "name-asc", "name-desc"]);

function positivePage(value: string | null) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function taxonomyValues(plural: string | null, singular: string | null) {
  return Array.from(new Set((plural || singular || "").split(",").map((value) => value.trim()).filter(Boolean)));
}

function SingleFilterDropdown({
  value,
  allLabel,
  options,
  ariaLabel,
  onValueChange,
}: {
  value?: string;
  allLabel: string;
  options: Array<{ value: string; label: string }>;
  ariaLabel: string;
  onValueChange: (value: string) => void;
}) {
  const selected = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" aria-label={ariaLabel} className="flex h-11 w-full items-center gap-2 rounded-2xl border-2 border-input bg-background px-4 text-left text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25">
          <span className="min-w-0 flex-1 truncate">{selected?.label || allLabel}</span>
          <ChevronDown className="h-4 w-4 shrink-0 text-kawaii-mocha/50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-64 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
        <DropdownMenuRadioGroup value={value || "__all"} onValueChange={(next) => onValueChange(next === "__all" ? "" : next)}>
          <DropdownMenuRadioItem value="__all">{allLabel}</DropdownMenuRadioItem>
          {options.map((option) => <DropdownMenuRadioItem key={option.value} value={option.value}>{option.label}</DropdownMenuRadioItem>)}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const KEYBOARDS_PER_PAGE = 52;

export function ExploreContent({ mode = "explore" }: { mode?: "explore" | "trending" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { language } = useTranslation();
  const text = getPublicCopy(language);
  const { data: categories = [] } = useCategories();
  const { data: colors = [] } = useColors();
  const { data: styles = [] } = useStyles();
  const filters = useMemo(() => {
    const platformValue = searchParams.get("platform");
    const sortValue = searchParams.get("sort") as KeyboardSort | null;
    return {
      search: searchParams.get("search")?.trim() || "",
      category: searchParams.get("category") || "",
      colors: taxonomyValues(searchParams.get("colors"), searchParams.get("color")),
      styles: taxonomyValues(searchParams.get("styles"), searchParams.get("style")),
      platform: platformValue && validPlatforms.has(platformValue) ? (platformValue as "ios" | "android" | "both") : undefined,
      sort: mode === "trending" ? ("popular" as const) : sortValue && validSorts.has(sortValue) ? sortValue : ("latest" as const),
      page: positivePage(searchParams.get("page")),
    };
  }, [mode, searchParams]);

  const [searchInput, setSearchInput] = useState(filters.search);
  const [jumpPage, setJumpPage] = useState(String(filters.page));

  useEffect(() => setSearchInput(filters.search), [filters.search]);
  useEffect(() => setJumpPage(String(filters.page)), [filters.page]);

  const query = useKeyboards({ ...filters, limit: KEYBOARDS_PER_PAGE });

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

  function handleJumpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pageNum = Number(jumpPage);
    const maxPage = query.data?.meta.totalPages ?? 1;
    if (Number.isInteger(pageNum) && pageNum >= 1 && pageNum <= maxPage) {
      updateUrl({ page: pageNum }, false);
    }
  }

  function toggleTaxonomy(key: "colors" | "styles", slug: string, current: string[]) {
    const next = current.includes(slug) ? current.filter((value) => value !== slug) : [...current, slug];
    updateUrl({ [key]: next.length ? next.join(",") : undefined, [key === "colors" ? "color" : "style"]: undefined });
  }

  function clearFilters() {
    setSearchInput("");
    const preserved = new URLSearchParams();
    if (mode === "trending") preserved.set("sort", "popular");
    router.push(preserved.size ? `${pathname}?${preserved}` : pathname, { scroll: false });
  }

  const heading = mode === "trending" ? text.trending : text.explore;

  const totalPages = query.data?.meta.totalPages ?? 1;
  const totalCount = query.data?.meta.total ?? 0;
  const startItem = totalCount > 0 ? (filters.page - 1) * KEYBOARDS_PER_PAGE + 1 : 0;
  const endItem = Math.min(filters.page * KEYBOARDS_PER_PAGE, totalCount);

  const hasActiveFilters = Boolean(filters.search || filters.category || filters.colors.length || filters.styles.length || filters.platform || (mode !== "trending" && filters.sort !== "latest"));
  const selectedColors = colors.filter((color) => filters.colors.includes(color.slug));
  const selectedStyles = styles.filter((style) => filters.styles.includes(style.slug));

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.75rem] border-2 border-kawaii-sky/60 bg-gradient-to-br from-kawaii-cloud via-card to-kawaii-blush/25 px-6 py-10 shadow-cloud md:px-10">
        <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-kawaii-sky/40 blur-2xl" />
        <div className="relative max-w-4xl">
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
              className="pl-11 pr-11 h-11 rounded-2xl border-2 border-input bg-kawaii-cloud/30"
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
          <Button type="submit" className="h-11 rounded-2xl md:px-7 bg-kawaii-babyblue text-white hover:bg-kawaii-babyblue/90 font-bold bouncy-hover">
            <Search className="h-4 w-4 mr-1.5" />
            {language === "vi" ? "Tìm kiếm" : "Search"}
          </Button>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
            <span className="ml-2 flex items-center gap-1.5"><Grid2X2 className="h-3.5 w-3.5 text-kawaii-babyblue" />{text.explore.category}</span>
            <SingleFilterDropdown
              value={filters.category}
              allLabel={text.explore.allCategories}
              ariaLabel={text.explore.category}
              options={categories.map((category) => ({ value: category.slug, label: category.name }))}
              onValueChange={(value) => updateUrl({ category: value })}
            />
          </div>
          <div className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
            <span className="ml-2 flex items-center gap-1.5"><MonitorSmartphone className="h-3.5 w-3.5 text-kawaii-babyblue" />{text.explore.platform}</span>
            <SingleFilterDropdown
              value={filters.platform || ""}
              allLabel={text.explore.allPlatforms}
              ariaLabel={text.explore.platform}
              options={[
                { value: "ios", label: "iOS" },
                { value: "android", label: "Android" },
                { value: "both", label: "iOS + Android" },
              ]}
              onValueChange={(value) => updateUrl({ platform: value })}
            />
          </div>
          {mode !== "trending" ? (
            <div className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
              <span className="ml-2 flex items-center gap-1.5"><ArrowUpDown className="h-3.5 w-3.5 text-kawaii-babyblue" />{text.explore.sort}</span>
              <SingleFilterDropdown
                value={filters.sort}
                allLabel={text.explore.latest}
                ariaLabel={text.explore.sort}
                options={[
                  { value: "latest", label: text.explore.latest },
                  { value: "popular", label: text.explore.popular },
                  { value: "liked", label: text.explore.liked },
                  { value: "name-asc", label: text.explore.nameAsc },
                  { value: "name-desc", label: text.explore.nameDesc },
                ]}
                onValueChange={(value) => updateUrl({ sort: value === "latest" ? undefined : value })}
              />
            </div>
          ) : null}
          <div className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
            <span className="ml-2 flex items-center gap-1.5"><Palette className="h-3.5 w-3.5 text-kawaii-babyblue" />{text.explore.colors}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex h-11 w-full items-center gap-2 rounded-2xl border-2 border-input bg-background px-4 text-left text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25">
                  {selectedColors.length === 1 ? <span className="h-4 w-4 shrink-0 rounded-full border border-kawaii-mocha/20 shadow-inner" style={{ backgroundColor: selectedColors[0].hex }} /> : null}
                  <span className="min-w-0 flex-1 truncate">
                    {selectedColors.length === 0
                      ? text.explore.allColors
                      : selectedColors.length === 1
                        ? selectedColors[0].name
                        : `${selectedColors.length} ${text.explore.selected}`}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-kawaii-mocha/50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-64 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                {colors.map((color) => (
                  <DropdownMenuCheckboxItem
                    key={color.id}
                    className="gap-2"
                    checked={filters.colors.includes(color.slug)}
                    onCheckedChange={() => toggleTaxonomy("colors", color.slug, filters.colors)}
                    onSelect={(event) => event.preventDefault()}
                  >
                    <span className="h-4 w-4 shrink-0 rounded-full border border-kawaii-mocha/20 shadow-inner" style={{ backgroundColor: color.hex }} />
                    <span className="truncate">{color.name}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-1.5 text-xs font-bold text-kawaii-mocha/65">
            <span className="ml-2 flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-kawaii-babyblue" />{text.explore.styles}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="flex h-11 w-full items-center gap-2 rounded-2xl border-2 border-input bg-background px-4 text-left text-sm font-bold text-foreground outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/25">
                  <span className="min-w-0 flex-1 truncate">
                    {selectedStyles.length === 0
                      ? text.explore.allStyles
                      : selectedStyles.length === 1
                        ? selectedStyles[0].name
                        : `${selectedStyles.length} ${text.explore.selected}`}
                  </span>
                  <ChevronDown className="h-4 w-4 shrink-0 text-kawaii-mocha/50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-64 w-[var(--radix-dropdown-menu-trigger-width)] overflow-y-auto">
                {styles.map((style) => (
                  <DropdownMenuCheckboxItem
                    key={style.id}
                    checked={filters.styles.includes(style.slug)}
                    onCheckedChange={() => toggleTaxonomy("styles", style.slug, filters.styles)}
                    onSelect={(event) => event.preventDefault()}
                  >
                    <span className="truncate">{style.name}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </section>

      {/* ─── Total Count & Filter Summary ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap text-sm font-bold text-kawaii-mocha/70">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-kawaii-sky/20 border border-kawaii-sky/40 text-kawaii-mocha shadow-sm">
            <Filter className="h-4 w-4 text-kawaii-babyblue" />
            {query.isLoading ? (
              text.common.loading
            ) : totalCount > 0 ? (
              language === "vi" ? (
                <>
                  Hiển thị <span className="font-extrabold text-kawaii-mocha">{startItem} - {endItem}</span> trong tổng số{" "}
                  <span className="font-extrabold text-kawaii-babyblue">{totalCount}</span> bàn phím
                </>
              ) : (
                <>
                  Showing <span className="font-extrabold text-kawaii-mocha">{startItem} - {endItem}</span> of{" "}
                  <span className="font-extrabold text-kawaii-babyblue">{totalCount}</span> keyboards
                </>
              )
            ) : (
              language === "vi" ? "Không có kết quả nào" : "No results found"
            )}
          </span>
        </div>
        {hasActiveFilters ? (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="rounded-2xl text-xs font-bold gap-1 text-kawaii-mocha hover:bg-kawaii-sky/20">
            <X className="h-4 w-4" />
            {text.explore.clear}
          </Button>
        ) : null}
      </div>

      {query.isLoading ? <KeyboardGridSkeleton count={KEYBOARDS_PER_PAGE} /> : null}
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

      {/* ─── Pagination with Page Jump ─── */}
      {query.isSuccess && totalPages > 1 ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-kawaii-sky/30">
          <nav className="flex items-center gap-2" aria-label="Pagination">
            <Button
              type="button"
              variant="outline"
              disabled={filters.page <= 1}
              onClick={() => updateUrl({ page: filters.page - 1 }, false)}
              className="h-10 rounded-2xl border-2 border-kawaii-sky/40 text-xs font-bold text-kawaii-mocha hover:bg-kawaii-sky/20 bouncy-hover"
            >
              {text.common.previous}
            </Button>
            <span className="rounded-2xl bg-kawaii-cloud/70 border border-kawaii-sky/30 px-4 py-2 text-xs font-extrabold text-kawaii-mocha shadow-inner">
              {text.common.page} {filters.page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={filters.page >= totalPages}
              onClick={() => updateUrl({ page: filters.page + 1 }, false)}
              className="h-10 rounded-2xl border-2 border-kawaii-sky/40 text-xs font-bold text-kawaii-mocha hover:bg-kawaii-sky/20 bouncy-hover"
            >
              {text.common.next}
            </Button>
          </nav>

          {/* Direct page jump form */}
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
            <span className="text-xs font-bold text-kawaii-mocha/70">
              {language === "vi" ? "Đến trang:" : "Go to page:"}
            </span>
            <Input
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="h-10 w-20 text-center text-xs font-black rounded-2xl border-2 border-kawaii-sky/40 bg-background"
              aria-label={language === "vi" ? "Nhập số trang" : "Enter page number"}
            />
            <Button
              type="submit"
              size="sm"
              className="h-10 rounded-2xl px-4 text-xs font-bold bg-kawaii-babyblue text-white hover:bg-kawaii-babyblue/90 bouncy-hover"
              disabled={
                !jumpPage ||
                Number(jumpPage) < 1 ||
                Number(jumpPage) > totalPages ||
                Number(jumpPage) === filters.page
              }
            >
              {language === "vi" ? "Đi" : "Go"}
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
