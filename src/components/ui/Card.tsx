import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const Card = ({ icon, title, description, children, className }: CardProps) => (
  <div
    className={cn(
      "bg-surface-800 border border-surface-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}
  >
    {icon && (
      <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-300 flex items-center justify-center mb-4">
        {icon}
      </div>
    )}
    {title && <h3 className="text-base font-semibold text-white mb-1">{title}</h3>}
    {description && <p className="text-sm text-slate-400 leading-relaxed">{description}</p>}
    {children}
  </div>
);

export default Card;
