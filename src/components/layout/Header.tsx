import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-gradient" aria-label="iDEAL-Suite home">
          iDEAL-Suite
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3" aria-label="Public navigation">
          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-surface-600 text-slate-200 hover:bg-surface-800 transition-colors duration-200 text-sm font-medium"
          >
            Login
          </Link>

          <Link
            to="/register-school"
            className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-colors duration-200 text-sm font-medium"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
