import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-surface-900 border-t border-surface-800 py-6">
      <div className="px-4 flex flex-col items-center gap-2">
        <img
          src={logo}
          alt="iDEAL logo"
          className="h-8 w-auto object-contain opacity-90"
        />
        <p className="text-sm text-slate-500 text-center">
          &copy; 2026 All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
