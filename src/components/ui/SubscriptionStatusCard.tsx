import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { cn } from "../../lib/utils";

interface SubscriptionStatusCardProps {
  planType: "Local" | "Remote";
  status: "Active" | "Pending" | "Deactivated";
  expiryDate: string;
  paymentMethod: string;
}

const statusConfig = {
  Active: { icon: CheckCircle, color: "text-emerald-400" },
  Pending: { icon: Clock, color: "text-yellow-400" },
  Deactivated: { icon: AlertCircle, color: "text-red-400" },
} as const;

const SubscriptionStatusCard = ({
  planType,
  status,
  expiryDate,
  paymentMethod,
}: SubscriptionStatusCardProps) => {
  const expiryDateObj = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const { icon: StatusIcon, color: statusColor } = statusConfig[status] ?? {
    icon: AlertCircle,
    color: "text-slate-400",
  };

  const isExpiringWarning = daysUntilExpiry <= 30 && daysUntilExpiry > 7;
  const isExpiringAlert = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div className="bg-surface-800 border border-surface-700 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-700">
        <h3 className="text-lg font-semibold text-white">Subscription Status</h3>
        <span
          className={cn(
            "inline-flex items-center px-3 py-1 rounded-md text-xs font-semibold",
            planType === "Local"
              ? "bg-brand-500/10 text-brand-400"
              : "bg-purple-500/10 text-purple-400"
          )}
        >
          {planType}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-400">Status</span>
          <span className="flex gap-2 items-center">
            <StatusIcon size={18} className={statusColor} />
            <strong className="text-sm text-white">{status}</strong>
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-400">Expires</span>
          <span className="flex items-center gap-2">
            <span className="text-sm text-white">
              {expiryDateObj.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            {isExpiringAlert && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-red-500/10 text-red-400">
                {daysUntilExpiry}d left
              </span>
            )}
            {isExpiringWarning && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-yellow-500/10 text-yellow-400">
                Expiring Soon
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-slate-400">Payment Method</span>
          <span className="text-sm text-white">{paymentMethod}</span>
        </div>
      </div>

      {(isExpiringWarning || isExpiringAlert) && (
        <button className="mt-6 w-full h-10 bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm rounded-lg transition-colors duration-200">
          Renew Subscription
        </button>
      )}
    </div>
  );
};

export default SubscriptionStatusCard;
