import { Skeleton } from "@/components/ui/skeleton";

export default function ImportsLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-2xl" />
          <Skeleton className="h-4 w-72 rounded-xl" />
        </div>
        <Skeleton className="h-11 w-36 rounded-2xl" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-28 rounded-2xl" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-3xl border border-kawaii-sky/30 overflow-hidden">
        <div className="bg-kawaii-cloud/40 p-4 border-b border-kawaii-sky/20">
          <div className="flex gap-4 items-center">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-16 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-xl" />
            <Skeleton className="h-4 w-24 rounded-xl ml-auto" />
            <Skeleton className="h-4 w-20 rounded-xl" />
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 border-b border-kawaii-sky/10 flex gap-4 items-center">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48 rounded-xl" />
              <Skeleton className="h-3 w-32 rounded-xl" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
