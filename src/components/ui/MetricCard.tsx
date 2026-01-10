import type { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  progress?: number; // 0-100 for slots used
  maxSlots?: number;
  usedSlots?: number;
}

const MetricCard = ({
  title,
  value,
  icon,
  progress,
  maxSlots,
  usedSlots,
}: MetricCardProps) => {
  const isSlots = title.includes("Slots");
  const usagePercentage = progress || 0;
  const isWarning = usagePercentage > 90;

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="text-blue-400 mt-1">{icon}</div>
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-slate-50 mb-1">{value}</h4>
          <p className="text-sm text-slate-400 mb-3">{title}</p>

          {isSlots && progress !== undefined && (
            <div className="mt-4">
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isWarning ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <small
                className={`text-xs block mt-2 ${
                  isWarning ? "font-semibold text-red-400" : "font-normal text-slate-400"
                }`}
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
