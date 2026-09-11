import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useSchoolStore } from "../../stores/useSchoolStore";
import type { School, UpdateSchoolPayload } from "../../stores/useSchoolStore";
import { NIGERIAN_STATES } from "../../constants/states";

interface EditSchoolModalProps {
  school: School | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const PLAN_OPTIONS = [
  { value: 1, label: "Local" },
  { value: 2, label: "Remote" },
];

const inputClass =
  "w-full px-3 py-2 bg-surface-900 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors";
const errorInputClass = "border-red-500";
const normalInputClass = "border-surface-600";

// Map the planType string from the store back to its numeric value
const parsePlanType = (planType?: string): number => {
  if (!planType) return 1;
  const lower = planType.toLowerCase();
  if (lower === "remote") return 2;
  return 1; // default to Local
};

const EditSchoolModal: React.FC<EditSchoolModalProps> = ({ school, onClose, onSuccess }) => {
  const { updateSchool, isLoading } = useSchoolStore();

  const [formData, setFormData] = useState<UpdateSchoolPayload>({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    planType: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Populate form when the school prop changes
  useEffect(() => {
    if (school) {
      setFormData({
        name: school.name ?? "",
        email: school.email ?? "",
        phoneNumber: school.phoneNumber ?? "",
        address: school.address ?? "",
        state: school.state ?? "",
        planType: parsePlanType(school.planType),
      });
      setErrors({});
      setSubmitError(null);
    }
  }, [school]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "School name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
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
    if (!school || !validate()) return;

    try {
      await updateSchool(school.id, formData);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setSubmitError(
        err.response?.data?.message ||
          useSchoolStore.getState().error ||
          "Failed to update school"
      );
    }
  };

  if (!school) return null;

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
          <div>
            <h2 className="text-lg font-bold text-white">Edit School</h2>
            <p className="text-sm text-slate-400 mt-0.5">Update details for {school.name}</p>
          </div>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
            onClick={onClose}
            aria-label="Close"
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
            <label htmlFor="edit-name" className="block text-sm font-medium text-slate-300 mb-1.5">
              School Name *
            </label>
            <input
              id="edit-name"
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
            <label htmlFor="edit-email" className="block text-sm font-medium text-slate-300 mb-1.5">
              Contact Email *
            </label>
            <input
              id="edit-email"
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
            <label htmlFor="edit-phoneNumber" className="block text-sm font-medium text-slate-300 mb-1.5">
              Phone Number *
            </label>
            <input
              id="edit-phoneNumber"
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
            <label htmlFor="edit-address" className="block text-sm font-medium text-slate-300 mb-1.5">
              Address *
            </label>
            <textarea
              id="edit-address"
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
            <label htmlFor="edit-state" className="block text-sm font-medium text-slate-300 mb-1.5">
              State *
            </label>
            <select
              id="edit-state"
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
            <label htmlFor="edit-planType" className="block text-sm font-medium text-slate-300 mb-1.5">
              Plan Type
            </label>
            <select
              id="edit-planType"
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
              disabled={isLoading}
              className="px-4 py-2 rounded-lg text-slate-300 hover:bg-surface-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSchoolModal;
