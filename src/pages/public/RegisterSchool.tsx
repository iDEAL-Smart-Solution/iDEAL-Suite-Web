import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { NIGERIAN_STATES } from "../../constants/states";
import { isEmailValid, isPhoneValid } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";

const RegisterSchool = () => {
  const navigate = useNavigate();
  const { demoRegisterSchool } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    planType: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (form.name.length < 3) newErrors.name = "Minimum 3 characters";
    if (!isEmailValid(form.email)) newErrors.email = "Invalid email";
    if (!isPhoneValid(form.phoneNumber))
      newErrors.phoneNumber = "Use +234XXXXXXXXXX";
    if (form.address.length < 10)
      newErrors.address = "Minimum 10 characters";
    if (!form.state) newErrors.state = "State is required";
    if (![1, 2].includes(form.planType))
      newErrors.planType = "Select a plan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");

      const res = await api.post("/school/register", form);

      alert("School registered successfully!");
      navigate(`/create-admin?schoolId=${res.data.schoolId}`);
    } catch (err: any) {
      if (err.response?.status === 409) {
        setApiError("This email is already registered. Please login.");
      } else {
        setApiError("Registration failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSchoolRegister = () => {
    const { schoolId } = demoRegisterSchool();
    navigate(`/create-admin?schoolId=${schoolId}`);
  };

  return (
    <div className="auth-page">
      <header className="auth-header">
        <Link to="/">← Back to Home</Link>
      </header>

      <div className="auth-card">
        <h2>Register Your School</h2>

        <Input
          label="School Name"
          value={form.name}
          placeholder="Grace Academy"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
        />

        <Input
          label="Email"
          type="email"
          value={form.email}
          placeholder="admin@school.com"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
        />

        <Input
          label="Phone Number"
          value={form.phoneNumber}
          placeholder="+234801234567"
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          error={errors.phoneNumber}
        />

        <Input
          label="Address"
          value={form.address}
          placeholder="123 School Street, Lagos"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          error={errors.address}
        />

        <Select
          label="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          options={NIGERIAN_STATES}
          error={errors.state}
        />

        {/* PLAN TYPE */}
        <div className="plan-group">
          <label>Plan Type</label>
          <div className="plan-options">
            <div
              className={`plan ${form.planType === 1 ? "active" : ""}`}
              onClick={() => setForm({ ...form, planType: 1 })}
            >
              Local
              <small>On-premise deployment</small>
            </div>

            <div
              className={`plan ${form.planType === 2 ? "active" : ""}`}
              onClick={() => setForm({ ...form, planType: 2 })}
            >
              Remote
              <small>Cloud-based deployment</small>
            </div>
          </div>
          {errors.planType && (
            <small className="error">{errors.planType}</small>
          )}
        </div>

        {apiError && <p className="error">{apiError}</p>}

        <Button onClick={handleSubmit}>
          {loading ? "Registering..." : "Register School"}
        </Button>

        <Button variant="secondary" onClick={handleDemoSchoolRegister}>
          Try Demo Registration
        </Button>

        <p className="auth-footer">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterSchool;
