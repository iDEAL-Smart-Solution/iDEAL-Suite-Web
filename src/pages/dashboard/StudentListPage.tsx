import { useEffect, useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { useStudentStore } from "../../stores/useStudentStore";
import StudentTable from "../../components/ui/StudentTable";
import PageHeader from "../../components/layout/PageHeader";

const StudentListPage = () => {
  const { displayStudents, isLoading, error, fetchDisplayStudents, clearMessages } = useStudentStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDisplayStudents();
  }, [fetchDisplayStudents]);

  const filteredStudents = displayStudents.filter(
    (student) =>
      (student.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.uin || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.schoolName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRefresh = () => {
    clearMessages();
    fetchDisplayStudents();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Student Management"
        subtitle="View and manage all students across the system"
      />

      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email, UIN, or school..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-surface-800 border border-surface-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20 transition-all duration-200"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="w-full sm:w-auto p-2.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 rounded-lg border border-brand-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          title="Refresh student list"
        >
          <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex items-start gap-3">
          <div className="flex-1">
            <p className="font-medium mb-1">Error Loading Students</p>
            <p className="text-sm text-red-400/90">{error}</p>
          </div>
          <button
            onClick={clearMessages}
            className="text-red-400 hover:text-red-300 text-sm font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Stats */}
      {!isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-surface-800 border border-surface-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total Students</p>
            <p className="text-2xl font-bold text-white">{displayStudents.length}</p>
          </div>
          <div className="bg-surface-800 border border-surface-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Filtered Results</p>
            <p className="text-2xl font-bold text-white">{filteredStudents.length}</p>
          </div>
          <div className="bg-surface-800 border border-surface-700 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Search Status</p>
            <p className="text-lg font-semibold text-brand-400">
              {searchTerm ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <StudentTable students={filteredStudents} isLoading={isLoading} />

      {/* Footer Info */}
      {!isLoading && filteredStudents.length > 0 && (
        <div className="text-center text-slate-400 text-sm">
          Showing {filteredStudents.length} of {displayStudents.length} students
        </div>
      )}
    </div>
  );
};

export default StudentListPage;
