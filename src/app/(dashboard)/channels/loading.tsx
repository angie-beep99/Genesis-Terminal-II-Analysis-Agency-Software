import { StatCardsSkeleton, ChartSkeleton, CardSkeleton } from "@/components/skeleton";

export default function ChannelsLoading() {
  return (
    <div className="space-y-6">
      <StatCardsSkeleton />
      <ChartSkeleton />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
