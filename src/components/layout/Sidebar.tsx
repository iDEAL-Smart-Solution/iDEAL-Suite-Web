import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Package,
  UserCircle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({
  isOpen = false,
  onClose,
}: {
  isOpen?: boolean;
  onClose?: () => void;
}) => {
  const { user } = useAuth();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-64 bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 z-40 ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Sidebar Header */}
      <div className="flex justify-between items-center p-6 border-b border-slate-700">
        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text">
          iDEAL-Suite
        </div>
        <button
          className="lg:hidden text-slate-400 hover:text-slate-50 transition-colors"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/50"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        {(user.role === 1 || user.role === 2) && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                isActive
                  ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                  : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/50"
              }`
            }
          >
            <Users size={18} />
            Users
          </NavLink>
        )}

        {user.role === 1 && (
          <>
            <NavLink
              to="/subscriptions"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                    : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/50"
                }`
              }
            >
              <CreditCard size={18} />
              Subscriptions
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                  isActive
                    ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                    : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/50"
                }`
              }
            >
              <Package size={18} />
              Products
            </NavLink>
          </>
        )}

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? "bg-blue-500/20 border border-blue-500/30 text-blue-400"
                : "text-slate-400 hover:text-slate-50 hover:bg-slate-700/50"
            }`
          }
        >
          <UserCircle size={18} />
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
