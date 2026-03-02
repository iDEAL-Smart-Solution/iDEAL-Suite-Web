import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  progress?: number; // 0-100 for slots used
  maxSlots?: number;
  usedSlots?: number;
  className?: string;
}

const MetricCard = ({
  title,
  value,
  icon,
  progress,
  maxSlots,
  usedSlots,
  className,
}: MetricCardProps) => {
  const isSlots = title.includes("Slots");
  const usagePercentage = progress || 0;
  const isWarning = usagePercentage > 90;

  return (
    <div
      className={cn(
        "bg-surface-800 border border-surface-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-3xl font-bold text-white tabular-nums mb-1">{value}</h4>
          <p className="text-sm font-medium text-slate-400">{title}</p>

          {isSlots && progress !== undefined && (
            <div className="mt-4">
              <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-300",
                    isWarning ? "bg-red-500" : "bg-brand-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <small
                className={cn(
                  "text-xs block mt-2",
                  isWarning ? "font-semibold text-red-400" : "font-normal text-slate-400"
                )}
              >
                {usedSlots}/{maxSlots} slots used
                {isWarning && " ⚠️ Almost full!"}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
