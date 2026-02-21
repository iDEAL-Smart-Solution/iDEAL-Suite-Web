import React from "react";
import { cn } from "../../lib/utils";
import type { Product } from "../../types/product";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (productId: string) => void;
  onToggleStatus: (productId: string, currentStatus: boolean) => void;
  isAdmin: boolean;
  isLoading?: boolean;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onLaunch,
  onToggleStatus,
  isAdmin,
  isLoading = false,
}) => {
  if (!isOpen || !product) return null;

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Never";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-800 border border-surface-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-700">
          <h2 className="text-xl font-bold text-white">{product.productName}</h2>
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-surface-700 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Product Code */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Product Code</label>
            <p className="text-sm text-white">{product.productCode}</p>
          </div>

          {/* Status */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Status</label>
            <p>
              <span
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium",
                  product.isActive
                    ? "bg-emerald-500/15 text-emerald-400"
                    : "bg-red-500/15 text-red-400"
                )}
              >
                {product.isActive ? "🟢 Active" : "🔴 Inactive"}
              </span>
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Description</label>
            <p className="text-sm text-white">{product.description}</p>
          </div>

          {/* Subscription Requirement */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Subscription Requirement</label>
            <p>
              {product.requiresSubscription ? (
                <span className="bg-yellow-500/15 text-yellow-400 rounded-md px-2.5 py-1 text-xs font-medium">Requires Active Subscription</span>
              ) : (
                <span className="bg-emerald-500/15 text-emerald-400 rounded-md px-2.5 py-1 text-xs font-medium">No Subscription Required</span>
              )}
            </p>
          </div>

          {/* Usage Statistics */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Usage Statistics</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-900 rounded-lg p-4">
                <span className="text-xs text-slate-400 block mb-1">Total Usage</span>
                <span className="text-lg font-bold text-brand-400">{product.usageCount || 0}</span>
              </div>
              <div className="bg-surface-900 rounded-lg p-4">
                <span className="text-xs text-slate-400 block mb-1">Last Used</span>
                <span className="text-sm font-semibold text-white">{formatDate(product.lastUsed)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1 block">Timeline</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-900 rounded-lg p-4">
                <span className="text-xs text-slate-400 block mb-1">Active Since</span>
                <span className="text-sm text-white">
                  {formatDate(product.activeSince || null)}
                </span>
              </div>
              <div className="bg-surface-900 rounded-lg p-4">
                <span className="text-xs text-slate-400 block mb-1">Last Used</span>
                <span className="text-sm text-white">
                  {formatDate(product.lastUsed || null)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-surface-700">
          <button
            className="bg-surface-700 hover:bg-surface-600 text-slate-200 rounded-lg px-4 py-2 font-medium transition-colors duration-200"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-brand-500 hover:bg-brand-600 text-white rounded-lg px-4 py-2 font-medium transition-colors duration-200 disabled:opacity-50"
            onClick={() => {
              onLaunch(product.productId);
              onClose();
            }}
            disabled={!product.isActive || isLoading}
          >
            {isLoading ? "Launching..." : "Launch Product"}
          </button>
          {isAdmin && (
            <button
              className={cn(
                "rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200 disabled:opacity-50",
                product.isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              )}
              onClick={() => {
                onToggleStatus(product.productId, product.isActive);
                onClose();
              }}
              disabled={isLoading}
            >
              {product.isActive ? "Deactivate" : "Activate"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
