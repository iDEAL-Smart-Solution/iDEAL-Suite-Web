import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  style?: React.CSSProperties;
}

const Skeleton = ({ className, width = "100%", height = "16px", borderRadius = "8px", style }: SkeletonProps) => (
  <div
    className={cn("bg-surface-700 animate-pulse rounded-lg", className)}
    style={{ width, height, borderRadius, ...style }}
  />
);

export default Skeleton;
