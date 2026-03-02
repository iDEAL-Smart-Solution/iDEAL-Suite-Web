import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";

interface ExpiryWarningBannerProps {
  expiryDate: string;
}

const ExpiryWarningBanner = ({ expiryDate }: ExpiryWarningBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  const expiryDateObj = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Only show if expires in less than 30 days
  if (daysUntilExpiry > 30 || daysUntilExpiry <= 0 || dismissed) {
    return null;
  }

  const isAlert = daysUntilExpiry <= 7;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-3 p-4 mb-6 rounded-xl border transition-all duration-200",
        isAlert
          ? "bg-red-500/10 border-red-500/20 text-red-400"
          : "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
      )}
    >
      <AlertTriangle size={20} className="flex-shrink-0" />
      <div className="flex-1">
        <strong className="block text-sm font-semibold">
          Your subscription expires in {daysUntilExpiry} day
          {daysUntilExpiry !== 1 ? "s" : ""}
        </strong>
        <p className="text-sm mt-0.5 opacity-80">
          Renew now to avoid interruption.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/5 transition-colors duration-200"
        aria-label="Dismiss warning"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default ExpiryWarningBanner;
