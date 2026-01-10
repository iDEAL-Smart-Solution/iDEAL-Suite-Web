import { useEffect, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { productService } from "../../services/productService";
import type { Product, GetProductsResponse } from "../../types/product";
import ProductCard from "../../components/products/ProductCard";
import ProductDetailModal from "../../components/products/ProductDetailModal";
import ProductFilters from "../../components/products/ProductFilters";

type FilterOption = "all" | "active" | "inactive" | "subscription";

const ProductMonitoring = () => {
  const { user } = useAuth();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState<FilterOption>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Permission check
  const isAdmin =
    user?.role === 1 || user?.role === 2; // SuperAdmin (1) or Staff (2)

  // Fetch products on mount
  useEffect(() => {
    if (user?.schoolId) {
      fetchProducts();
    }
  }, [user?.schoolId]);

  const fetchProducts = async () => {
    if (!user?.schoolId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response: GetProductsResponse = await productService.getProducts(
        user.schoolId
      );
      setProducts(response.products || []);
      applyFilters(response.products || [], searchQuery, filterOption);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load products. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Apply search and filter
  const applyFilters = (
    productsToFilter: Product[],
    search: string,
    filter: FilterOption
  ) => {
    let filtered = [...productsToFilter];

    // Apply search filter
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(query) ||
          p.productCode.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (filter === "active") {
      filtered = filtered.filter((p) => p.isActive);
    } else if (filter === "inactive") {
      filtered = filtered.filter((p) => !p.isActive);
    } else if (filter === "subscription") {
      filtered = filtered.filter((p) => p.requiresSubscription);
    }

    setFilteredProducts(filtered);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    applyFilters(products, query, filterOption);
  };

  const handleFilterChange = (filter: FilterOption) => {
    setFilterOption(filter);
    applyFilters(products, searchQuery, filter);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const handleToggleStatus = async (productId: string, currentStatus: boolean) => {
    setActionLoading(true);
    try {
      await productService.updateProductStatus({
        productId,
        isActive: !currentStatus,
      });

      // Update local state
      const updatedProducts = products.map((p) =>
        p.productId === productId ? { ...p, isActive: !currentStatus } : p
      );
      setProducts(updatedProducts);
      applyFilters(updatedProducts, searchQuery, filterOption);

      // Update selected product if viewing details
      if (selectedProduct?.productId === productId) {
        setSelectedProduct({
          ...selectedProduct,
          isActive: !currentStatus,
        });
      }

      setSuccessMessage(
        `Product ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update product status"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleLaunchProduct = async (productId: string) => {
    setActionLoading(true);
    try {
      await productService.launchProduct(productId);

      // Update usage count
      const updatedProducts = products.map((p) =>
        p.productId === productId
          ? { ...p, usageCount: (p.usageCount || 0) + 1, lastUsed: new Date().toISOString() }
          : p
      );
      setProducts(updatedProducts);
      applyFilters(updatedProducts, searchQuery, filterOption);

      setSuccessMessage("Product launched successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to launch product");
    } finally {
      setActionLoading(false);
    }
  };

  // Calculate stats
  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

  // Empty state
  if (!isLoading && products.length === 0 && !error) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Product Monitoring</h1>
        <div className="text-center py-16">
          <p className="text-xl text-slate-400 mb-2">No products available yet.</p>
          <p className="text-slate-500">
            Products will appear here once they are configured in the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Product Monitoring</h1>
        <p className="text-slate-400">
          View and manage available products for your school
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">
          {successMessage}
        </div>
      )}

      {/* Filters */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        filterOption={filterOption}
        onFilterChange={handleFilterChange}
        totalProducts={products.length}
        activeProducts={activeCount}
        inactiveProducts={inactiveCount}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-400">Loading products...</p>
        </div>
      )}

      {/* No Results */}
      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-slate-400 mb-2">No products found</p>
          <p className="text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onViewDetails={handleViewDetails}
              onToggleStatus={handleToggleStatus}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onLaunch={handleLaunchProduct}
        onToggleStatus={handleToggleStatus}
        isAdmin={isAdmin}
        isLoading={actionLoading}
      />

      {/* Stats Summary */}
      {!isLoading && (
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700">
          <div className="text-center">
            <p className="text-slate-400 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-white">{products.length}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 mb-2">Active</p>
            <p className="text-3xl font-bold text-green-400">
              {activeCount}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 mb-2">Inactive</p>
            <p className="text-3xl font-bold text-red-400">
              {inactiveCount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMonitoring;
