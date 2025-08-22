"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  AlertCircle,
  Activity,
  Zap,
} from "lucide-react";
import { DataStreamStatus } from "@/lib/realtime/dataManager";
import {
  useSafeTimeFormat,
  useRelativeTime,
} from "@/lib/hooks/useSafeTimeFormat";
import { cn } from "@/lib/utils";

interface RealTimeStatusProps {
  status: DataStreamStatus;
  onRefresh?: () => void;
  showDetails?: boolean;
  className?: string;
}

export function RealTimeStatus({
  status,
  onRefresh,
  showDetails = false,
  className,
}: RealTimeStatusProps) {
  const isConnected = status.isConnected;
  const hasErrors = status.errors.length > 0;

  // Use safe time formatting to avoid hydration mismatch
  const formattedTime = useSafeTimeFormat(status.lastUpdate, "en-IN");
  const relativeTime = useRelativeTime(status.lastUpdate);

  const getStatusColor = () => {
    if (!isConnected) return "destructive";
    if (hasErrors) return "secondary";
    return "default";
  };

  const getStatusIcon = () => {
    if (!isConnected) return <WifiOff className="h-3 w-3" />;
    if (hasErrors) return <AlertCircle className="h-3 w-3" />;
    return <Wifi className="h-3 w-3" />;
  };

  const getStatusText = () => {
    if (!isConnected) return "Disconnected";
    if (hasErrors) return "Connected (with issues)";
    return "Connected";
  };

  const formatLatency = (latency: number) => {
    if (latency < 100) return "Excellent";
    if (latency < 300) return "Good";
    if (latency < 500) return "Fair";
    return "Slow";
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return "text-green-600";
    if (latency < 300) return "text-yellow-600";
    if (latency < 500) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative group">
        <Badge
          variant={getStatusColor()}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 cursor-pointer transition-all",
            isConnected
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-red-100 text-red-800 border-red-200",
            hasErrors &&
              isConnected &&
              "bg-yellow-100 text-yellow-800 border-yellow-200"
          )}
        >
          {getStatusIcon()}
          <span className="text-xs font-medium">{getStatusText()}</span>
        </Badge>

        {/* Custom tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 min-w-max">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3" />
              <span>Status: {getStatusText()}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>Last: {formattedTime || relativeTime || "Loading..."}</span>
            </div>

            {status.latency > 0 && (
              <div className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                <span className={getLatencyColor(status.latency)}>
                  {status.latency}ms ({formatLatency(status.latency)})
                </span>
              </div>
            )}

            {status.retryCount > 0 && (
              <div className="text-orange-400">
                Retrying... ({status.retryCount}/3)
              </div>
            )}

            {hasErrors && (
              <div className="border-t border-gray-700 pt-1 mt-1">
                <div className="text-red-400 font-medium text-xs">
                  Recent errors:
                </div>
                {status.errors.slice(-1).map((error, index) => (
                  <div
                    key={index}
                    className="text-xs text-red-300 mt-1 max-w-48 truncate"
                  >
                    {error}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {showDetails && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>•</span>
          <span>{status.latency}ms</span>
          <span>•</span>
          <span>{formattedTime || relativeTime || "Loading..."}</span>
        </div>
      )}

      {onRefresh && (
        <div className="relative group">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            Refresh data
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Pulse animation component for live data indicators
export function LiveDataPulse({
  isActive,
  children,
  className,
}: {
  isActive: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      {children}
      {isActive && (
        <div className="absolute -top-1 -right-1">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
          <div className="absolute inset-0 h-2 w-2 bg-green-400 rounded-full animate-ping opacity-75" />
        </div>
      )}
    </div>
  );
}

// Real-time data freshness indicator
export function DataFreshness({
  lastUpdate,
  maxAge = 30000,
}: {
  lastUpdate: Date;
  maxAge?: number;
}) {
  const [age, setAge] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAge(Date.now() - lastUpdate.getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  const formatAge = (ageMs: number) => {
    const seconds = Math.floor(ageMs / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  const getFreshnessColor = () => {
    if (age < 10000) return "text-green-600";
    if (age < maxAge) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className={cn("text-xs", getFreshnessColor())}>{formatAge(age)}</div>
  );
}
