import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";
import PageHeader from "../../components/layout/PageHeader";

const SubscriptionsManagement = () => {
  const { subscriptionHistory, isLoading, error, fetchReportingSubscriptions } = useSubscriptionStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReportingSubscriptions();
  }, [fetchReportingSubscriptions]);

  const filteredSubscriptions = subscriptionHistory.filter(
    (sub) =>
      (sub.planType || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(sub.schoolId || "").includes(searchTerm)
  );

  const getStatusColor = (status?: number) => {
    switch (status) {
      case 1: return "text-green-400 bg-green-900/20";
      case 3: return "text-red-400 bg-red-900/20";
      case 2: return "text-yellow-400 bg-yellow-900/20";
      default: return "text-slate-400 bg-surface-800";
    }
  };

  const getStatusLabel = (status?: number) => {
    switch (status) {
      case 1: return "Active";
      case 2: return "Pending";
      case 3: return "Deactivated";
      default: return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions Management"
        subtitle="Manage all school subscriptions across the platform"
      />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by plan or school..."
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
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Plan</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">School</th>
              <th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Start Date</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Expiry Date</th>
              <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Status</th>
              <th className="hidden md:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Student Slots</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-400">Loading subscriptions...</td></tr>
            ) : filteredSubscriptions.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-4 text-center text-slate-400">No subscriptions found</td></tr>
            ) : (
              filteredSubscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-surface-700/50 transition-colors">
                  <td className="px-3 sm:px-6 py-4 text-white font-medium">{sub.planType || "N/A"}</td>
                  <td className="px-3 sm:px-6 py-4 text-slate-300">{sub.schoolId}</td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-slate-300">{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : "N/A"}</td>
                  <td className="px-3 sm:px-6 py-4 text-slate-300">{sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString() : "N/A"}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(sub.status)}`}>
                      {getStatusLabel(sub.status)}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-3 sm:px-6 py-4 text-slate-300">{sub.paidStudentSlots ?? 0}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsManagement;
