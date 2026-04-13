import { useAuthStore } from "../../stores/useAuthStore";
import { Menu, LogOut, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { useState } from "react";

const Topbar = ({
  onToggleSidebar,
  isSidebarCollapsed = false,
}: {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}) => {
  const { user, logout } = useAuthStore();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "?";

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

      {/* User Actions */}
      <div className="relative flex items-center gap-3 md:gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <span className="text-slate-600 text-sm truncate max-w-[180px] md:max-w-[240px]">{user?.email}</span>
        </div>
        <button
          type="button"
          className="sm:hidden flex items-center gap-1 text-slate-700"
          onClick={() => setIsProfileOpen((s) => !s)}
          aria-label="Toggle profile menu"
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <ChevronDown size={14} />
        </button>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium"
          aria-label="Logout"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>

        {isProfileOpen && (
          <div className="absolute right-0 top-12 sm:hidden bg-white border border-brand-100 rounded-lg shadow-lg p-3 min-w-[180px]">
            <p className="text-xs text-slate-500 mb-1">Signed in as</p>
            <p className="text-sm text-slate-700 break-words">{user?.email}</p>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
