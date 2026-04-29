import logo from "../../assets/logo.png";
import { cn } from "../../lib/utils";

type BrandLoaderSize = "sm" | "md" | "lg";

interface BrandLoaderProps {
  size?: BrandLoaderSize;
  className?: string;
}

const sizeClasses: Record<BrandLoaderSize, { wrapper: string; logo: string; ring: string }> = {
  sm: {
    wrapper: "w-10 h-10",
    logo: "w-5 h-5",
    ring: "border-[3px]",
  },
  md: {
    wrapper: "w-14 h-14",
    logo: "w-7 h-7",
    ring: "border-4",
  },
  lg: {
    wrapper: "w-20 h-20",
    logo: "w-10 h-10",
    ring: "border-[5px]",
  },
};

const BrandLoader = ({ size = "md", className }: BrandLoaderProps) => {
  const selectedSize = sizeClasses[size];

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", selectedSize.wrapper, className)}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="absolute inset-0 rounded-full border border-brand-500/20" />
      <div
        className={cn(
          "absolute inset-0 rounded-full border-surface-700/80 border-t-brand-500 animate-spin",
          selectedSize.ring
        )}
      />

      <div className="w-[66%] h-[66%] rounded-full bg-white flex items-center justify-center shadow-sm">
        <img src={logo} alt="iDEAL logo" className={cn("object-contain", selectedSize.logo)} />
      </div>
    </div>
  );
};

export default BrandLoader;