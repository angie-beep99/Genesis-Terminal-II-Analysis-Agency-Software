/**
 * Skeleton loader component with shimmer animation.
 * Matches card dimensions to prevent layout shift.
 */
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-shimmer rounded-xl ${className}`}
      aria-hidden="true"
    />
  );
}

/** 4-card stat skeleton matching overview cards */
export function StatCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-5"
        >
          <Skeleton className="mb-3 h-3 w-24" />
          <Skeleton className="h-7 w-32" />
        </div>
      ))}
    </div>
  );
}

/** Table skeleton */
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex gap-4 border-b border-border px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div
          key={r}
          className="flex gap-4 border-b border-border/50 px-4 py-3 last:border-0"
        >
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Chart area skeleton */
export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Skeleton className="mb-4 h-4 w-32" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

/** Single card skeleton */
export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <Skeleton className="mb-3 h-4 w-40" />
      <Skeleton className="mb-2 h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}
