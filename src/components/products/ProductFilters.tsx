import React from "react";

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
          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-50 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-3 border-b border-slate-700 overflow-x-auto">
        <button
          className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
            filterOption === "all"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-50"
          }`}
          onClick={() => onFilterChange("all")}
        >
          All Products
          <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
            {totalProducts}
          </span>
        </button>

        <button
          className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
            filterOption === "active"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-50"
          }`}
          onClick={() => onFilterChange("active")}
        >
          Active
          <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
            {activeProducts}
          </span>
        </button>

        <button
          className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
            filterOption === "inactive"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-50"
          }`}
          onClick={() => onFilterChange("inactive")}
        >
          Inactive
          <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
            {inactiveProducts}
          </span>
        </button>

        <button
          className={`px-4 py-3 font-semibold transition-colors whitespace-nowrap border-b-2 ${
            filterOption === "subscription"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-slate-50"
          }`}
          onClick={() => onFilterChange("subscription")}
        >
          Requires Subscription
          <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
            {totalProducts > 0 ? Math.floor(totalProducts * 0.3) : 0}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductFilters;
