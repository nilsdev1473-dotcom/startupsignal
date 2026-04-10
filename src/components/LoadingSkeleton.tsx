"use client";

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white/[0.06]", className)}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      {/* Content lines */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      {/* Footer row */}
      <div className="flex items-center gap-2 mt-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="bg-[#111113] border border-white/[0.08] rounded-xl p-6">
      {/* Chart title */}
      <Skeleton className="h-5 w-40 mb-4" />
      {/* Chart area placeholder */}
      <div className="h-[250px] w-full animate-pulse rounded-lg bg-white/[0.04] flex items-end justify-around px-4 pb-4 gap-2">
        {[65, 40, 75, 55, 85, 45, 70, 50, 90, 60].map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-white/[0.08]"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      {/* X-axis labels */}
      <div className="flex justify-between mt-3 px-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-10" />
        ))}
      </div>
    </div>
  );
}
