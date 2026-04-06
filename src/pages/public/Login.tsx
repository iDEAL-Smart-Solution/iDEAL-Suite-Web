import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100/60 flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full bg-brand-300/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-24 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl" />

            <div className="w-full max-w-md rounded-2xl bg-white border border-brand-100 shadow-2xl shadow-brand-500/10 p-8 sm:p-10 relative z-10">
                <div className="text-center mb-8">
                    <p className="text-xs sm:text-sm font-semibold tracking-[0.2em] text-brand-600 uppercase">iDEAL-Suite</p>
                    <h1 className="text-3xl sm:text-[2rem] font-black text-slate-900 mt-2">Welcome Back</h1>
                    <p className="text-sm text-slate-600 mt-2">Sign in to continue to your school dashboard</p>
                </div>

                {displayError && (
                    <div role="alert" className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium mb-6">
                        {displayError}
                    </div>
                )}

                <form
                    className="space-y-5"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <div className="space-y-1.5">
                        <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-brand-600" />
                            Email Address
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@school.com"
                            autoComplete="email"
                            className="w-full h-11 px-3.5 rounded-xl bg-white border border-brand-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="login-password" className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-brand-600" />
                            Password
                        </label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="w-full h-11 px-3.5 rounded-xl bg-white border border-brand-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default Login;
