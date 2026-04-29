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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">First Name *</label>
        <input
          type="text"
          className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200 disabled:opacity-50"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          disabled={isLoading}
        />
        {errors.firstName && (
          <span className="text-xs font-medium text-red-400">{errors.firstName}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">Last Name *</label>
        <input
          type="text"
          className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200 disabled:opacity-50"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          disabled={isLoading}
        />
        {errors.lastName && <span className="text-xs font-medium text-red-400">{errors.lastName}</span>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">Email</label>
        <div className="relative">
          <input type="email" className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white opacity-60 disabled:opacity-50" value={user.email} disabled />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔒</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">UIN (User ID)</label>
        <div className="relative">
          <input type="text" className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white opacity-60 disabled:opacity-50" value={user.uin} disabled />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔒</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">Phone Number</label>
        <input
          type="tel"
          className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200 disabled:opacity-50"
          placeholder="+234 801 234 5678"
          value={formData.phoneNumber}
          onChange={(e) =>
            setFormData({ ...formData, phoneNumber: e.target.value })
          }
          disabled={isLoading}
        />
        {errors.phoneNumber && (
          <span className="text-xs font-medium text-red-400">{errors.phoneNumber}</span>
        )}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-slate-300">Role</label>
        <div className="relative">
          <span className="inline-block px-3 py-1 bg-brand-500/15 text-brand-400 rounded-md text-sm font-medium">{user.roleLabel || "User"}</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔒</span>
        </div>
      </div>

      {user.schoolName && (
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-300">School</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-3 py-2.5 rounded-lg bg-surface-800 border border-surface-600 text-white opacity-60 disabled:opacity-50"
              value={user.schoolName}
              disabled
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔒</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 py-2.5"
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
};

export default PersonalInfoForm;
