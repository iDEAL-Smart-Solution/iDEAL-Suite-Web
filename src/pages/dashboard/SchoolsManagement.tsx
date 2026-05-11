import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, X, ChevronRight } from "lucide-react";
import { useSchoolStore } from "../../stores/useSchoolStore";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";
import AddSchoolModal from "../../components/schools/AddSchoolModal";
import PageHeader from "../../components/layout/PageHeader";
import type { School } from "../../stores/useSchoolStore";

const SchoolsManagement = () => {
  const { schools, isLoading, error, fetchAllSchools } = useSchoolStore();
  const { subscriptionHistory, fetchReportingSubscriptions } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  useEffect(() => {
    fetchAllSchools();
    void fetchReportingSubscriptions();
  }, [fetchAllSchools]);

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSchoolSubscriptionSummary = (schoolId: string, schoolName: string) => {
    const matches = subscriptionHistory.filter(
      (sub) => sub.schoolId === schoolId || sub.schoolName === schoolName
    );
    const now = Date.now();
    const hasActive = matches.some((sub) => new Date(sub.expiryDate).getTime() > now);
    const productCount = new Set(
      matches.map((sub) => sub.productId || sub.productName || sub.id)
    ).size;

    return {
      statusLabel: hasActive ? "ACTIVE" : "INACTIVE",
      productCount,
      products: matches,
    };
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE": return "text-green-400 bg-green-900/20";
      case "EXPIRING_SOON": return "text-yellow-400 bg-yellow-900/20";
      case "EXPIRED":
      case "INACTIVE": return "text-red-400 bg-red-900/20";
      default: return "text-slate-400 bg-surface-800";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Schools Management"
        subtitle="Manage all schools subscribed to iDEAL services"
        action={
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={20} />
            Add School
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search schools by name or email..."
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
        <table className="w-full min-w-[620px]">
          <thead className="bg-surface-900">
            <tr>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">School Name</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Contact Email</th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">State</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Product Count</th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Joined</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-400">Loading schools...</td></tr>
            ) : filteredSchools.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-400">No schools found</td></tr>
            ) : (
              filteredSchools.map((school) => {
                const { statusLabel, productCount } = getSchoolSubscriptionSummary(school.id, school.name);

                return (
                  <tr key={school.id} className="hover:bg-surface-700/50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 text-white font-medium">
                      <button
                        type="button"
                        onClick={() => setSelectedSchool(school)}
                        className="inline-flex items-center gap-2 text-left hover:text-brand-300 transition-colors"
                      >
                        {school.name}
                        <ChevronRight size={14} />
                      </button>
                    </td>
                    <td className="px-3 sm:px-6 py-4 text-slate-300">{school.email}</td>
                    <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-slate-300">{school.state}</td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(statusLabel)}`}>
                        {statusLabel.replace("_", " ")}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-slate-300">{productCount}</td>
                    <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-slate-300">
                      {school.createdAt ? new Date(school.createdAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-brand-400 hover:bg-brand-500/10 rounded transition-colors"><Edit size={16} /></button>
                        <button className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        </div>
      </div>

      <AddSchoolModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => fetchAllSchools()}
      />

      {selectedSchool && (() => {
        const { statusLabel, productCount, products } = getSchoolSubscriptionSummary(selectedSchool.id, selectedSchool.name);
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedSchool(null)}
          >
            <div
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-surface-700 bg-surface-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-surface-700 px-6 py-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedSchool.name}</h2>
                  <p className="text-sm text-slate-400">School details and subscribed products</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSchool(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-surface-700 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid gap-6 px-6 py-5 md:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-lg border border-surface-700 bg-surface-900/40 p-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">School Info</h3>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4"><dt className="text-slate-400">Name</dt><dd className="text-white text-right">{selectedSchool.name}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-slate-400">Email</dt><dd className="text-white text-right">{selectedSchool.email}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-slate-400">Phone</dt><dd className="text-white text-right">{selectedSchool.phoneNumber || "N/A"}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-slate-400">State</dt><dd className="text-white text-right">{selectedSchool.state || "N/A"}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-slate-400">Subscription Status</dt><dd className="text-white text-right">{statusLabel.replace("_", " ")}</dd></div>
                      <div className="flex justify-between gap-4"><dt className="text-slate-400">Product Count</dt><dd className="text-white text-right">{productCount}</dd></div>
                    </dl>
                  </div>

                  <div className="rounded-lg border border-surface-700 bg-surface-900/40 p-4">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Address</h3>
                    <p className="text-sm leading-6 text-slate-200">{selectedSchool.address || "N/A"}</p>
                  </div>
                </div>

                <div className="rounded-lg border border-surface-700 bg-surface-900/40 p-4">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">Subscribed Products</h3>
                  {products.length === 0 ? (
                    <p className="text-sm text-slate-400">No subscribed products found for this school.</p>
                  ) : (
                    <div className="space-y-3">
                      {products.map((product) => (
                        <div key={product.id} className="rounded-lg border border-surface-700 bg-surface-800 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="text-white font-medium">{product.productName || "Unnamed Product"}</p>
                              <p className="text-sm text-slate-400">Plan: {product.planType || "N/A"}</p>
                            </div>
                            <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${getStatusColor(product.status === 1 ? "ACTIVE" : "INACTIVE")}`}>
                              {product.status === 1 ? "ACTIVE" : "INACTIVE"}
                            </span>
                          </div>
                          <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
                            <div><span className="text-slate-500">Slots:</span> {product.paidStudentSlots ?? 0}</div>
                            <div><span className="text-slate-500">Expires:</span> {new Date(product.expiryDate).toLocaleDateString()}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default SchoolsManagement;
