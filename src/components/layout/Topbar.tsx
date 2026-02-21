import { useAuthStore } from "../../stores/useAuthStore";
import { Menu, LogOut } from "lucide-react";

const Topbar = ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => {
  const { user, logout } = useAuthStore();

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 bg-surface-900/80 backdrop-blur-md border-b border-surface-700/50 h-16 flex items-center justify-between px-6 z-30">
      {/* Hamburger Menu */}
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-800 transition-colors duration-200 text-slate-400 hover:text-slate-200"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-500/15 text-brand-400 flex items-center justify-center text-sm font-semibold">
            {initial}
          </div>
          <span className="text-slate-400 text-sm">{user?.email}</span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium"
          aria-label="Logout"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
