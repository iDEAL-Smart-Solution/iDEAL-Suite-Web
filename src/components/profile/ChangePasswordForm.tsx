import React, { useState } from "react";
import { cn } from "../../lib/utils";
import type { PasswordStrength } from "../../types/profile";

interface ChangePasswordFormProps {
  onSubmit: (currentPassword: string, newPassword: string) => void;
  isLoading?: boolean;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(
    "weak"
  );

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 1) return "weak";
    if (strength <= 2) return "medium";
    return "strong";
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      if (formData.newPassword.length < 8) {
        newErrors.newPassword =
          "Password must be at least 8 characters long";
      }
      if (!/[a-z]/.test(formData.newPassword)) {
        newErrors.newPassword =
          "Password must contain lowercase letters";
      }
      if (!/[A-Z]/.test(formData.newPassword)) {
        newErrors.newPassword =
          "Password must contain uppercase letters";
      }
      if (!/[0-9]/.test(formData.newPassword)) {
        newErrors.newPassword = "Password must contain numbers";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNewPasswordChange = (value: string) => {
    setFormData({ ...formData, newPassword: value });
    if (value) {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.currentPassword, formData.newPassword);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">Current Password *</label>
        <input
          type="password"
          className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200 disabled:opacity-50"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
          disabled={isLoading}
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <span className="text-xs font-medium text-red-400">{errors.currentPassword}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">New Password *</label>
        <input
          type="password"
          className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200 disabled:opacity-50"
          value={formData.newPassword}
          onChange={(e) => handleNewPasswordChange(e.target.value)}
          disabled={isLoading}
          placeholder="Enter a new password"
        />

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="mt-2 space-y-1">
            <div className="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  passwordStrength === "weak" && "w-1/3 bg-red-500",
                  passwordStrength === "medium" && "w-2/3 bg-yellow-500",
                  passwordStrength === "strong" && "w-full bg-emerald-500"
                )}
              />
            </div>
            <span
              className={cn(
                "text-xs",
                passwordStrength === "weak" && "text-red-400",
                passwordStrength === "medium" && "text-yellow-400",
                passwordStrength === "strong" && "text-emerald-400"
              )}
            >
              {passwordStrength === "weak" && "Weak password"}
              {passwordStrength === "medium" && "Medium strength"}
              {passwordStrength === "strong" && "Strong password"}
            </span>
          </div>
        )}

        {/* Password Requirements */}
        {formData.newPassword && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-slate-400">Requirements:</p>
            <ul className="space-y-1 text-xs">
              <li
                className={cn(
                  formData.newPassword.length >= 8 ? "text-emerald-400" : "text-slate-500"
                )}
              >
                {formData.newPassword.length >= 8 ? "✓" : "○"} At least 8
                characters
              </li>
              <li
                className={cn(
                  /[a-z]/.test(formData.newPassword) &&
                  /[A-Z]/.test(formData.newPassword)
                    ? "text-emerald-400"
                    : "text-slate-500"
                )}
              >
                {/[a-z]/.test(formData.newPassword) &&
                /[A-Z]/.test(formData.newPassword)
                  ? "✓"
                  : "○"} Mixed case letters (a-z, A-Z)
              </li>
              <li
                className={cn(
                  /[0-9]/.test(formData.newPassword) ? "text-emerald-400" : "text-slate-500"
                )}
              >
                {/[0-9]/.test(formData.newPassword) ? "✓" : "○"} Contains numbers
              </li>
            </ul>
          </div>
        )}

        {errors.newPassword && (
          <span className="text-xs font-medium text-red-400">{errors.newPassword}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">Confirm Password *</label>
        <input
          type="password"
          className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200 disabled:opacity-50"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          disabled={isLoading}
          placeholder="Confirm your new password"
        />
        {errors.confirmPassword && (
          <span className="text-xs font-medium text-red-400">{errors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 py-2.5"
        disabled={isLoading}
      >
        {isLoading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
