import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";

interface School {
  id: string;
  name: string;
  contactEmail: string;
  totalStudents: number;
  subscriptionStatus: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED" | "INACTIVE";
  planType: string;
  joinedDate: string;
}

const SchoolsManagement = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setSchools([
        {
          id: "1",
          name: "Springfield High School",
          contactEmail: "admin@springfield.edu",
          totalStudents: 1200,
          subscriptionStatus: "ACTIVE",
          planType: "ENTERPRISE",
          joinedDate: "2024-01-15",
        },
        {
          id: "2",
          name: "Riverside Academy",
          contactEmail: "contact@riverside.edu",
          totalStudents: 450,
          subscriptionStatus: "ACTIVE",
          planType: "PROFESSIONAL",
          joinedDate: "2024-03-20",
        },
        {
          id: "3",
          name: "Greenwood School",
          contactEmail: "info@greenwood.edu",
          totalStudents: 280,
          subscriptionStatus: "EXPIRING_SOON",
          planType: "STARTER",
          joinedDate: "2023-11-10",
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const filteredSchools = schools.filter(
    (school) =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-900/20";
      case "EXPIRING_SOON":
        return "text-yellow-400 bg-yellow-900/20";
      case "EXPIRED":
      case "INACTIVE":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-slate-400 bg-slate-800";
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Schools Management</h1>
          <p className="text-slate-400">Manage all schools subscribed to iDEAL services</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
          <Plus size={20} />
          Add School
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search schools by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-600"
          />
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                School Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Contact Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Students
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-slate-400">
                  Loading schools...
                </td>
              </tr>
            ) : filteredSchools.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-slate-400">
                  No schools found
                </td>
              </tr>
            ) : (
              filteredSchools.map((school) => (
                <tr key={school.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{school.name}</td>
                  <td className="px-6 py-4 text-slate-300">{school.contactEmail}</td>
                  <td className="px-6 py-4 text-slate-300">{school.totalStudents}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-medium text-cyan-400 bg-cyan-900/20 rounded">
                      {school.planType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(school.subscriptionStatus)}`}>
                      {school.subscriptionStatus.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-300">
                    {new Date(school.joinedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-cyan-400 hover:bg-cyan-900/20 rounded transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-400 hover:bg-red-900/20 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchoolsManagement;
