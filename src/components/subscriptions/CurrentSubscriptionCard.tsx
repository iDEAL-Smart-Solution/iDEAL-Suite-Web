import { cn } from "../../lib/utils";
import type { Subscription } from "../../types/subscription";
import { SubscriptionStatus } from "../../types/subscription";

interface CurrentSubscriptionCardProps {
  subscription: Subscription | null;
  usedSlots: number;
  daysRemaining: number;
  onRenew: () => void;
  onUpgrade: () => void;
  onMakePayment?: () => void;
  isLoading?: boolean;
}

const getStatusColor = (
  status: number
): { color: string; label: string; bgClass: string; textClass: string } => {
  switch (status) {
    case SubscriptionStatus.Active:
      return { color: "status-active", label: "Active", bgClass: "bg-green-500/20", textClass: "text-green-400" };
    case SubscriptionStatus.Pending:
      return { color: "status-pending", label: "Pending", bgClass: "bg-yellow-500/20", textClass: "text-yellow-400" };
    case SubscriptionStatus.Deactivated:
      return { color: "status-deactivated", label: "Deactivated", bgClass: "bg-red-500/20", textClass: "text-red-400" };
    default:
      return { color: "", label: "Unknown", bgClass: "bg-slate-500/20", textClass: "text-slate-400" };
  }
};

const CurrentSubscriptionCard = (props: CurrentSubscriptionCardProps) => {
  const { subscription, usedSlots, daysRemaining, onRenew, onUpgrade, onMakePayment, isLoading = false } = props;
  if (isLoading) {
    return (
      <div className="bg-surface-800 rounded-xl p-6 border border-surface-700 shadow-sm">
        <p className="text-slate-400">Loading subscription details...</p>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-surface-800 rounded-xl p-6 border border-surface-700 shadow-sm text-center">
        <p className="text-white font-semibold">No active subscription found.</p>
        <p className="text-slate-400 text-sm mt-2">
          Create a new subscription to get started.
        </p>
      </div>
    );
  }

  const statusInfo = getStatusColor(subscription.status);
  const slotUsagePercent = Math.min(
    100,
    (usedSlots / subscription.paidStudentSlots) * 100
  );
  const isNearCapacity = slotUsagePercent > 90;
  const isExpiringSoon = daysRemaining <= 30 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  const startDate = new Date(subscription.startDate).toLocaleDateString();
  const expiryDate = new Date(subscription.expiryDate).toLocaleDateString();

  return (
    <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-700">
        <h2 className="text-lg font-bold text-white">Current Subscription</h2>
        <div className="flex gap-2">
          {isExpired && <span className="bg-red-500/20 text-red-400 text-xs font-semibold px-3 py-1 rounded-full">Expired</span>}
          {isExpiringSoon && !isExpired && (
            <span className="bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">Expiring Soon</span>
          )}
          {isNearCapacity && !isExpired && (
            <span className="bg-brand-500/20 text-brand-400 text-xs font-semibold px-3 py-1 rounded-full">Nearly Full</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Plan Type:</span>
          <span className="bg-brand-500/15 text-brand-400 text-sm font-semibold px-3 py-1 rounded-md">
            {subscription.planType || "Local"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Status:</span>
          <span className={cn("text-sm font-semibold px-3 py-1 rounded-md", statusInfo.bgClass, statusInfo.textClass)}>
            {statusInfo.label}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Student Slots:</span>
          <span className="text-white font-semibold">{subscription.paidStudentSlots}</span>
        </div>

        <div className="py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 text-sm">Used Slots:</span>
            <span className="text-white text-sm font-semibold">
              {usedSlots} / {subscription.paidStudentSlots} (
              {slotUsagePercent.toFixed(1)}%)
            </span>
          </div>
          <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-200",
                isNearCapacity ? "bg-red-500" : "bg-emerald-500"
              )}
              style={{ width: `${slotUsagePercent}%` }}
            ></div>
          </div>
          {isNearCapacity && (
            <p className="text-red-400 text-xs mt-2">
              Almost full! Consider upgrading.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Start Date:</span>
          <span className="text-white">{startDate}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Expiry Date:</span>
          <span className={cn(isExpiringSoon || isExpired ? "text-red-400 font-semibold" : "text-white")}>
            {expiryDate}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Days Remaining:</span>
          <span className={cn("font-semibold", isExpired ? "text-red-400" : "text-white")}>
            {isExpired ? "Expired" : daysRemaining + " days"}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 text-sm">Payment Method:</span>
          <span className="text-white">{subscription.paymentMethod}</span>
        </div>
      </div>

      {isExpired && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">Your subscription has expired. Please renew to continue.</p>
        </div>
      )}

      {isExpiringSoon && !isExpired && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm">
            Your subscription will expire in {daysRemaining} days. Renew now to
            avoid service interruption.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-6">
        {onMakePayment && subscription.status === 2 && (
          <button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 min-w-[140px]"
            onClick={onMakePayment}
            disabled={isLoading}
          >
            💳 Make Payment
          </button>
        )}
        <button
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 min-w-[140px]"
          onClick={onRenew}
          disabled={isLoading}
        >
          Renew Subscription
        </button>
        <button
          className="flex-1 bg-surface-700 hover:bg-surface-600 text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 min-w-[140px]"
          onClick={onUpgrade}
          disabled={isLoading}
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default CurrentSubscriptionCard;
