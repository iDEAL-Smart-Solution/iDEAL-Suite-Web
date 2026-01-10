import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-800 border-b border-slate-700 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text">
          iDEAL-Suite
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-lg border border-slate-600 text-slate-50 hover:bg-slate-700/50 transition-colors font-medium"
          >
            Login
          </Link>

          <Link
            to="/register-school"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all font-medium"
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
