import React, { useState, useEffect } from "react";
import type { CreateSubscriptionRequest } from "../../types/subscription";
import { SubscriptionStatus, PaymentMethod } from "../../types/subscription";

interface CreateSubscriptionModalProps {
  isOpen: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionRequest) => Promise<void>;
  schoolId: string;
  isRenewal?: boolean;
  prefilledSlots?: number;
  prefilledStartDate?: string;
}

const CreateSubscriptionModal: React.FC<CreateSubscriptionModalProps> = ({
  isOpen,
  isLoading = false,
  onClose,
  onSubmit,
  schoolId,
  isRenewal = false,
  prefilledSlots,
  prefilledStartDate,
}) => {
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    schoolId,
    paidStudentSlots: prefilledSlots || 100,
    startDate: prefilledStartDate || new Date().toISOString().split("T")[0],
    expiryDate: "",
    paymentMethod: PaymentMethod.Card,
    status: SubscriptionStatus.Pending,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate default expiry date (1 year from start date)
  useEffect(() => {
    if (formData.startDate) {
      const startDate = new Date(formData.startDate);
      const expiryDate = new Date(
        startDate.getFullYear() + 1,
        startDate.getMonth(),
        startDate.getDate()
      );
      setFormData((prev) => ({
        ...prev,
        expiryDate: expiryDate.toISOString().split("T")[0],
      }));
    }
  }, [formData.startDate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.paidStudentSlots || formData.paidStudentSlots < 1) {
      newErrors.paidStudentSlots = "Student slots must be at least 1";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    }

    if (formData.startDate && formData.expiryDate) {
      const startDate = new Date(formData.startDate);
      const expiryDate = new Date(formData.expiryDate);

      if (expiryDate <= startDate) {
        newErrors.expiryDate = "Expiry date must be after start date";
      }
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Payment method is required";
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
      [name]:
        name === "paidStudentSlots"
          ? parseInt(value, 10)
          : name === "status"
            ? parseInt(value, 10)
            : value,
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isRenewal ? "Renew Subscription" : "Create New Subscription"}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="subscription-form">
          <div className="form-group">
            <label htmlFor="paidStudentSlots">Student Slots *</label>
            <input
              type="number"
              id="paidStudentSlots"
              name="paidStudentSlots"
              value={formData.paidStudentSlots}
              onChange={handleChange}
              placeholder="Enter number of student slots (e.g., 200)"
              min="1"
              className={errors.paidStudentSlots ? "error" : ""}
            />
            {errors.paidStudentSlots && (
              <span className="error-message">{errors.paidStudentSlots}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={errors.startDate ? "error" : ""}
            />
            {errors.startDate && (
              <span className="error-message">{errors.startDate}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date *</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={errors.expiryDate ? "error" : ""}
            />
            {errors.expiryDate && (
              <span className="error-message">{errors.expiryDate}</span>
            )}
            <small>Default: 1 year from start date</small>
          </div>

          <div className="form-group">
            <label htmlFor="paymentMethod">Payment Method *</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={errors.paymentMethod ? "error" : ""}
            >
              <option value={PaymentMethod.Card}>Card</option>
              <option value={PaymentMethod.BankTransfer}>Bank Transfer</option>
              <option value={PaymentMethod.PayStack}>PayStack</option>
              <option value={PaymentMethod.Cash}>Cash</option>
            </select>
            {errors.paymentMethod && (
              <span className="error-message">{errors.paymentMethod}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value={SubscriptionStatus.Pending}>Pending</option>
              <option value={SubscriptionStatus.Active}>Active</option>
              <option value={SubscriptionStatus.Deactivated}>
                Deactivated
              </option>
            </select>
            <small>Default: Pending (until payment confirmed)</small>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading
                ? "Creating..."
                : isRenewal
                  ? "Renew Subscription"
                  : "Create Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSubscriptionModal;
