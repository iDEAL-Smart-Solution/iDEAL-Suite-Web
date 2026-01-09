import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
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
        <div className="auth-page">
            <div className="auth-card">
                <h2>Login to Dashboard</h2>

                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="error">{error}</p>}

                <Button onClick={handleSubmit}>
                    {loading ? "Logging in..." : "Login"}
                </Button>


                <Button
                    variant="secondary"
                    onClick={handleDemoLogin}
                >
                    Login with Demo Account
                </Button>
                <p className="demo-hint">
                    No account yet? Try the demo dashboard.
                </p>


                <p className="auth-footer">
                    New school? <Link to="/register-school">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
