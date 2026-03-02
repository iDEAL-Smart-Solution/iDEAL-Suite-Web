import React from "react";
import { cn } from "../../lib/utils";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onToggleStatus: (productId: string, currentStatus: boolean) => void;
  isAdmin: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onToggleStatus,
  isAdmin,
}) => {
  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Never";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className={cn(
        "bg-surface-800 rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-all duration-200",
        product.isActive ? "border-surface-700" : "border-red-500/30"
      )}
    >
      {/* Header with Status */}
      <div className="flex items-center justify-between p-4 border-b border-surface-700 bg-surface-900">
        <div className="flex items-center gap-2">
          <span className={cn("text-2xl", product.isActive ? "text-green-400" : "text-red-400")}>
            ●
          </span>
          <h3 className="text-lg font-bold text-white">{product.productName}</h3>
        </div>
        {product.requiresSubscription && (
          <span className="bg-brand-500/20 text-brand-400 text-xs font-semibold px-2 py-1 rounded-md">
            Requires Subscription
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-400">Code: <span className="text-white font-semibold">{product.productCode}</span></p>
        <p className="text-sm text-slate-300">{product.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-surface-700">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Usage Count</span>
            <span className="text-xl font-bold text-brand-400">{product.usageCount || 0}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Last Used</span>
            <span className="text-sm text-slate-300">{formatDate(product.lastUsed)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 bg-surface-900 border-t border-surface-700">
        <button
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-200"
          onClick={() => onViewDetails(product)}
        >
          View Details
        </button>
        {isAdmin && (
          <button
            className={cn(
              "flex-1 text-white font-semibold py-2 px-3 rounded-lg text-sm transition-colors duration-200",
              product.isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            )}
            onClick={() => onToggleStatus(product.productId, product.isActive)}
          >
            {product.isActive ? "Deactivate" : "Activate"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
