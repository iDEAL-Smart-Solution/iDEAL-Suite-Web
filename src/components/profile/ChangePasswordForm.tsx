import React, { useState } from "react";
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
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Current Password *</label>
        <input
          type="password"
          className="input"
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData({ ...formData, currentPassword: e.target.value })
          }
          disabled={isLoading}
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <span className="error-text">{errors.currentPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">New Password *</label>
        <input
          type="password"
          className="input"
          value={formData.newPassword}
          onChange={(e) => handleNewPasswordChange(e.target.value)}
          disabled={isLoading}
          placeholder="Enter a new password"
        />

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <div className="password-strength-container">
            <div
              className={`password-strength-bar strength-${passwordStrength}`}
            ></div>
            <span className={`password-strength-text ${passwordStrength}`}>
              {passwordStrength === "weak" && "Weak password"}
              {passwordStrength === "medium" && "Medium strength"}
              {passwordStrength === "strong" && "Strong password"}
            </span>
          </div>
        )}

        {/* Password Requirements */}
        {formData.newPassword && (
          <div className="password-requirements">
            <p className="requirements-title">Requirements:</p>
            <ul className="requirements-list">
              <li
                className={
                  formData.newPassword.length >= 8 ? "met" : "not-met"
                }
              >
                {formData.newPassword.length >= 8 ? "✓" : "○"} At least 8
                characters
              </li>
              <li
                className={
                  /[a-z]/.test(formData.newPassword) &&
                  /[A-Z]/.test(formData.newPassword)
                    ? "met"
                    : "not-met"
                }
              >
                {/[a-z]/.test(formData.newPassword) &&
                /[A-Z]/.test(formData.newPassword)
                  ? "✓"
                  : "○"} Mixed case letters (a-z, A-Z)
              </li>
              <li
                className={
                  /[0-9]/.test(formData.newPassword) ? "met" : "not-met"
                }
              >
                {/[0-9]/.test(formData.newPassword) ? "✓" : "○"} Contains numbers
              </li>
            </ul>
          </div>
        )}

        {errors.newPassword && (
          <span className="error-text">{errors.newPassword}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Confirm Password *</label>
        <input
          type="password"
          className="input"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({ ...formData, confirmPassword: e.target.value })
          }
          disabled={isLoading}
          placeholder="Confirm your new password"
        />
        {errors.confirmPassword && (
          <span className="error-text">{errors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        className="btn btn-primary form-submit-btn"
        disabled={isLoading}
      >
        {isLoading ? "Changing..." : "Change Password"}
      </button>
    </form>
  );
};

export default ChangePasswordForm;
