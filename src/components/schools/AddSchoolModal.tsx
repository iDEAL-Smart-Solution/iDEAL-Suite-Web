import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSchoolStore } from "../../stores/useSchoolStore";
import type { RegisterSchoolPayload } from "../../stores/useSchoolStore";
import { NIGERIAN_STATES } from "../../constants/states";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PLAN_OPTIONS = [
  { value: 0, label: "Basic" },
  { value: 1, label: "Standard" },
  { value: 2, label: "Premium" },
];

const inputClass =
  "w-full px-3 py-2 bg-surface-900 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors";
const errorInputClass = "border-red-500";
const normalInputClass = "border-surface-600";

const AddSchoolModal: React.FC<AddSchoolModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { registerSchool, isLoading } = useSchoolStore();

  const [formData, setFormData] = useState<RegisterSchoolPayload>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    planType: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "School name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.state) newErrors.state = "State is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "planType" ? parseInt(value, 10) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await registerSchool(formData);
      onSuccess?.();
      onClose();
      // reset form
      setFormData({ name: "", email: "", phoneNumber: "", address: "", state: "", planType: 0 });
      setErrors({});
      setSubmitError(null);
    } catch {
      setSubmitError(
        useSchoolStore.getState().error || "Failed to register school"
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-800 border border-surface-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-700">
          <h2 className="text-lg font-bold text-white">Add New School</h2>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
              {submitError}
            </div>
          )}

          {/* School Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
              School Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter school name"
              className={cn(inputClass, errors.name ? errorInputClass : normalInputClass)}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Contact Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="school@example.com"
              className={cn(inputClass, errors.email ? errorInputClass : normalInputClass)}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300 mb-1.5">
              Phone Number *
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="08012345678"
              className={cn(inputClass, errors.phoneNumber ? errorInputClass : normalInputClass)}
            />
            {errors.phoneNumber && <p className="text-xs text-red-400 mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-300 mb-1.5">
              Address *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter school address"
              rows={2}
              className={cn(inputClass, "resize-none", errors.address ? errorInputClass : normalInputClass)}
            />
            {errors.address && <p className="text-xs text-red-400 mt-1">{errors.address}</p>}
          </div>

          {/* State */}
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-slate-300 mb-1.5">
              State *
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={cn(inputClass, errors.state ? errorInputClass : normalInputClass)}
            >
              <option value="">Select a state</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && <p className="text-xs text-red-400 mt-1">{errors.state}</p>}
          </div>

          {/* Plan Type */}
          <div>
            <label htmlFor="planType" className="block text-sm font-medium text-slate-300 mb-1.5">
              Subscription Plan
            </label>
            <select
              id="planType"
              name="planType"
              value={formData.planType}
              onChange={handleChange}
              className={cn(inputClass, normalInputClass)}
            >
              {PLAN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-surface-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {isLoading ? "Registering..." : "Add School"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSchoolModal;
