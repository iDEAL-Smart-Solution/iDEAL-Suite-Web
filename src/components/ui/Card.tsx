import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface CardProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

const Card = ({ icon, title, description, children, className }: CardProps) => (
  <div
    className={cn(
      "bg-white border border-brand-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200",
      className
    )}
  >
    {icon && (
      <div className="w-10 h-10 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4">
        {icon}
      </div>
    )}
    <h3 className="text-base font-semibold text-slate-900 mb-1">{title}</h3>
    {description && <p className="text-sm text-slate-600 leading-relaxed">{description}</p>}
    {children}
  </div>
);

export default Card;
