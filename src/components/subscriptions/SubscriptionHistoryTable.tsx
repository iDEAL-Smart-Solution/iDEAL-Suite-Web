import React from "react";
import type { Subscription } from "../../types/subscription";
import { SubscriptionStatus } from "../../types/subscription";

interface SubscriptionHistoryTableProps {
  subscriptions: Subscription[];
  isLoading?: boolean;
  onViewDetails?: (subscription: Subscription) => void;
}

const getStatusColor = (status: number): string => {
  switch (status) {
    case SubscriptionStatus.Active:
      return "bg-green-500/20 text-green-400";
    case SubscriptionStatus.Pending:
      return "bg-yellow-500/20 text-yellow-400";
    case SubscriptionStatus.Deactivated:
      return "bg-red-500/20 text-red-400";
    default:
      return "bg-slate-500/20 text-slate-400";
  }
};

const getStatusLabel = (status: number): string => {
  switch (status) {
    case SubscriptionStatus.Active:
      return "Active";
    case SubscriptionStatus.Pending:
      return "Pending";
    case SubscriptionStatus.Deactivated:
      return "Deactivated";
    default:
      return "Unknown";
  }
};

const SubscriptionHistoryTable: React.FC<SubscriptionHistoryTableProps> = ({
  subscriptions,
  isLoading = false,
  onViewDetails,
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <div className="text-center text-slate-400">Loading subscription history...</div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8">
        <div className="text-center">
          <p className="text-slate-400">No subscription history found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-700">
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Date Created</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Student Slots</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Start Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Expiry Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-3 text-slate-50">
                  {subscription.createdAt
                    ? new Date(subscription.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3 text-slate-50">{subscription.paidStudentSlots}</td>
                <td className="px-4 py-3 text-slate-50">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-slate-50">
                  {new Date(subscription.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      subscription.status
                    )}`}
                  >
                    {getStatusLabel(subscription.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {onViewDetails && (
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition-colors"
                      onClick={() => onViewDetails(subscription)}
                      title="View details"
                    >
                      View
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionHistoryTable;
