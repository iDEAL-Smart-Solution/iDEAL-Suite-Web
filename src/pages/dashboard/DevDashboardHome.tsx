import { useEffect, useState } from "react";
import { Building2, CheckCircle, Users, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useSchoolStore } from "../../stores/useSchoolStore";
import { useStudentStore } from "../../stores/useStudentStore";
import { useSubscriptionStore } from "../../stores/useSubscriptionStore";
import { useDashboardStore } from "../../stores/useDashboardStore";
import MetricCard from "../../components/ui/MetricCard";
import MetricCardSkeleton from "../../components/ui/MetricCardSkeleton";
import SystemStatusCard from "../../components/ui/SystemStatusCard";

const DevDashboardHome = () => {
  const user = useAuthStore((s) => s.user);
  const { schools, isLoading: schoolsLoading, fetchAllSchools } = useSchoolStore();
  const { totalStudents, isLoading: studentsLoading, fetchAllStudents } = useStudentStore();
  const { subscriptionHistory, isLoading: subsLoading, fetchReportingSubscriptions } = useSubscriptionStore();
  const { productEngagementAll, fetchProductEngagementAll } = useDashboardStore();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 17) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  useEffect(() => {
    fetchAllSchools();
    fetchAllStudents();
    fetchReportingSubscriptions();
    fetchProductEngagementAll();
  }, [
    fetchAllSchools,
    fetchAllStudents,
    fetchReportingSubscriptions,
    fetchProductEngagementAll,
  ]);

  const isLoading = schoolsLoading || studentsLoading || subsLoading;
  const activeSchools = schools.filter((s) => s.subscriptionStatus === "ACTIVE").length;
  const totalProductEngagements = productEngagementAll.reduce(
    (sum, product) => sum + product.usageCount,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {greeting}, {user?.fullName || "Developer"} 👋
        </h1>
        <p className="text-slate-400">Here's an overview of the iDEAL Suite platform</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <MetricCardSkeleton key={i} />)
        ) : (
          <>
            <MetricCard title="Total Schools" value={schools.length} icon={<Building2 size={24} />} />
            <MetricCard title="Active Schools" value={activeSchools} icon={<CheckCircle size={24} />} />
            <MetricCard title="Total Students" value={totalStudents} icon={<Users size={24} />} />
            <MetricCard
              title="Product Engagements"
              value={totalProductEngagements}
              icon={<AlertTriangle size={24} />}
            />
          </>
        )}
      </div>

      <SystemStatusCard />

      <div className="bg-surface-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Schools</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-4 border-surface-700 border-t-brand-500 rounded-full animate-spin" />
          </div>
        ) : schools.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No schools registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-surface-700">
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">School Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">State</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-300 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700">
                {schools.slice(0, 5).map((school) => (
                  <tr key={school.id} className="hover:bg-surface-700/30">
                    <td className="px-4 py-3 text-white">{school.name}</td>
                    <td className="px-4 py-3 text-slate-300">{school.email}</td>
                    <td className="px-4 py-3 text-slate-300">{school.state}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-md ${school.subscriptionStatus === "ACTIVE" ? "text-green-400 bg-green-900/20" : "text-yellow-400 bg-yellow-900/20"}`}>
                        {school.subscriptionStatus || "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {subscriptionHistory.length > 0 && (
        <div className="bg-yellow-900/10 border border-yellow-500/30 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">⚠️ Expiring Subscriptions</h2>
          <div className="space-y-3">
            {subscriptionHistory.map((sub) => (
              <div key={sub.id} className="flex justify-between items-center bg-surface-800 p-4 rounded-lg">
                <div>
                  <p className="text-white font-medium">{sub.schoolId || "Unknown School"}</p>
                  <p className="text-slate-400 text-sm">Expires: {new Date(sub.expiryDate).toLocaleDateString()}</p>
                </div>
                <span className="text-yellow-400 text-sm font-medium">{sub.status === 1 ? "Active" : sub.status === 2 ? "Pending" : "Deactivated"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DevDashboardHome;
