const MetricCardSkeleton = () => (
  <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-surface-700" />
      <div className="flex-1 space-y-3">
        <div className="h-8 w-20 bg-surface-700 rounded-md" />
        <div className="h-4 w-28 bg-surface-700 rounded-md" />
      </div>
    </div>
  </div>
);

export default MetricCardSkeleton;
