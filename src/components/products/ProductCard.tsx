import React from "react";
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
    <div className={`bg-slate-800 rounded-lg border shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
      product.isActive ? "border-slate-700" : "border-red-500/30"
    }`}>
      {/* Header with Status */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center gap-2">
          <span className={`text-2xl ${product.isActive ? "text-green-400" : "text-red-400"}`}>
            ●
          </span>
          <h3 className="text-lg font-bold text-slate-50">{product.productName}</h3>
        </div>
        {product.requiresSubscription && (
          <span className="bg-blue-500/20 text-blue-400 text-xs font-semibold px-2 py-1 rounded">
            Requires Subscription
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <p className="text-sm text-slate-400">Code: <span className="text-slate-50 font-semibold">{product.productCode}</span></p>
        <p className="text-sm text-slate-300">{product.description}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700">
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Usage Count</span>
            <span className="text-xl font-bold text-blue-400">{product.usageCount || 0}</span>
          </div>
          <div>
            <span className="text-xs text-slate-500 uppercase tracking-wide block mb-1">Last Used</span>
            <span className="text-sm text-slate-300">{formatDate(product.lastUsed)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 p-4 bg-slate-900 border-t border-slate-700">
        <button
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded text-sm transition-colors"
          onClick={() => onViewDetails(product)}
        >
          View Details
        </button>
        {isAdmin && (
          <button
            className={`flex-1 text-white font-semibold py-2 px-3 rounded text-sm transition-colors ${
              product.isActive
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
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
