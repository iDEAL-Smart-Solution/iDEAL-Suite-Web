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
  MessageSquare,
  Users,
} from "lucide-react";
import logo from "../../assets/logo.png";
import Container from "./Container";

interface DevDashboardLayoutProps {
  children: React.ReactNode;
}

const DevDashboardLayout = ({ children }: DevDashboardLayoutProps) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isTabletSidebarCollapsed, setIsTabletSidebarCollapsed] = useState(false);

  const menuItems = [
    { label: "Overview", path: "/dev/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Schools Management", path: "/dev/schools", icon: <Building2 size={18} /> },
    { label: "Subscriptions", path: "/dev/subscriptions", icon: <CreditCard size={18} /> },
    { label: "Payments", path: "/dev/payments", icon: <Wallet size={18} /> },
    { label: "Products", path: "/dev/products", icon: <Package size={18} /> },
    { label: "Students", path: "/dev/students", icon: <Users size={18} /> },
    { label: "Feedback", path: "/dev/feedback", icon: <MessageSquare size={18} /> },
    { label: "Settings", path: "/dev/settings", icon: <Settings size={18} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? "?";

  const handleToggleSidebar = () => {
    if (window.innerWidth < 768) {
      setMobileSidebarOpen((s) => !s);
      return;
    }
    if (window.innerWidth < 1024) {
      setIsTabletSidebarCollapsed((s) => !s);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-950 overflow-x-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-white transition-all duration-300 flex flex-col border-r border-brand-100 shadow-sm z-40",
          "w-64 md:translate-x-0",
          isTabletSidebarCollapsed ? "md:w-20" : "md:w-64",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
        aria-label="Platform navigation"
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-100 flex items-center justify-between">
          {!isTabletSidebarCollapsed && (
            <img
              src={logo}
              alt="iDEAL logo"
              className="h-9 w-auto max-w-[150px] object-contain"
            />
          )}
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-brand-700 hover:bg-brand-50 transition-colors duration-200"
            aria-label="Toggle sidebar"
          >
            {mobileSidebarOpen || !isTabletSidebarCollapsed ? <X size={22} /> : <Menu size={22} />}
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
                  ? "bg-brand-100 text-brand-700 border-l-[3px] border-brand-500"
                  : "text-slate-700 hover:text-brand-700 hover:bg-brand-50"
              )}
            >
              {item.icon}
              {!isTabletSidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-5 border-t border-brand-100">
          {!isTabletSidebarCollapsed ? (
            <div className="mb-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-semibold shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                <p className="text-slate-700 font-medium text-sm truncate">
                  {user?.fullName}
                </p>
                <span className="inline-block mt-0.5 text-[11px] font-medium text-brand-700 bg-brand-100 px-2 py-0.5 rounded-md">
                  Platform Admin
                </span>
              </div>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium"
            aria-label="Logout"
          >
            <LogOut size={18} />
            {!isTabletSidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300",
          isTabletSidebarCollapsed ? "md:pl-20" : "md:pl-64",
          "lg:pl-64"
        )}
      >
        {/* Top Bar */}
        <header className="bg-white border-b border-brand-100 px-4 md:px-6 h-16 flex items-center gap-3 shadow-sm">
          <button
            type="button"
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-slate-600 hover:text-brand-700 hover:bg-brand-50"
            onClick={handleToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base md:text-lg font-semibold text-slate-800">Platform Admin Dashboard</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-surface-950">
          <Container className="p-4 md:p-6">
            {children}
          </Container>
        </main>
      </div>
    </div>
  );
};

export default DevDashboardLayout;
