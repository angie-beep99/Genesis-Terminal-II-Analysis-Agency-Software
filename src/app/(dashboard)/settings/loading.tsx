import { Skeleton, CardSkeleton } from "@/components/skeleton";

export default function SettingsLoading() {
  return (
    <div className="space-y-6">
      {/* Tab navigation skeleton */}
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24" />
        ))}
      </div>
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}
