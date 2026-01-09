import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { Menu } from "lucide-react";

const Topbar = ({ onToggleSidebar }: { onToggleSidebar?: () => void }) => {
  const { user, logout } = useAuth();

  return (
    <header className="topbar">
      <button
        className="hamburger"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu />
      </button>

      <h3>Dashboard</h3>

      <div className="topbar-actions">
        <span>{user.email}</span>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
