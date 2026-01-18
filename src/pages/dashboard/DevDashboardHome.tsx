import { useState, useEffect } from "react";
import MetricCard from "../../components/ui/MetricCard";
import { Building2, CreditCard, Package, DollarSign, Users } from "lucide-react";
import MetricCardSkeleton from "../../components/ui/MetricCardSkeleton";

const DevDashboardHome = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSubscriptions: 0,
    totalProducts: 0,
    monthlyRevenue: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setStats({
        totalSchools: 127,
        activeSubscriptions: 119,
        totalProducts: 8,
        monthlyRevenue: 45320,
        totalUsers: 3240,
      });
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Platform Overview
        </h1>
        <p className="text-slate-400">
          Manage all schools, subscriptions, and products across the iDEAL platform.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Schools"
          value={stats.totalSchools}
          icon={<Building2 size={24} />}
        />

        <MetricCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          icon={<CreditCard size={24} />}
        />

        <MetricCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={24} />}
        />

        <MetricCard
          title="Monthly Revenue"
          value={`$${stats.monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
        />

        <MetricCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={24} />}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="px-4 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
            Add New School
          </button>
          <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
            Manage Subscriptions
          </button>
          <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
            Create Product
          </button>
          <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
            View Reports
          </button>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
        <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300">API: Operational</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300">Database: Online</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-slate-300">Services: Running</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-slate-300">Last Check: 2 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevDashboardHome;
