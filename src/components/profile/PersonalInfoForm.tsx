import React, { useState } from "react";
import type { UserProfile } from "../../types/profile";

interface PersonalInfoFormProps {
  user: UserProfile;
  onSubmit: (firstName: string, lastName: string, phoneNumber?: string) => void;
  isLoading?: boolean;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    phoneNumber: user.phoneNumber || "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (
      formData.phoneNumber &&
      !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}/.test(
        formData.phoneNumber
      )
    ) {
      newErrors.phoneNumber = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData.firstName, formData.lastName, formData.phoneNumber);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">First Name *</label>
        <input
          type="text"
          className="input"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          disabled={isLoading}
        />
        {errors.firstName && (
          <span className="error-text">{errors.firstName}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Last Name *</label>
        <input
          type="text"
          className="input"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          disabled={isLoading}
        />
        {errors.lastName && <span className="error-text">{errors.lastName}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <div className="readonly-field">
          <input type="email" className="input" value={user.email} disabled />
          <span className="readonly-icon">🔒</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">UIN (User ID)</label>
        <div className="readonly-field">
          <input type="text" className="input" value={user.uin} disabled />
          <span className="readonly-icon">🔒</span>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          className="input"
          placeholder="+234 801 234 5678"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          disabled={isLoading}
        />
        {errors.phoneNumber && (
          <span className="error-text">{errors.phoneNumber}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">Role</label>
        <div className="readonly-field">
          <span className="role-badge">{user.roleLabel || "User"}</span>
          <span className="readonly-icon">🔒</span>
        </div>
      </div>

      {user.schoolName && (
        <div className="form-group">
          <label className="form-label">School</label>
          <div className="readonly-field">
            <input
              type="text"
              className="input"
              value={user.schoolName}
              disabled
            />
            <span className="readonly-icon">🔒</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary form-submit-btn"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default PersonalInfoForm;
