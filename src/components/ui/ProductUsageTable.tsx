import { CheckCircle, XCircle } from "lucide-react";
import type { Product } from "../../types/dashboard";

interface ProductUsageTableProps {
  products: Product[];
}

const ProductUsageTable = ({ products = [] }: ProductUsageTableProps) => {
  const getStatusBadge = (status: "Active" | "Inactive") => {
    if (status === "Active") {
      return (
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle size={16} className="text-emerald-400" />
          <span className="text-emerald-400 font-semibold text-sm">Active</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5">
        <XCircle size={16} className="text-red-400" />
        <span className="text-red-400 font-semibold text-sm">Inactive</span>
      </span>
    );
  };

  return (
    <div className="bg-surface-800 border border-surface-700 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-white">Product Usage Overview</h3>
      </div>

      {products.length === 0 ? (
        <div className="px-6 py-8 text-center text-slate-400">
          <p>No product usage data available yet.</p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="bg-surface-900">
              <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Product Name
              </th>
              <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Usage Count
              </th>
              <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Last Used
              </th>
              <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-surface-700/50 transition-colors duration-200"
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-white">{product.name}</span>
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-400 tabular-nums">
                  {product.usageCount}
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-400">
                  {product.lastUsed ? (
                    new Date(product.lastUsed).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  ) : (
                    <span className="text-slate-500">Never</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {getStatusBadge(product.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default ProductUsageTable;
