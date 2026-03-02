import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, Mail, Phone, MapPin, Radio, CheckCircle } from "lucide-react";
import { useSchoolStore } from "../../stores/useSchoolStore";
import { isEmailValid, isPhoneValid } from "../../utils/validators";
import { cn } from "../../lib/utils";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara",
  "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau",
  "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

const SchoolRegistration = () => {
  const navigate = useNavigate();
  const { registerSchool } = useSchoolStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    planType: null as number | null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};

    if (form.name.length < 3) e.name = "School name must be at least 3 characters";
    if (!isEmailValid(form.email)) e.email = "Invalid email format";
    if (!isPhoneValid(form.phoneNumber)) e.phoneNumber = "Use format: +234XXXXXXXXXX";
    if (form.address.length < 10) e.address = "Address must be at least 10 characters";
    if (!form.state) e.state = "Please select a state";
    if (form.planType === null) e.planType = "Please select a plan type";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handlePlanTypeChange = (value: number) => {
    setForm(prev => ({ ...prev, planType: value }));
    if (errors.planType) {
      setErrors(prev => ({ ...prev, planType: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setApiError("");

      const schoolId = await registerSchool({
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        address: form.address,
        state: form.state,
        planType: form.planType!,
      });

      setSuccess(true);

      setTimeout(() => {
        navigate(`/create-admin?schoolId=${schoolId}`);
      }, 1500);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message;
      if (error.response?.status === 409) {
        setApiError("This email is already registered. Please login.");
      } else {
        setApiError(message || "Failed to register school. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />

        <div className="w-full max-w-md bg-surface-800 border border-surface-700 rounded-xl shadow-2xl p-12 text-center relative z-10">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="w-16 h-16 text-brand-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-50 mb-2">School Registered!</h2>
          <p className="text-slate-400 mb-6">Redirecting to admin account creation...</p>
          <div className="w-full h-1 bg-brand-500 rounded-full overflow-hidden">
            <div className="h-full bg-brand-500 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-brand-500/10 via-transparent to-transparent rounded-full blur-3xl" />

      {/* Header with navigation */}
      <div className="w-full max-w-md mb-8 relative z-10">
        <Link to="/" className="text-3xl font-black text-gradient inline-block mb-2">
          iDEAL-Suite
        </Link>
        <p className="text-slate-400 text-sm">
          <Link to="/" className="text-brand-400 hover:text-brand-300 font-semibold">← Back to Home</Link>
        </p>
      </div>

      {/* Registration Card */}
      <div className="w-full max-w-2xl bg-surface-800 border border-surface-700 rounded-xl shadow-2xl p-8 relative z-10">
        <h2 className="text-3xl font-black mb-2 text-slate-50">Register Your School</h2>
        <p className="text-slate-400 mb-8">Join iDEAL-Suite and streamline your school operations</p>

        {apiError && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium mb-8">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Name */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4" />
              School Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Grace Academy"
              value={form.name}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
            />
            {errors.name && <span className="text-xs font-medium text-red-400 mt-1">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@school.com"
              value={form.email}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
            />
            {errors.email && <span className="text-xs font-medium text-red-400 mt-1">{errors.email}</span>}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="+234801234567"
              value={form.phoneNumber}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
            />
            {errors.phoneNumber && <span className="text-xs font-medium text-red-400 mt-1">{errors.phoneNumber}</span>}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4" />
              Address
            </label>
            <textarea
              name="address"
              placeholder="123 School Street, Lagos"
              value={form.address}
              onChange={handleInputChange}
              className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 resize-none min-h-24"
            />
            {errors.address && <span className="text-xs font-medium text-red-400 mt-1">{errors.address}</span>}
          </div>

          {/* State Selection */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 mb-2">State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleInputChange}
              className="w-full h-10 px-3 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 appearance-none"
            >
              <option value="">Select a State</option>
              {NIGERIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <span className="text-xs font-medium text-red-400 mt-1">{errors.state}</span>}
          </div>

          {/* Plan Type Selection */}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
              <Radio className="w-4 h-4" />
              Deployment Plan
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handlePlanTypeChange(1)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-300",
                  form.planType === 1
                    ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20"
                    : "border-surface-600 bg-surface-700/50 hover:border-brand-500/50"
                )}
              >
                <div className="font-semibold text-slate-50">Local</div>
                <div className="text-xs text-slate-300 mt-1">On-premise</div>
              </button>
              <button
                type="button"
                onClick={() => handlePlanTypeChange(2)}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-300",
                  form.planType === 2
                    ? "border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20"
                    : "border-surface-600 bg-surface-700/50 hover:border-brand-500/50"
                )}
              >
                <div className="font-semibold text-slate-50">Remote</div>
                <div className="text-xs text-slate-300 mt-1">Cloud-based</div>
              </button>
            </div>
            {errors.planType && <span className="text-xs font-medium text-red-400 mt-1">{errors.planType}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? "Registering..." : "Register School"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-surface-700 text-center text-sm text-slate-400">
          <p>
            Already registered?{" "}
            <Link
              to="/login"
              className="text-brand-400 font-semibold hover:text-brand-300 transition-colors"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchoolRegistration;
