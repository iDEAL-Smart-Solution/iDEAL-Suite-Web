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

  //  Loading skeletons
  if (loading) {
    return (
      <div>
        <Skeleton width="250px" height="28px" />
        <Skeleton width="350px" height="16px" style={{ marginTop: "8px" }} />

        <div className="metrics-grid" style={{ marginTop: "24px" }}>
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </div>
    );
  }

  //  Error state
  if (error) return <p className="error">{error}</p>;

  if (!stats) return <p className="error">No data available</p>;

  const slotsUsagePercent = Math.round(
    (stats.totalRegisteredStudents / stats.subscribedSlots) * 100
  );

  return (
    <div className="dashboard-home">
      {/*  EXPIRY WARNING */}
      {stats && (
        <ExpiryWarningBanner expiryDate={stats.expiryDate} />
      )}

      {/*  WELCOME SECTION */}
      <div className="welcome-section">
        <h2>Welcome back, {user.name}! </h2>
        <p className="school-name">{stats.schoolName}</p>
        <p className="muted">
          Here's a quick overview of your school system.
        </p>
      </div>

      {/*  METRICS GRID */}
      <div className="metrics-grid">
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

      {/*  SUBSCRIPTION & PRODUCTS SECTION */}
      <div className="dashboard-grid" style={{ marginTop: "32px" }}>
        {/* SUBSCRIPTION STATUS */}
        <SubscriptionStatusCard
          planType={stats.planType}
          status={stats.subscriptionStatus}
          expiryDate={stats.expiryDate}
          paymentMethod={stats.paymentMethod}
        />
      </div>

      {/*  CHARTS */}
      <div className="dashboard-grid" style={{ marginTop: "32px" }}>
        <StudentsGrowthChart
          data={isDemo ? mockStudentGrowth : []}
        />
        <UsageChart
          data={isDemo ? mockUsage : []}
        />
      </div>

      {/*  PRODUCTS TABLE */}
      <div style={{ marginTop: "32px" }}>
        <ProductUsageTable products={stats.products} />
      </div>
    </div>
  );
};

export default DashboardHome;
