import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-brand-100 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center" aria-label="App home">
          <img
            src={logo}
            alt="App logo"
            className="h-9 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3" aria-label="Public navigation">
          <Link
            to="/login"
            className="px-4 md:px-5 py-2 rounded-lg border border-brand-200 text-brand-700 hover:bg-brand-50 transition-colors duration-200 text-sm font-medium"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
