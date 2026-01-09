import Skeleton from "./Skeleton";
import  "./metric-card.css";

const MetricCardSkeleton = () => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <Skeleton width="40px" height="40px" borderRadius="50%" />
        <Skeleton width="60%" height="14px" />
      </div>

      <Skeleton width="40%" height="28px" />
    </div>
  );
};

export default MetricCardSkeleton;
