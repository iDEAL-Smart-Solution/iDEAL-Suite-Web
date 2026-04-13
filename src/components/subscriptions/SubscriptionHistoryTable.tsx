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
      <div className="bg-surface-800 rounded-xl border border-surface-700 p-4 md:p-6 shadow-sm">
        <div className="text-center text-slate-400">Loading subscription history...</div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-surface-800 rounded-xl border border-surface-700 p-4 md:p-6 shadow-sm">
        <div className="text-center">
          <p className="text-slate-400">No subscription history found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-800 rounded-xl border border-surface-700 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[580px]">
          <thead>
            <tr className="bg-surface-900 border-b border-surface-700">
              <th className="hidden sm:table-cell px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Date Created</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Student Slots</th>
              <th className="hidden md:table-cell px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Start Date</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Expiry Date</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
              <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="border-b border-surface-700 hover:bg-surface-700/50 transition-colors duration-200">
                <td className="hidden sm:table-cell px-3 sm:px-4 py-3 text-white">
                  {subscription.createdAt
                    ? new Date(subscription.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-3 sm:px-4 py-3 text-white">{subscription.paidStudentSlots}</td>
                <td className="hidden md:table-cell px-3 sm:px-4 py-3 text-white">
                  {new Date(subscription.startDate).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-4 py-3 text-white">
                  {new Date(subscription.expiryDate).toLocaleDateString()}
                </td>
                <td className="px-3 sm:px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${getStatusColor(
                      subscription.status
                    )}`}
                  >
                    {getStatusLabel(subscription.status)}
                  </span>
                </td>
                <td className="px-3 sm:px-4 py-3">
                  {onViewDetails && (
                    <button
                      className="bg-brand-500 hover:bg-brand-600 text-white font-semibold py-1 px-3 rounded-lg text-sm transition-colors duration-200"
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
