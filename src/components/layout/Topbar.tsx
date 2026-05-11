import { Menu } from "lucide-react";
import { cn } from "../../lib/utils";

const Topbar = ({
  onToggleSidebar,
  isSidebarCollapsed = false,
  dashboardLabel,
}: {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  dashboardLabel?: string;
}) => {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 bg-surface-950/90 backdrop-blur-md border-b border-surface-800 h-16 flex items-center justify-between px-4 md:px-6 z-30 shadow-sm transition-all duration-300",
        isSidebarCollapsed ? "md:left-20" : "md:left-64",
        "left-0 lg:left-64"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger Menu */}
        <button
          className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-800 transition-colors duration-200 text-slate-300 hover:text-white"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {dashboardLabel && (
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">
            <span className="h-2 w-2 rounded-full bg-brand-400" />
            <span>{dashboardLabel}</span>
          </div>
        )}
      </div>

      <div className="flex-1" />
    </header>
  );
};

export default Topbar;
