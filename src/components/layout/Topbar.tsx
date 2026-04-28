import { Menu } from "lucide-react";
import { cn } from "../../lib/utils";

const Topbar = ({
  onToggleSidebar,
  isSidebarCollapsed = false,
}: {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}) => {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 bg-white/90 backdrop-blur-md border-b border-brand-100 h-16 flex items-center justify-between px-4 md:px-6 z-30 shadow-sm transition-all duration-300",
        isSidebarCollapsed ? "md:left-20" : "md:left-64",
        "left-0 lg:left-64"
      )}
    >
      {/* Hamburger Menu */}
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-brand-50 transition-colors duration-200 text-slate-600 hover:text-brand-700"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />
    </header>
  );
};

export default Topbar;
