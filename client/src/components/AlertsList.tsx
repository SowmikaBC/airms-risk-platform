import React from "react";
import { Link } from "wouter";
import { Bell, Check, AlertCircle } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { formatDate } from "@/lib/utils";
import { useAlerts, useMarkAlertRead } from "@/lib/api";

export function AlertsList() {
  const { data: alerts = [], isLoading } = useAlerts();
  const markRead = useMarkAlertRead();

  if (isLoading) {
    return <div className="p-4 space-y-2">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted/60 rounded-xl animate-pulse" />)}</div>;
  }

  if (alerts.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-muted-foreground">
        No active alerts. All systems nominal.
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`flex items-start justify-between gap-3 p-3.5 transition-colors ${
            alert.isRead ? "opacity-60" : "bg-card/40"
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <SeverityBadge value={alert.severity} />
              <span className="font-mono text-[10px] text-muted-foreground">
                {formatDate(alert.createdAt)}
              </span>
            </div>
            <Link
              href={`/risks/${alert.riskId}`}
              className="text-xs font-semibold text-foreground hover:text-primary transition-colors block"
            >
              {alert.title}
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {alert.message}
            </p>
          </div>

          {!alert.isRead && (
            <button
              onClick={() => markRead.mutate(alert.id)}
              disabled={markRead.isPending}
              title="Mark as read"
              className="mt-1 rounded-md border border-border p-1 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              <Check size={14} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
