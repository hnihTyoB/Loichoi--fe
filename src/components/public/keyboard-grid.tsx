import { KeyboardCard } from "@/components/public/keyboard-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { KeyboardCardData } from "@/types/keyboard.types";

export function KeyboardGrid({
  keyboards,
  locale = "vi",
  priorityCount = 0,
}: {
  keyboards: KeyboardCardData[];
  locale?: "vi" | "en";
  priorityCount?: number;
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {keyboards.map((keyboard, index) => (
        <KeyboardCard
          key={keyboard.id}
          keyboard={keyboard}
          locale={locale}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}

export function KeyboardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading keyboard themes">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[2rem] border-2 border-kawaii-sky/40 bg-card p-0 shadow-cloud">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-3 p-5">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-6 w-4/5 rounded-full" />
            <Skeleton className="h-4 w-2/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
