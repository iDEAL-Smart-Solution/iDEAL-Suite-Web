import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { isEmailValid, isPhoneValid } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";

const CreateAdmin = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { demoCreateAdmin } = useAuth();

  const schoolId = params.get("schoolId");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (!schoolId) {
      navigate("/register-school");
    }
  }, [schoolId, navigate]);

  const validate = () => {
    const e: Record<string, string> = {};

    if (form.firstName.length < 2) e.firstName = "Minimum 2 characters";
    if (form.lastName.length < 2) e.lastName = "Minimum 2 characters";
    if (!isEmailValid(form.email)) e.email = "Invalid email";
    if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!isPhoneValid(form.phoneNumber))
      e.phoneNumber = "Use +234XXXXXXXXXX";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !schoolId) return;

    try {
      setLoading(true);
      setApiError("");

      await api.post("/user/register", {
        ...form,
        schoolId,
        role: 1, // SuperAdmin
      });

      alert("Admin account created successfully!");
      navigate("/login");
    } catch (err: any) {
      setApiError(
        err.response?.data?.message || "Account creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCreateAdmin = () => {
    if (schoolId) {
      demoCreateAdmin(schoolId);
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Admin Account</h2>
        <p className="muted">
          This account will manage your school on iDEAL-Suite.
        </p>

        <Input
          label="First Name"
          value={form.firstName}
          onChange={(e) =>
            setForm({ ...form, firstName: e.target.value })
          }
          error={errors.firstName}
        />

        <Input
          label="Last Name"
          value={form.lastName}
          onChange={(e) =>
            setForm({ ...form, lastName: e.target.value })
          }
          error={errors.lastName}
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          error={errors.email}
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          error={errors.password}
        />

        <Input
          label="Phone Number"
          value={form.phoneNumber}
          placeholder="+234801234567"
          onChange={(e) =>
            setForm({ ...form, phoneNumber: e.target.value })
          }
          error={errors.phoneNumber}
        />

        {apiError && <p className="error">{apiError}</p>}

        <Button onClick={handleSubmit}>
          {loading ? "Creating Account..." : "Create Admin Account"}
        </Button>

        <Button variant="secondary" onClick={handleDemoCreateAdmin}>
          Try Demo Admin Setup
        </Button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAdmin;
