import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Users, TrendingUp, BarChart3 } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "School Management",
      description: "Manage your entire school system from one unified platform",
    },
    {
      icon: <Users className="w-10 h-10" />,
      title: "User Management",
      description: "Effortlessly manage students, staff, and admin accounts",
    },
    {
      icon: <TrendingUp className="w-10 h-10" />,
      title: "Subscription Tracking",
      description: "Monitor subscriptions, slots, and expiry dates in real-time",
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: "Analytics Dashboard",
      description: "Real-time insights and actionable performance metrics",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 backdrop-blur-md bg-opacity-90">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent">
            iDEAL-Suite
          </div>
          <nav className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 rounded-lg border-2 border-cyan-500 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register-school")}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute top-10 right-0 w-96 h-96 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-radial from-teal-500/10 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Empowering Schools with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Smart Management
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Comprehensive school management, subscription tracking, and product monitoring in one powerful platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register-school")}
              className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Register Your School
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-lg border-2 border-cyan-500 text-cyan-400 font-semibold hover:bg-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-slate-800/50 border-t border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Why Choose iDEAL-Suite?
            </h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Everything you need to manage your school efficiently in one platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 border border-slate-700 rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-50">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-400 text-sm">
          <p>&copy; 2025 iDEAL-Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
