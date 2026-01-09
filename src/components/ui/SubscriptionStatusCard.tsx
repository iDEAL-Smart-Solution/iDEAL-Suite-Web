import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface SubscriptionStatusCardProps {
  planType: "Local" | "Remote";
  status: "Active" | "Pending" | "Deactivated";
  expiryDate: string;
  paymentMethod: string;
}

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

  const getStatusColor = (s: string) => {
    switch (s) {
      case "Active":
        return "#10b981";
      case "Pending":
        return "#f59e0b";
      case "Deactivated":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (s: string) => {
    switch (s) {
      case "Active":
        return <CheckCircle size={20} style={{ color: getStatusColor(s) }} />;
      case "Pending":
        return <Clock size={20} style={{ color: getStatusColor(s) }} />;
      case "Deactivated":
        return <AlertCircle size={20} style={{ color: getStatusColor(s) }} />;
      default:
        return null;
    }
  };

  const isExpiringWarning = daysUntilExpiry <= 30 && daysUntilExpiry > 7;
  const isExpiringAlert = daysUntilExpiry <= 7 && daysUntilExpiry > 0;

  return (
    <div className="subscription-status-card">
      <div className="subscription-header">
        <h3>Subscription Status</h3>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor:
                planType === "Local" ? "#dbeafe" : "#e9d5ff",
              color: planType === "Local" ? "#1e40af" : "#6b21a8",
            }}
          >
            {planType}
          </span>
        </div>
      </div>

      <div className="subscription-body">
        <div className="subscription-row">
          <span className="label">Status:</span>
          <span style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {getStatusIcon(status)}
            <strong>{status}</strong>
          </span>
        </div>

        <div className="subscription-row">
          <span className="label">Expires:</span>
          <span>
            {expiryDateObj.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {isExpiringAlert && (
              <span
                style={{
                  marginLeft: "8px",
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Expires in {daysUntilExpiry} days
              </span>
            )}
            {isExpiringWarning && (
              <span
                style={{
                  marginLeft: "8px",
                  display: "inline-block",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor: "#fef3c7",
                  color: "#92400e",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                Expiring Soon
              </span>
            )}
          </span>
        </div>

        <div className="subscription-row">
          <span className="label">Payment Method:</span>
          <span>{paymentMethod}</span>
        </div>
      </div>

      {isExpiringWarning || isExpiringAlert ? (
        <button className="renew-btn">Renew Subscription</button>
      ) : null}
    </div>
  );
};

export default SubscriptionStatusCard;
