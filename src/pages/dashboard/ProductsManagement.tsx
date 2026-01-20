import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  availableIn: string[];
  schoolsUsing: number;
}

const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setProducts([
        {
          id: "1",
          name: "Student Management System",
          description: "Comprehensive student information and registration management",
          status: "ACTIVE",
          availableIn: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],
          schoolsUsing: 127,
        },
        {
          id: "2",
          name: "Analytics Dashboard",
          description: "Advanced analytics and reporting tools",
          status: "ACTIVE",
          availableIn: ["PROFESSIONAL", "ENTERPRISE"],
          schoolsUsing: 89,
        },
        {
          id: "3",
          name: "Assignment Management",
          description: "Create, assign, and grade assignments",
          status: "ACTIVE",
          availableIn: ["PROFESSIONAL", "ENTERPRISE"],
          schoolsUsing: 76,
        },
        {
          id: "4",
          name: "Parent Portal",
          description: "Parent-teacher communication and progress tracking",
          status: "ACTIVE",
          availableIn: ["ENTERPRISE"],
          schoolsUsing: 45,
        },
        {
          id: "5",
          name: "Attendance Tracking",
          description: "Track and monitor student attendance",
          status: "ACTIVE",
          availableIn: ["STARTER", "PROFESSIONAL", "ENTERPRISE"],
          schoolsUsing: 120,
        },
        {
          id: "6",
          name: "Online Examinations",
          description: "Create and conduct online exams",
          status: "INACTIVE",
          availableIn: ["PROFESSIONAL", "ENTERPRISE"],
          schoolsUsing: 0,
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const getStatusColor = (status: string) => {
    return status === "ACTIVE"
      ? "text-green-400 bg-green-900/20"
      : "text-slate-400 bg-slate-800";
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "ENTERPRISE":
        return "bg-purple-900/20 text-purple-400 border-purple-800";
      case "PROFESSIONAL":
        return "bg-cyan-900/20 text-cyan-400 border-cyan-800";
      case "STARTER":
        return "bg-blue-900/20 text-blue-400 border-blue-800";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products Management</h1>
          <p className="text-slate-400">Manage all iDEAL platform products and services</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition-colors"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-slate-400 text-sm">{product.description}</p>
              </div>
              <span
                className={`px-3 py-1 text-xs font-medium rounded ${getStatusColor(
                  product.status
                )}`}
              >
                {product.status}
              </span>
            </div>

            {/* Available Plans */}
            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-2">Available in:</p>
              <div className="flex flex-wrap gap-2">
                {product.availableIn.map((plan) => (
                  <span
                    key={plan}
                    className={`px-3 py-1 text-xs font-medium rounded border ${getPlanColor(
                      plan
                    )}`}
                  >
                    {plan}
                  </span>
                ))}
              </div>
            </div>

            {/* Usage Stats */}
            <div className="mb-4">
              <p className="text-slate-300 text-sm">
                <span className="font-bold text-cyan-400">{product.schoolsUsing}</span> schools
                using this product
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
                <Eye size={16} />
                View
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm">
                <Edit size={16} />
                Edit
              </button>
              <button className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 text-red-400 rounded-lg transition-colors text-sm">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsManagement;
