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
    <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-hidden={!isOpen}>
      <div className="sidebar-top">
        <div className="sidebar-logo">iDEAL-Suite</div>
        <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
          <X />
        </button>
      </div>

      <nav>
        <NavLink to="/dashboard" end>
          <LayoutDashboard size={18} /> Dashboard
        </NavLink>

        {(user.role === 1 || user.role === 2) && (
          <NavLink to="/users">
            <Users size={18} /> Users
          </NavLink>
        )}

        {user.role === 1 && (
          <>
            <NavLink to="/subscriptions">
              <CreditCard size={18} /> Subscriptions
            </NavLink>

            <NavLink to="/products">
              <Package size={18} /> Products
            </NavLink>
          </>
        )}

        <NavLink to="/profile">
          <UserCircle size={18} /> Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
