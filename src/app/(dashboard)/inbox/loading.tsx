import { Skeleton } from "@/components/skeleton";

export default function InboxLoading() {
  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-border bg-card">
      {/* Thread list skeleton */}
      <div className="w-80 flex-shrink-0 border-r border-border">
        <div className="border-b border-border px-4 py-3">
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-border/50 px-4 py-3">
              <Skeleton className="mb-2 h-3.5 w-40" />
              <Skeleton className="mb-1.5 h-3 w-20" />
              <Skeleton className="h-3 w-56" />
            </div>
          ))}
        </div>
      </div>
      {/* Message area skeleton */}
      <div className="flex-1 p-6">
        <Skeleton className="mb-4 h-4 w-32" />
        <div className="space-y-4">
          <Skeleton className="h-16 w-3/4" />
          <Skeleton className="ml-auto h-16 w-1/2" />
          <Skeleton className="h-16 w-2/3" />
        </div>
      </div>
    </div>
  );
}
