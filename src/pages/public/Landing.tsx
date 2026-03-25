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
    <div className="min-h-screen bg-surface-950 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-brand-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-black text-gradient">
            iDEAL-Suite
          </div>
          <nav className="flex gap-3 items-center">
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 rounded-lg border-2 border-brand-300 text-brand-700 font-semibold hover:bg-brand-50 transition-all duration-300 hover:-translate-y-0.5"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register-school")}
              className="px-6 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20 bg-gradient-to-b from-white via-brand-50/50 to-white relative overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute top-10 right-0 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Empowering Schools with{" "}
            <span className="text-gradient">
              Smart Management
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Comprehensive school management, subscription tracking, and product monitoring in one powerful platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/register-school")}
              className="px-8 py-4 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Register Your School
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 rounded-lg border-2 border-brand-300 text-brand-700 font-semibold hover:bg-brand-50 transition-all duration-300 hover:-translate-y-1"
            >
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-brand-50/40 border-t border-brand-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
              Why Choose iDEAL-Suite?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage your school efficiently in one platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-brand-100 rounded-xl p-8 hover:-translate-y-2 transition-all duration-300 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10"
              >
                <div className="w-14 h-14 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-slate-600 text-sm">
          <p>&copy; 2025 iDEAL-Suite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
