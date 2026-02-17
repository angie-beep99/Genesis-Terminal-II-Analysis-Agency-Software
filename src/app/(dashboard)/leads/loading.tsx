import { TableSkeleton, Skeleton } from "@/components/skeleton";

export default function LeadsLoading() {
  return (
    <div className="space-y-4">
      {/* Filters skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-32" />
      </div>
      <TableSkeleton rows={8} cols={7} />
    </div>
  );
}
