import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import type { CreateSubscriptionRequest } from "../../types/subscription";
import { useProductStore } from "../../stores/useProductStore";
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
    productId: "",
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

    if (!formData.productId || !formData.productId.trim()) {
      newErrors.productId = "Product selection is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    // Ensure product list is loaded (fallback to master list if school has none)
    fetchProducts(schoolId).catch(() => {});
  }, [fetchProducts, schoolId]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-surface-800 border border-surface-700 rounded-xl shadow-2xl w-full max-w-sm sm:max-w-lg max-h-[85vh] sm:max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-surface-700">
          <h2 className="text-lg font-bold text-white">{isRenewal ? "Renew Subscription" : "Create New Subscription"}</h2>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-700 transition-colors" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
          <div>
            <label htmlFor="productId" className="block text-sm font-medium text-slate-300 mb-1.5">Product *</label>
            <select
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2.5 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.productId ? "border-red-500" : "border-surface-600"
              )}
            >
              <option value="">Select a product</option>
              {products.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.productName || p.productCode}
                </option>
              ))}
            </select>
            {errors.productId && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.productId}</span>
            )}
          </div>
          <div>
            <label htmlFor="paidStudentSlots" className="block text-sm font-medium text-slate-300 mb-1.5">Student Slots *</label>
            <input
              type="number"
              id="paidStudentSlots"
              name="paidStudentSlots"
              value={formData.paidStudentSlots}
              onChange={handleChange}
              placeholder="Enter number of student slots (e.g., 200)"
              min="1"
              className={cn(
                "w-full px-3 py-2.5 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.paidStudentSlots ? "border-red-500" : "border-surface-600"
              )}
            />
            {errors.paidStudentSlots && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.paidStudentSlots}</span>
            )}
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-300 mb-1.5">Start Date *</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2.5 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.startDate ? "border-red-500" : "border-surface-600"
              )}
            />
            {errors.startDate && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.startDate}</span>
            )}
          </div>

          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-slate-300 mb-1.5">Expiry Date *</label>
            <input
              type="date"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2.5 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.expiryDate ? "border-red-500" : "border-surface-600"
              )}
            />
            {errors.expiryDate && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.expiryDate}</span>
            )}
            <p className="text-xs text-slate-500 mt-1">Default: 1 year from start date</p>
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-slate-300 mb-1.5">Payment Method *</label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className={cn(
                "w-full px-3 py-2.5 rounded-lg bg-surface-800 border text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200",
                errors.paymentMethod ? "border-red-500" : "border-surface-600"
              )}
            >
              <option value={PaymentMethod.Card}>Card</option>
              <option value={PaymentMethod.BankTransfer}>Bank Transfer</option>
              <option value={PaymentMethod.PayStack}>PayStack</option>
              <option value={PaymentMethod.Cash}>Cash</option>
            </select>
            {errors.paymentMethod && (
              <span className="text-xs font-medium text-red-400 mt-1 block">{errors.paymentMethod}</span>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-300 mb-1.5">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-lg bg-surface-800 border border-surface-600 text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200"
            >
              <option value={SubscriptionStatus.Pending}>Pending</option>
              <option value={SubscriptionStatus.Active}>Active</option>
              <option value={SubscriptionStatus.Deactivated}>
                Deactivated
              </option>
            </select>
            <p className="text-xs text-slate-500 mt-1">Default: Pending (until payment confirmed)</p>
          </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 p-4 md:p-6 border-t border-surface-700 -mx-4 md:-mx-6 -mb-4 mt-6">
            <button
              type="button"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-surface-700 hover:bg-surface-600 text-slate-200 font-medium transition-colors duration-200"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors duration-200 disabled:opacity-50"
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
