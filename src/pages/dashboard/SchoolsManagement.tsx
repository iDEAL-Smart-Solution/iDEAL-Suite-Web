import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { useSchoolStore } from "../../stores/useSchoolStore";
import AddSchoolModal from "../../components/schools/AddSchoolModal";
import PageHeader from "../../components/layout/PageHeader";

const SchoolsManagement = () => {
  const { schools, isLoading, error, fetchAllSchools } = useSchoolStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  useEffect(() => {
    fetchAllSchools();
  }, [fetchAllSchools]);

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-surface-700/50 transition-colors">
                  <td className="px-3 sm:px-6 py-4 text-white font-medium">{school.name}</td>
                  <td className="px-3 sm:px-6 py-4 text-slate-300">{school.email}</td>
                  <td className="hidden sm:table-cell px-3 sm:px-6 py-4 text-slate-300">{school.state}</td>
                  <td className="px-3 sm:px-6 py-4">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-md ${getStatusColor(school.subscriptionStatus)}`}>
                      {school.subscriptionStatus?.replace("_", " ") || "N/A"}
                    </span>
                  </td>
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
              ))
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
    </div>
  );
};

export default SchoolsManagement;
