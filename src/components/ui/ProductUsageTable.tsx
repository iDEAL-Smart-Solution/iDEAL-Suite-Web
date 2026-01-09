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
    <div className="product-usage-table">
      <h3>Product Usage Overview</h3>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "1px solid var(--border)",
                backgroundColor: "var(--bg)",
              }}
            >
              <th style={{ textAlign: "left", padding: "12px", fontWeight: 600 }}>
                Product Name
              </th>
              <th style={{ textAlign: "center", padding: "12px", fontWeight: 600 }}>
                Usage Count
              </th>
              <th style={{ textAlign: "center", padding: "12px", fontWeight: 600 }}>
                Last Used
              </th>
              <th style={{ textAlign: "center", padding: "12px", fontWeight: 600 }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                style={{
                  borderBottom: "1px solid var(--border)",
                  transition: "background-color 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--card)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <td style={{ padding: "12px" }}>
                  <strong>{product.name}</strong>
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {product.usageCount}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
                  {product.lastUsed ? (
                    new Date(product.lastUsed).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>Never</span>
                  )}
                </td>
                <td style={{ padding: "12px", textAlign: "center" }}>
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
