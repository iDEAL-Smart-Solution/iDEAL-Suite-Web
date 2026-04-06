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
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuthStore } from "../../stores/useAuthStore";

const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
    isActive
      ? "bg-brand-100 text-brand-700 border-l-[3px] border-brand-500"
      : "text-slate-700 hover:text-brand-700 hover:bg-brand-50"
  );

const Sidebar = ({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const user = useAuthStore((s) => s.user);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-white border-r border-brand-100 shadow-sm flex flex-col transition-transform duration-300 z-40",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      aria-label="Main navigation"
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center p-5 border-b border-brand-100">
        <span className="text-xl font-bold text-gradient">iDEAL-Suite</span>
        <button
          className="lg:hidden text-slate-500 hover:text-brand-700 transition-colors duration-200"
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
          Dashboard
        </NavLink>

        {(user?.role === 1 || user?.role === 2) && (
          <NavLink to="/users" className={navLinkClasses} aria-label="Users">
            <Users size={18} />
            Users
          </NavLink>
        )}

        {user?.role === 1 && (
          <>
            <NavLink to="/subscriptions" className={navLinkClasses} aria-label="Subscriptions">
              <CreditCard size={18} />
              Subscriptions
            </NavLink>

            <NavLink to="/payments" className={navLinkClasses} aria-label="Payments">
              <Wallet size={18} />
              Payments
            </NavLink>

            <NavLink to="/products" className={navLinkClasses} aria-label="Products">
              <Package size={18} />
              Products
            </NavLink>
          </>
        )}

        {(user?.role === 1 || user?.role === 2) && (
          <NavLink to="/feedback" className={navLinkClasses} aria-label="Feedback">
            <MessageSquare size={18} />
            Feedback
          </NavLink>
        )}

        <NavLink to="/profile" className={navLinkClasses} aria-label="Profile">
          <UserCircle size={18} />
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;