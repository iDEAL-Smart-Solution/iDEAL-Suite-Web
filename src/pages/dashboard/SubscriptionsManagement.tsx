import { useState, useEffect } from "react";
import { AlertCircle, ArrowUpCircle } from "lucide-react";

interface Subscription {
  id: string;
  schoolName: string;
  schoolId: string;
  planType: "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
  status: "ACTIVE" | "EXPIRING_SOON" | "EXPIRED";
  startDate: string;
  expiryDate: string;
  monthlyPrice: number;
  maxSlots: number;
  usedSlots: number;
}

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with API call
    setTimeout(() => {
      setSubscriptions([
        {
          id: "1",
          schoolName: "Springfield High School",
          schoolId: "school-001",
          planType: "ENTERPRISE",
          status: "ACTIVE",
          startDate: "2024-01-15",
          expiryDate: "2025-01-15",
          monthlyPrice: 499,
          maxSlots: 2000,
          usedSlots: 1200,
        },
        {
          id: "2",
          schoolName: "Riverside Academy",
          schoolId: "school-002",
          planType: "PROFESSIONAL",
          status: "ACTIVE",
          startDate: "2024-03-20",
          expiryDate: "2025-03-20",
          monthlyPrice: 299,
          maxSlots: 500,
          usedSlots: 450,
        },
        {
          id: "3",
          schoolName: "Greenwood School",
          schoolId: "school-003",
          planType: "STARTER",
          status: "EXPIRING_SOON",
          startDate: "2023-11-10",
          expiryDate: "2025-02-10",
          monthlyPrice: 149,
          maxSlots: 300,
          usedSlots: 280,
        },
      ]);
      setLoading(false);
    }, 600);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-400 bg-green-900/20";
      case "EXPIRING_SOON":
        return "text-yellow-400 bg-yellow-900/20";
      case "EXPIRED":
        return "text-red-400 bg-red-900/20";
      default:
        return "text-slate-400 bg-slate-800";
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "ENTERPRISE":
        return "text-purple-400 bg-purple-900/20";
      case "PROFESSIONAL":
        return "text-cyan-400 bg-cyan-900/20";
      case "STARTER":
        return "text-blue-400 bg-blue-900/20";
      default:
        return "text-slate-400 bg-slate-800";
    }
  };

  const calculateUsagePercent = (used: number, max: number) => {
    return Math.round((used / max) * 100);
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-slate-400">Loading subscriptions...</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Subscriptions Management</h1>
        <p className="text-slate-400">Manage school subscriptions and upgrade plans</p>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {subscriptions.map((sub) => {
          const usagePercent = calculateUsagePercent(sub.usedSlots, sub.maxSlots);
          const daysUntilExpiry = Math.ceil(
            (new Date(sub.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={sub.id}
              className="bg-slate-900 rounded-lg p-6 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              {/* School Name */}
              <h3 className="text-xl font-bold text-white mb-2">{sub.schoolName}</h3>
              
              {/* Status Alert */}
              {sub.status === "EXPIRING_SOON" && (
                <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                  <AlertCircle size={16} className="text-yellow-400" />
                  <p className="text-sm text-yellow-400">Expires in {daysUntilExpiry} days</p>
                </div>
              )}

              {/* Plan & Status */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 text-sm font-medium rounded ${getPlanColor(sub.planType)}`}>
                  {sub.planType}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded ${getStatusColor(sub.status)}`}>
                  {sub.status.replace("_", " ")}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Price:</span>
                  <span className="text-white font-medium">${sub.monthlyPrice}/month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Start Date:</span>
                  <span className="text-white">{new Date(sub.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Expiry Date:</span>
                  <span className="text-white">{new Date(sub.expiryDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Slot Usage */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Slots Used:</span>
                  <span className="text-white font-medium">
                    {sub.usedSlots} / {sub.maxSlots} ({usagePercent}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      usagePercent >= 90
                        ? "bg-red-500"
                        : usagePercent >= 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${usagePercent}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm">
                  <ArrowUpCircle size={16} />
                  Upgrade Plan
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm">
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubscriptionsManagement;
