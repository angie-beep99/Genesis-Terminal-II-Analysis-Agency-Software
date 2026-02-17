import { StatCardsSkeleton, ChartSkeleton, TableSkeleton, CardSkeleton } from "@/components/skeleton";

export default function OverviewLoading() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton />
      <ChartSkeleton />
      <div className="grid gap-6 lg:grid-cols-2">
        <TableSkeleton rows={5} cols={4} />
        <CardSkeleton />
      </div>
    </div>
  );
}
