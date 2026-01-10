import { useEffect, useState } from "react";
import MetricCard from "../../components/ui/MetricCard";
import {
  Users,
  UserCheck,
  Ticket,
} from "lucide-react";
import { getDashboardStats } from "../../services/dashboardService";
import type { DashboardStats } from "../../types/dashboard";
import { useAuth } from "../../context/AuthContext";
import MetricCardSkeleton from "../../components/ui/MetricCardSkeleton";
import Skeleton from "../../components/ui/Skeleton";
import StudentsGrowthChart from "../../components/charts/StudentsGrowthChart";
import UsageChart from "../../components/charts/UsageChart";
import SubscriptionStatusCard from "../../components/ui/SubscriptionStatusCard";
import ProductUsageTable from "../../components/ui/ProductUsageTable";
import ExpiryWarningBanner from "../../components/ui/ExpiryWarningBanner";
import {
  mockStudentGrowth,
  mockUsage,
  mockDashboardStats,
} from "../../mocks/dashboard.mock";

const DashboardHome = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isDemo = localStorage.getItem("token") === "demo-token";

  useEffect(() => {
    //  DEMO MODE  skip API
    if (isDemo) {
      setStats(mockDashboardStats);
      setLoading(false);
      return;
    }

    //  REAL MODE
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isDemo]);

  // Loading skeletons
  if (loading) {
    return (
      <div className="p-8">
        <Skeleton width="250px" height="28px" />
        <Skeleton width="350px" height="16px" style={{ marginTop: "8px" }} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) return <p className="text-red-400 p-8">{error}</p>;

  if (!stats) return <p className="text-red-400 p-8">No data available</p>;

  const slotsUsagePercent = Math.round(
    (stats.totalRegisteredStudents / stats.subscribedSlots) * 100
  );

  return (
    <div className="p-8 space-y-8">
      {/* EXPIRY WARNING */}
      {stats && (
        <ExpiryWarningBanner expiryDate={stats.expiryDate} />
      )}

      {/* WELCOME SECTION */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Welcome back, {user.name}!
        </h1>
        <p className="text-xl font-semibold text-cyan-400 mb-2">
          {stats.schoolName}
        </p>
        <p className="text-slate-400">
          Here's a quick overview of your school system.
        </p>
      </div>

      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} />}
        />

        <MetricCard
          title="Staff Members"
          value={stats.totalStaff}
          icon={<UserCheck size={24} />}
        />

        <MetricCard
          title="Students"
          value={stats.totalStudents}
          icon={<Users size={24} />}
        />

        <MetricCard
          title="Slots Used"
          value={`${stats.totalRegisteredStudents}/${stats.subscribedSlots}`}
          icon={<Ticket size={24} />}
          progress={slotsUsagePercent}
          maxSlots={stats.subscribedSlots}
          usedSlots={stats.totalRegisteredStudents}
        />
      </div>

      {/* SUBSCRIPTION & PRODUCTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SUBSCRIPTION STATUS */}
        <SubscriptionStatusCard
          planType={stats.planType}
          status={stats.subscriptionStatus}
          expiryDate={stats.expiryDate}
          paymentMethod={stats.paymentMethod}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentsGrowthChart
          data={isDemo ? mockStudentGrowth : []}
        />
        <UsageChart
          data={isDemo ? mockUsage : []}
        />
      </div>

      {/* PRODUCTS TABLE */}
      <div>
        <ProductUsageTable products={stats.products} />
      </div>
    </div>
  );
};

export default DashboardHome;
