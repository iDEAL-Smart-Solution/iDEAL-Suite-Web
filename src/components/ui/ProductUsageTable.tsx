import { CheckCircle, XCircle } from "lucide-react";
import type { Product } from "../../types/dashboard";

interface ProductUsageTableProps {
  products: Product[];
}

const ProductUsageTable = ({ products }: ProductUsageTableProps) => {
  const getStatusBadge = (status: "Active" | "Inactive") => {
    if (status === "Active") {
      return (
        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <CheckCircle size={16} style={{ color: "#10b981" }} />
          <span style={{ color: "#10b981", fontWeight: 600 }}>Active</span>
        </span>
      );
    } else {
      return (
        <span style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <XCircle size={16} style={{ color: "#ef4444" }} />
          <span style={{ color: "#ef4444", fontWeight: 600 }}>Inactive</span>
        </span>
      );
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 shadow-md">
      <h3 className="text-lg font-bold text-slate-50 mb-4">Product Usage Overview</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900">
              <th className="text-left px-4 py-3 font-semibold text-slate-400">
                Product Name
              </th>
              <th className="text-center px-4 py-3 font-semibold text-slate-400">
                Usage Count
              </th>
              <th className="text-center px-4 py-3 font-semibold text-slate-400">
                Last Used
              </th>
              <th className="text-center px-4 py-3 font-semibold text-slate-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer"
              >
                <td className="px-4 py-3">
                  <strong className="text-slate-50">{product.name}</strong>
                </td>
                <td className="px-4 py-3 text-center text-slate-400">
                  {product.usageCount}
                </td>
                <td className="px-4 py-3 text-center text-slate-400">
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
                <td className="px-4 py-3 text-center">
                  {getStatusBadge(product.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductUsageTable;
