import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageSectionProps {
  children: ReactNode;
  className?: string;
}

const PageSection = ({ children, className }: PageSectionProps) => {
  return <section className={cn("space-y-4", className)}>{children}</section>;
};

export default PageSection;
