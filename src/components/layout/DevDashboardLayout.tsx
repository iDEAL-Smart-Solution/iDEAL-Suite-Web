import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  CreditCard,
  Package,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface DevDashboardLayoutProps {
  children: React.ReactNode;
}

const DevDashboardLayout = ({ children }: DevDashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { label: "Overview", path: "/dev/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Schools Management", path: "/dev/schools", icon: <Building2 size={20} /> },
    { label: "Subscriptions", path: "/dev/subscriptions", icon: <CreditCard size={20} /> },
    { label: "Products", path: "/dev/products", icon: <Package size={20} /> },
    { label: "Settings", path: "/dev/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900 transition-all duration-300 flex flex-col border-r border-slate-800`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-lg font-bold text-white">iDEAL-Suite</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-cyan-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-800">
          {sidebarOpen ? (
            <div className="mb-3">
              <p className="text-white font-medium text-sm">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-slate-400 text-xs">{user?.email}</p>
              <p className="text-cyan-400 text-xs mt-1">Platform Admin</p>
            </div>
          ) : null}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Platform Admin Dashboard</h1>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DevDashboardLayout;
