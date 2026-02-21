import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import type { User, CreateUserRequest } from "../../types/user";
import { UserRole } from "../../types/user";

interface UserModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (userData: CreateUserRequest) => Promise<void>;
  user?: User;
  schoolId: string;
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
  user,
  schoolId,
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: UserRole.Student,
    schoolId,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: "", // Password is not filled for edit mode
        phoneNumber: user.phoneNumber,
        role: user.role,
        schoolId: user.schoolId,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phoneNumber: "",
        role: UserRole.Student,
        schoolId,
      });
    }
    setErrors({});
  }, [user, isOpen, schoolId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    }
    if (!user && !formData.password) {
      newErrors.password = "Password is required for new users";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "role" ? parseInt(value, 10) : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-surface-800 border border-surface-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-surface-700">
          <h2 className="text-lg font-bold text-white">{user ? "Edit User" : "Add New User"}</h2>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-700 transition-colors" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              className={cn(
                "w-full h-10 px-3 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.firstName ? "border-red-500" : "border-surface-600"
              )}
            />
            {errors.firstName && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.firstName}</span>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1.5">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              className={cn(
                "w-full h-10 px-3 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.lastName ? "border-red-500" : "border-surface-600"
              )}
            />
            {errors.lastName && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.lastName}</span>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              disabled={!!user}
              className={cn(
                "w-full h-10 px-3 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200 disabled:opacity-50",
                errors.email ? "border-red-500" : "border-surface-600"
              )}
            />
            {errors.email && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.email}</span>
            )}
          </div>

          {!user && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className={cn(
                  "w-full h-10 px-3 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                  errors.password ? "border-red-500" : "border-surface-600"
                )}
              />
              {errors.password && (
                <span className="text-xs font-medium text-red-400 mt-1 block">{errors.password}</span>
              )}
            </div>
          )}

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number *</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              className={cn(
                "w-full h-10 px-3 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.phoneNumber ? "border-red-500" : "border-surface-600"
              )}
            />
            {errors.phoneNumber && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.phoneNumber}</span>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1.5">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={cn(
                "w-full h-10 px-3 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.role ? "border-red-500" : "border-surface-600"
              )}
            >
              <option value={UserRole.SuperAdmin}>SuperAdmin</option>
              <option value={UserRole.Staff}>Staff</option>
              <option value={UserRole.Student}>Student</option>
              <option value={UserRole.Dev}>Dev</option>
            </select>
            {errors.role && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.role}</span>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-700 -mx-6 -mb-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-slate-200 font-medium transition-colors duration-200"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors duration-200 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
