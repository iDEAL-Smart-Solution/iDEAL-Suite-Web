import "./skeleton.css";

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
}

const Skeleton = ({
  width = "100%",
  height = "16px",
  borderRadius = "6px",
}: SkeletonProps) => {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;
