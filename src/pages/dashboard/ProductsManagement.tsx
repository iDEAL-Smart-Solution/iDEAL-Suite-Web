import { useEffect, useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useProductStore } from "../../stores/useProductStore";
import { useAuthStore } from "../../stores/useAuthStore";
import AddProductModal from "../../components/products/AddProductModal";
import PageHeader from "../../components/layout/PageHeader";

const ProductsManagement = () => {
  const user = useAuthStore((s) => s.user);
  const { products, isLoading, error, fetchProducts, toggleProductStatus } = useProductStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    if (user?.schoolId) fetchProducts(user.schoolId);
  }, [user?.schoolId, fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products Management"
        subtitle="Manage all iDEAL Suite products"
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Add Product
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-800 border border-surface-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">{error}</div>
      )}

      <div className="bg-surface-800 rounded-xl border border-surface-700 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[560px]">
          <thead className="bg-surface-900">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Product Name</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Usage</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-400">Loading products...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-slate-400">No products found</td></tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.productId} className="hover:bg-surface-700/50 transition-colors">
                  <td className="px-3 sm:px-6 py-4 text-white font-medium">{product.productName}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${product.isActive ? "text-green-400 bg-green-900/20" : "text-red-400 bg-red-900/20"}`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-slate-300">{product.usageCount ?? 0} uses</td>
                  <td className="px-3 sm:px-6 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <button className="p-2 text-brand-400 hover:bg-brand-500/10 rounded transition-colors"><Edit size={16} /></button>
                      <button
                        className="p-2 text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors text-xs"
                        onClick={() => toggleProductStatus(product.productId, product.isActive)}
                      >
                        {product.isActive ? "Disable" : "Enable"}
                      </button>
                      <button className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      <AddProductModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          if (user?.schoolId) fetchProducts(user.schoolId);
        }}
      />
    </div>
  );
};

export default ProductsManagement;
