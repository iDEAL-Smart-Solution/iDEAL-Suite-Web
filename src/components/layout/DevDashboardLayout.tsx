import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
  Wallet,
} from "lucide-react";

interface DevDashboardLayoutProps {
  children: React.ReactNode;
}

const DevDashboardLayout = ({ children }: DevDashboardLayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: "Overview", path: "/dev/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Schools Management", path: "/dev/schools", icon: <Building2 size={18} /> },
    { label: "Subscriptions", path: "/dev/subscriptions", icon: <CreditCard size={18} /> },
    { label: "Payments", path: "/dev/payments", icon: <Wallet size={18} /> },
    { label: "Products", path: "/dev/products", icon: <Package size={18} /> },
    { label: "Settings", path: "/dev/settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div className="flex h-screen bg-surface-950">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-surface-900 transition-all duration-300 flex flex-col border-r border-surface-700",
          sidebarOpen ? "w-64" : "w-20"
        )}
        aria-label="Platform navigation"
      >
        {/* Header */}
        <div className="p-5 border-b border-surface-700 flex items-center justify-between">
          {sidebarOpen && (
            <span className="text-xl font-bold text-gradient">iDEAL-Suite</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-5 flex flex-col gap-1 overflow-y-auto" aria-label="Platform navigation">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                isActive(item.path)
                  ? "bg-brand-500/10 text-brand-400 border-l-[3px] border-brand-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-surface-800"
              )}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-5 border-t border-surface-700">
          {sidebarOpen ? (
            <div className="mb-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-500/15 text-brand-400 flex items-center justify-center text-sm font-semibold shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-slate-200 font-medium text-sm truncate">
                  {user?.fullName}
                </p>
                <span className="inline-block mt-0.5 text-[11px] font-medium text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-md">
                  Platform Admin
                </span>
              </div>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium"
            aria-label="Logout"
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-surface-900 border-b border-surface-700/50 px-6 h-16 flex items-center">
          <h1 className="text-lg font-semibold text-slate-100">Platform Admin Dashboard</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-surface-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DevDashboardLayout;
