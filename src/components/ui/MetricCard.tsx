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
    <div className="metric-card">
      <div className="metric-icon">{icon}</div>
      <div style={{ flex: 1 }}>
        <h4>{value}</h4>
        <p>{title}</p>

        {isSlots && progress !== undefined && (
          <div style={{ marginTop: "8px" }}>
            <div
              style={{
                width: "100%",
                height: "8px",
                backgroundColor: "var(--border)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  backgroundColor: isWarning ? "#ef4444" : "#10b981",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <small
              style={{
                marginTop: "4px",
                display: "block",
                color: isWarning ? "#ef4444" : "var(--text-secondary)",
                fontWeight: isWarning ? 600 : 400,
              }}
            >
              {usedSlots}/{maxSlots} slots used
              {isWarning && " ⚠️ Almost full!"}
            </small>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
