import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { isEmailValid, isPhoneValid } from "../../utils/validators";
import { useAuth } from "../../context/AuthContext";
import { User, Lock, Phone, ArrowRight } from "lucide-react";

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
      navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-800 rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create Admin Account</h2>
          <p className="text-slate-400 mb-8">
            This account will manage your school on iDEAL-Suite.
          </p>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.firstName ? "border-red-500" : "border-slate-600"
                }`}
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.lastName ? "border-red-500" : "border-slate-600"
                }`}
                value={form.lastName}
                onChange={(e) =>
                  setForm({ ...form, lastName: e.target.value })
                }
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.email ? "border-red-500" : "border-slate-600"
                }`}
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.password ? "border-red-500" : "border-slate-600"
                }`}
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+234801234567"
                className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.phoneNumber ? "border-red-500" : "border-slate-600"
                }`}
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
              {errors.phoneNumber && (
                <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {apiError && (
              <p className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
                {apiError}
              </p>
            )}

            {/* Create Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
            >
              {loading ? "Creating Account..." : <>Create Admin Account <ArrowRight size={20} /></>}
            </button>

            {/* Demo Button */}
            <button
              onClick={handleDemoCreateAdmin}
              className="w-full bg-slate-700 border border-slate-600 text-slate-50 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-colors"
            >
              Try Demo Admin Setup
            </button>

            {/* Footer */}
            <p className="text-center text-slate-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 font-semibold hover:text-blue-300">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
