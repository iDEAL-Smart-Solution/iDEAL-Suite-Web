import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  UserCircle,
  X,
  Wallet,
  MessageSquare,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/useAuthStore";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
    isActive
      ? "bg-brand-500/20 text-brand-300 border-l-[3px] border-brand-500"
      : "text-slate-300 hover:text-white hover:bg-surface-800"
  );

const Sidebar = ({
  isOpen = false,
  isCollapsed = false,
  onClose,
}: {
  isOpen?: boolean;
  isCollapsed?: boolean;
  onClose?: () => void;
}) => {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const initial = user?.fullName?.charAt(0)?.toUpperCase() ?? user?.email?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-surface-950 border-r border-surface-800 shadow-sm flex flex-col z-40 transition-all duration-300",
        "w-64 md:translate-x-0",
        isCollapsed ? "md:w-20" : "md:w-64",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
      aria-label="Main navigation"
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center p-5 border-b border-surface-800">
        {!isCollapsed && (
          <img
            src={logo}
            alt="App logo"
            className="h-9 w-auto max-w-[150px] object-contain"
          />
        )}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors duration-200"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-5 flex flex-col gap-1 overflow-y-auto" aria-label="Sidebar navigation">
        <NavLink to="/dashboard" end className={navLinkClasses} aria-label="Dashboard">
          <LayoutDashboard size={18} />
          {!isCollapsed && "Dashboard"}
        </NavLink>

        {(user?.role === 1 || user?.role === 2) && (
          <NavLink to="/users" className={navLinkClasses} aria-label="Users">
            <Users size={18} />
            {!isCollapsed && "Users"}
          </NavLink>
        )}

        {user?.role === 1 && (
          <>
            <NavLink to="/subscriptions" className={navLinkClasses} aria-label="Subscriptions">
              <CreditCard size={18} />
              {!isCollapsed && "Subscriptions"}
            </NavLink>

            <NavLink to="/payments" className={navLinkClasses} aria-label="Payments">
              <Wallet size={18} />
              {!isCollapsed && "Payments"}
            </NavLink>

            <NavLink to="/products" className={navLinkClasses} aria-label="Products">
              <Package size={18} />
              {!isCollapsed && "Products"}
            </NavLink>
          </>
        )}

        {(user?.role === 1 || user?.role === 2) && (
          <NavLink to="/feedback" className={navLinkClasses} aria-label="Feedback">
            <MessageSquare size={18} />
            {!isCollapsed && "Feedback"}
          </NavLink>
        )}

        <NavLink to="/profile" className={navLinkClasses} aria-label="Profile">
          <UserCircle size={18} />
          {!isCollapsed && "Profile"}
        </NavLink>
      </nav>

      {/* User section */}
      <div className="p-5 border-t border-surface-800">
        {!isCollapsed ? (
          <div className="mb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-sm font-semibold shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-slate-200 font-medium text-sm truncate">
                {user?.fullName || user?.email || "Signed in user"}
              </p>
              <span className="inline-block mt-0.5 text-[11px] font-medium text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-md">
                Signed in
              </span>
            </div>
          </div>
        ) : null}
        <button
          onClick={logout}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-200 text-sm font-medium",
            isCollapsed && "justify-center px-3"
          )}
          aria-label="Logout"
        >
          <LogOut size={18} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;