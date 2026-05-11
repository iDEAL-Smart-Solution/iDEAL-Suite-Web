import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { isEmailValid } from "../../utils/validators";
import logo from "../../assets/logo.png";

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

            if (user?.role === 4) {
                navigate("/dev/dashboard");
                return;
            }

            if (user?.role === 1 || user?.role === 2 || user?.role === 3) {
                navigate("/dashboard");
                return;
            }

            setError("Your account role is not configured for dashboard access.");
        } catch {
            setError(storeError || "Incorrect email or password");
        }
    };

    const displayError = error || storeError;

    return (
        <div className="min-h-[100svh] bg-gradient-to-br from-surface-950 via-surface-900 to-surface-950 flex items-center justify-center px-4 py-4 sm:py-6 relative overflow-hidden">
            <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

            <div className="w-full max-w-sm rounded-2xl bg-surface-800 border border-surface-700 shadow-2xl shadow-black/20 p-6 sm:p-8 relative z-10">
                <div className="text-center mb-6 sm:mb-7">
                    <div className="mx-auto mb-4 inline-flex items-center justify-center rounded-xl bg-surface-700 border border-surface-600 px-4 py-3 shadow-sm">
                        <img
                            src={logo}
                            alt="Ideal Suite"
                            className="h-10 sm:h-11 w-auto object-contain"
                        />
                    </div>
                    <p className="text-xs sm:text-sm font-semibold tracking-[0.24em] text-brand-300 uppercase">
                        School Management Platform
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                        Sign in to continue to your secure school dashboard.
                    </p>
                </div>

                {displayError && (
                    <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium mb-6">
                        {displayError}
                    </div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="space-y-1.5">
                        <label htmlFor="login-email" className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-brand-300" />
                            Email Address
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@school.com"
                            autoComplete="email"
                            className="w-full h-11 px-3.5 rounded-xl bg-surface-700 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="login-password" className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-brand-300" />
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full h-11 px-3.5 rounded-xl bg-surface-700 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;
