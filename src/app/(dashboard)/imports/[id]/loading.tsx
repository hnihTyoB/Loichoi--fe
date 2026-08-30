import { Skeleton } from "@/components/ui/skeleton";

export default function ImportDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + title */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-xl" />
        <Skeleton className="h-7 w-64 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Images */}
        <div className="space-y-4">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-16 rounded-2xl" />
            ))}
          </div>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2 space-y-5">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-1/3 rounded-2xl" />
            <Skeleton className="h-10 w-1/3 rounded-2xl" />
            <Skeleton className="h-10 w-1/3 rounded-2xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-2xl" />

          {/* Confidence bars */}
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-20 rounded-xl" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-4 w-10 rounded-xl" />
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 flex-1 rounded-2xl" />
            <Skeleton className="h-11 w-24 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
