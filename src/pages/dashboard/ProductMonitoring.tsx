import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useProductStore } from "../../stores/useProductStore";
import ProductCard from "../../components/products/ProductCard";
import ProductDetailModal from "../../components/products/ProductDetailModal";
import ProductFilters from "../../components/products/ProductFilters";

const ProductMonitoring = () => {
  const user = useAuthStore((s) => s.user);
  const {
    products,
    filteredProducts,
    selectedProduct,
    searchQuery,
    filterOption,
    isLoading,
    actionLoading,
    error,
    successMessage,
    fetchProducts,
    setSearch,
    setFilter,
    selectProduct,
    toggleProductStatus,
    launchProduct,
    clearMessages,
  } = useProductStore();

  const isAdmin = user?.role === 0 || user?.role === 1 || user?.role === 2;

  useEffect(() => {
    if (user?.schoolId) fetchProducts(user.schoolId);
  }, [user?.schoolId, fetchProducts]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(clearMessages, 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage, clearMessages]);

  const activeCount = products.filter((p) => p.isActive).length;
  const inactiveCount = products.filter((p) => !p.isActive).length;

  if (!isLoading && products.length === 0 && !error) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Product Monitoring</h1>
        <div className="text-center py-16">
          <p className="text-xl text-slate-400 mb-2">No products available yet.</p>
          <p className="text-slate-500">Products will appear here once they are configured in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Product Monitoring</h1>
        <p className="text-slate-400">View and manage available products for your school</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">{error}</div>
      )}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-green-400">{successMessage}</div>
      )}

      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearch}
        filterOption={filterOption}
        onFilterChange={setFilter}
        totalProducts={products.length}
        activeProducts={activeCount}
        inactiveProducts={inactiveCount}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-surface-700 border-t-brand-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-400">Loading products...</p>
        </div>
      )}

      {!isLoading && filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-slate-400 mb-2">No products found</p>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {!isLoading && filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onViewDetails={selectProduct}
              onToggleStatus={toggleProductStatus}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => selectProduct(null)}
        onLaunch={launchProduct}
        onToggleStatus={toggleProductStatus}
        isAdmin={isAdmin}
        isLoading={actionLoading}
      />

      {!isLoading && (
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-surface-700">
          <div className="text-center">
            <p className="text-slate-400 mb-2">Total Products</p>
            <p className="text-3xl font-bold text-white">{products.length}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 mb-2">Active</p>
            <p className="text-3xl font-bold text-green-400">{activeCount}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 mb-2">Inactive</p>
            <p className="text-3xl font-bold text-red-400">{inactiveCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductMonitoring;
