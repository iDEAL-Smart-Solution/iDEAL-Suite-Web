import React from "react";
import { Activity, Database, Globe, Server, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

interface SystemStatusCardProps {
  className?: string;
}

type ServiceStatus = "operational" | "degraded" | "down";

interface ServiceItem {
  name: string;
  status: ServiceStatus;
  icon: React.ReactNode;
  responseTime?: string;
}

const getStatusColor = (status: ServiceStatus) => {
  switch (status) {
    case "operational":
      return "text-green-400 bg-green-500/20";
    case "degraded":
      return "text-yellow-400 bg-yellow-500/20";
    case "down":
      return "text-red-400 bg-red-500/20";
  }
};

const getStatusIcon = (status: ServiceStatus) => {
  switch (status) {
    case "operational":
      return <CheckCircle2 className="w-4 h-4" />;
    case "degraded":
      return <AlertCircle className="w-4 h-4" />;
    case "down":
      return <XCircle className="w-4 h-4" />;
  }
};

const getStatusLabel = (status: ServiceStatus) => {
  switch (status) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "down":
      return "Down";
  }
};

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ className }) => {
  // In a real app, this would come from actual health check endpoints
  const services: ServiceItem[] = [
    {
      name: "API Service",
      status: "operational",
      icon: <Server className="w-5 h-5" />,
      responseTime: "45ms",
    },
    {
      name: "Database",
      status: "operational",
      icon: <Database className="w-5 h-5" />,
      responseTime: "12ms",
    },
    {
      name: "Payment Gateway",
      status: "operational",
      icon: <Globe className="w-5 h-5" />,
      responseTime: "120ms",
    },
  ];

  const allOperational = services.every((s) => s.status === "operational");
  const overallStatus: ServiceStatus = allOperational
    ? "operational"
    : services.some((s) => s.status === "down")
      ? "degraded"
      : "degraded";

  return (
    <div
      className={cn(
        "bg-surface-800 border border-surface-700 rounded-xl p-6 shadow-sm",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-surface-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-brand-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">System Status</h2>
            <p className="text-xs text-slate-400">Real-time service monitoring</p>
          </div>
        </div>
        <div
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5",
            getStatusColor(overallStatus)
          )}
        >
          {getStatusIcon(overallStatus)}
          {getStatusLabel(overallStatus)}
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-3">
        {services.map((service, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-surface-900/50 hover:bg-surface-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="text-slate-400">{service.icon}</div>
              <div>
                <p className="text-sm font-medium text-white">{service.name}</p>
                {service.responseTime && (
                  <p className="text-xs text-slate-500">
                    Response: {service.responseTime}
                  </p>
                )}
              </div>
            </div>
            <div
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1",
                getStatusColor(service.status)
              )}
            >
              {getStatusIcon(service.status)}
              {getStatusLabel(service.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-surface-700">
        <p className="text-xs text-slate-500 text-center">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default SystemStatusCard;
