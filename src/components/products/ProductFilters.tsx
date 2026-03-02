import React from "react";
import { cn } from "../../lib/utils";

type FilterOption = "all" | "active" | "inactive" | "subscription";

interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterOption: FilterOption;
  onFilterChange: (filter: FilterOption) => void;
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchChange,
  filterOption,
  onFilterChange,
  totalProducts,
  activeProducts,
  inactiveProducts,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search products by name or code..."
          className="w-full px-4 py-2 bg-surface-800 border border-surface-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-colors duration-200"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 border-b border-surface-700 overflow-x-auto">
        <button
          className={cn(
            "px-4 py-3 font-semibold transition-colors duration-200 whitespace-nowrap border-b-2",
            filterOption === "all"
              ? "border-brand-400 text-brand-400"
              : "border-transparent text-slate-400 hover:text-white"
          )}
          onClick={() => onFilterChange("all")}
        >
          All Products
          <span className="ml-2 text-xs bg-surface-700 text-slate-300 px-2 py-1 rounded-full">
            {totalProducts}
          </span>
        </button>

        <button
          className={cn(
            "px-4 py-3 font-semibold transition-colors duration-200 whitespace-nowrap border-b-2",
            filterOption === "active"
              ? "border-brand-400 text-brand-400"
              : "border-transparent text-slate-400 hover:text-white"
          )}
          onClick={() => onFilterChange("active")}
        >
          Active
          <span className="ml-2 text-xs bg-surface-700 text-slate-300 px-2 py-1 rounded-full">
            {activeProducts}
          </span>
        </button>

        <button
          className={cn(
            "px-4 py-3 font-semibold transition-colors duration-200 whitespace-nowrap border-b-2",
            filterOption === "inactive"
              ? "border-brand-400 text-brand-400"
              : "border-transparent text-slate-400 hover:text-white"
          )}
          onClick={() => onFilterChange("inactive")}
        >
          Inactive
          <span className="ml-2 text-xs bg-surface-700 text-slate-300 px-2 py-1 rounded-full">
            {inactiveProducts}
          </span>
        </button>

        <button
          className={cn(
            "px-4 py-3 font-semibold transition-colors duration-200 whitespace-nowrap border-b-2",
            filterOption === "subscription"
              ? "border-brand-400 text-brand-400"
              : "border-transparent text-slate-400 hover:text-white"
          )}
          onClick={() => onFilterChange("subscription")}
        >
          Requires Subscription
          <span className="ml-2 text-xs bg-surface-700 text-slate-300 px-2 py-1 rounded-full">
            {totalProducts > 0 ? Math.floor(totalProducts * 0.3) : 0}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
