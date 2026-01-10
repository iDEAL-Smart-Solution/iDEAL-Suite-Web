import { useAuth } from "../../context/AuthContext";
import { Menu, LogOut } from "lucide-react";

const Topbar = ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-64 right-0 bg-slate-800 border-b border-slate-700 h-16 flex items-center justify-between px-8 z-30 lg:left-64">
      {/* Hamburger Menu */}
      <button
        className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-50"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1 text-center lg:text-left">
        <h3 className="text-lg font-semibold text-slate-50">Dashboard</h3>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-6">
        <span className="text-slate-400 text-sm hidden sm:inline">{user.email}</span>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors font-medium"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
