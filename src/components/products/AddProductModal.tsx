import React, { useState } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useProductStore } from "../../stores/useProductStore";
import type { CreateProductRequest } from "../../types/product";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void | Promise<void>;
}

const inputClass =
  "w-full px-3 py-2 bg-surface-900 border rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors";
const errorInputClass = "border-red-500";
const normalInputClass = "border-surface-600";

const CATEGORY_OPTIONS = [
  "Learning Management",
  "Student Information",
  "Assessment",
  "Communication",
  "Finance",
  "Analytics",
  "Other",
];

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createProduct, actionLoading } = useProductStore();

  const [formData, setFormData] = useState<CreateProductRequest>({
    productName: "",
    productCode: "",
    description: "",
    requiresSubscription: true,
    category: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.productName.trim()) newErrors.productName = "Product name is required";
    if (!formData.productCode.trim()) {
      newErrors.productCode = "Product code is required";
    } else if (!/^[A-Za-z0-9_-]+$/.test(formData.productCode)) {
      newErrors.productCode = "Only letters, numbers, hyphens and underscores allowed";
    }
    if (!formData.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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

  const resetForm = () => {
    setFormData({
      productName: "",
      productCode: "",
      description: "",
      requiresSubscription: true,
      category: "",
    });
    setErrors({});
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createProduct(formData);
      await onSuccess?.();
      onClose();
      resetForm();
    } catch {
      setSubmitError(
        useProductStore.getState().error || "Failed to create product"
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
          <h2 className="text-lg font-bold text-white">Add New Product</h2>
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

          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-1.5">
              Product Name *
            </label>
            <input
              id="productName"
              name="productName"
              type="text"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g. iDEAL LMS"
              className={cn(inputClass, errors.productName ? errorInputClass : normalInputClass)}
            />
            {errors.productName && <p className="text-xs text-red-400 mt-1">{errors.productName}</p>}
          </div>

          {/* Product Code */}
          <div>
            <label htmlFor="productCode" className="block text-sm font-medium text-slate-300 mb-1.5">
              Product Code *
            </label>
            <input
              id="productCode"
              name="productCode"
              type="text"
              value={formData.productCode}
              onChange={handleChange}
              placeholder="e.g. IDEAL-LMS"
              className={cn(inputClass, errors.productCode ? errorInputClass : normalInputClass)}
            />
            {errors.productCode && <p className="text-xs text-red-400 mt-1">{errors.productCode}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1.5">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this product does..."
              rows={3}
              className={cn(inputClass, "resize-none", errors.description ? errorInputClass : normalInputClass)}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={cn(inputClass, normalInputClass)}
            >
              <option value="">Select a category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Requires Subscription */}
          <div className="flex items-center gap-3">
            <input
              id="requiresSubscription"
              name="requiresSubscription"
              type="checkbox"
              checked={formData.requiresSubscription}
              onChange={handleChange}
              className="w-4 h-4 rounded border-surface-600 bg-surface-900 text-brand-500 focus:ring-brand-400/20"
            />
            <label htmlFor="requiresSubscription" className="text-sm text-slate-300">
              Requires active subscription to use
            </label>
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
              disabled={actionLoading}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {actionLoading ? "Creating..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
