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
    <div className="grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
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
    <div className="grid grid-cols-2 gap-3.5 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4" aria-label="Loading keyboard themes">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-[1.25rem] border-2 border-kawaii-sky/40 bg-card p-0 shadow-cloud sm:rounded-[2rem]">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="space-y-2 p-3 sm:space-y-3 sm:p-5">
            <Skeleton className="h-4 w-14 rounded-full sm:h-5 sm:w-24" />
            <Skeleton className="h-4 w-4/5 rounded-full sm:h-6" />
            <Skeleton className="h-3 w-2/5 rounded-full sm:h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
