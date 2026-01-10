import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { isEmailValid } from "../../utils/validators";

const Login = () => {
    const { login, demoLogin } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!isEmailValid(email) || password.length < 6) {
            setError("Invalid email or password");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await login(email, password);
            navigate("/dashboard");
        } catch {
            setError("Incorrect email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleDemoLogin = () => {
        demoLogin();
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Decorative gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-cyan-500/10 via-transparent to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-teal-500/10 via-transparent to-transparent rounded-full blur-3xl" />

            {/* Logo and header */}
            <div className="mb-12 text-center relative z-10">
                <div className="text-4xl font-black bg-gradient-to-r from-cyan-400 to-teal-500 bg-clip-text text-transparent mb-2">
                    iDEAL-Suite
                </div>
                <p className="text-slate-400">School Management Platform</p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-black mb-2 text-slate-50">Login to Dashboard</h2>
                <p className="text-slate-400 text-sm mb-8">Access your school management tools</p>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-6 mb-8">
                    {/* Email Input */}
                    <div className="form-group">
                        <label className="form-label flex items-center gap-2 mb-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@school.com"
                            className="input-base"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="form-group">
                        <label className="form-label flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4" />
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="input-base"
                        />
                    </div>
                </div>

                {/* Login Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                    <LogIn className="w-5 h-5" />
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* Demo Login */}
                <button
                    onClick={handleDemoLogin}
                    className="w-full mt-4 px-6 py-3 border-2 border-cyan-500 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                    Try Demo Account
                </button>
                <p className="text-center text-xs text-slate-400 mt-3">
                    No account needed - explore the dashboard instantly
                </p>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-700 text-center text-sm text-slate-400">
                    <p>
                        New admin user?{" "}
                        <Link
                            to="/create-admin"
                            className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
                        >
                            Create Admin Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
