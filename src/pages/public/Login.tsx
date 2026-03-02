import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { isEmailValid } from "../../utils/validators";

const Login = () => {
    const { login, isLoading, error: storeError } = useAuthStore();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!isEmailValid(email)) {
            setError("Invalid email or password");
            return;
        }

        try {
            setError("");
            await login(email, password);

            // Route based on role
            const raw = sessionStorage.getItem("ideal_user");
            const user = raw ? JSON.parse(raw) : null;

            if (user?.role === 0) {
                navigate("/dev/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch {
            setError(storeError || "Incorrect email or password");
        }
    };

    const displayError = error || storeError;

    return (
        <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />

            {/* Logo and header */}
            <div className="mb-12 text-center relative z-10">
                <div className="text-4xl font-black text-gradient mb-2">
                    iDEAL-Suite
                </div>
                <p className="text-slate-400">School Management Platform</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-surface-800 border border-surface-700 rounded-xl shadow-2xl p-8 relative z-10">
                <h2 className="text-2xl font-black mb-2 text-slate-50">Login to Dashboard</h2>
                <p className="text-slate-400 text-sm mb-8">Access your school management tools</p>

                {displayError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium mb-6">
                        {displayError}
                    </div>
                )}

                <div className="space-y-6 mb-8">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@school.com"
                            className="w-full h-10 px-3 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full h-10 px-3 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        />
                    </div>
                </div>

                {/* Login Button */}
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                    <LogIn className="w-5 h-5" />
                    {isLoading ? "Logging in..." : "Login"}
                </button>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-surface-700 text-center text-sm text-slate-400">
                    <p>
                        Don't have an account?{" "}
                        <Link
                            to="/register-school"
                            className="text-brand-400 font-semibold hover:text-brand-300 transition-colors"
                        >
                            Register School
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
