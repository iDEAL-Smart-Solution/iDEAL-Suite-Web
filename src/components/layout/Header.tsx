import { Link } from "react-router-dom";
import Button from "../ui/Button";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">iDEAL-Suite</div>

      <nav className="header-actions">
        <Link to="/login">
          <Button variant="secondary">Login</Button>
        </Link>

        <Link to="/register-school">
          <Button>Get Started</Button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
