import { useEffect } from "react";
import MetricCard from "../../components/ui/MetricCard";
 import { Users, UserCheck, Ticket } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useDashboardStore } from "../../stores/useDashboardStore";
import MetricCardSkeleton from "../../components/ui/MetricCardSkeleton";
import Skeleton from "../../components/ui/Skeleton";
import StudentsGrowthChart from "../../components/charts/StudentsGrowthChart";
import UsageChart from "../../components/charts/UsageChart";
import SubscriptionStatusCard from "../../components/ui/SubscriptionStatusCard";
import SystemStatusCard from "../../components/ui/SystemStatusCard";
import ProductUsageTable from "../../components/ui/ProductUsageTable";
import ExpiryWarningBanner from "../../components/ui/ExpiryWarningBanner";

const DashboardHome = () => {
  const user = useAuthStore((s) => s.user);
  const {
    stats,
    usageData,
    productEngagementMySchool,
    isLoading,
    error,
    fetchStats,
    fetchUinUsage,
    fetchProductEngagementMySchool,
  } = useDashboardStore();

  useEffect(() => {
    if (user?.schoolId) {
      fetchStats(user.schoolId);
      fetchUinUsage();
      fetchProductEngagementMySchool();
    }
  }, [
    user?.schoolId,
    fetchStats,
    fetchUinUsage,
    fetchProductEngagementMySchool,
  ]);

  if (isLoading) {
    return (
      <div>
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

  if (error) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-red-400">No data available</p>;

  const slotsUsagePercent = stats.subscribedSlots
    ? Math.round((stats.totalRegisteredStudents / stats.subscribedSlots) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <ExpiryWarningBanner expiryDate={stats.expiryDate} />

      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-base sm:text-lg md:text-xl font-semibold text-brand-400 mb-2">{stats.schoolName}</p>
        <p className="text-slate-400">Here's a quick overview of your school system.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Total Users" value={stats.totalUsers} icon={<Users size={24} />} />
        <MetricCard title="Staff Members" value={stats.totalStaff} icon={<UserCheck size={24} />} />
        <MetricCard title="Students" value={stats.totalStudents} icon={<Users size={24} />} />
        <MetricCard
          title="Slots Used"
          value={`${stats.totalRegisteredStudents}/${stats.subscribedSlots}`}
          icon={<Ticket size={24} />}
          progress={slotsUsagePercent}
          maxSlots={stats.subscribedSlots}
          usedSlots={stats.totalRegisteredStudents}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionStatusCard
          planType={stats.planType}
          status={stats.subscriptionStatus}
          expiryDate={stats.expiryDate}
          paymentMethod={stats.paymentMethod}
        />
        <SystemStatusCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudentsGrowthChart data={[]} />
        <UsageChart data={usageData} />
      </div>

      <ProductUsageTable
        products={
          productEngagementMySchool.length > 0
            ? productEngagementMySchool
            : (stats.products ?? [])
        }
      />
    </div>
  );
};

export default DashboardHome;
