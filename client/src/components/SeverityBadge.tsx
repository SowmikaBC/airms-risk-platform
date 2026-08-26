import React from "react";
import { cn } from "@/lib/utils";
import type { Severity } from "@shared/types";

interface SeverityBadgeProps {
  value: Severity | string;
  className?: string;
}

export function SeverityBadge({ value, className }: SeverityBadgeProps) {
  const norm = (value || "").toLowerCase();

  let colorClasses = "bg-muted text-muted-foreground border-border";
  if (norm === "critical") {
    colorClasses = "bg-destructive/15 text-destructive border-destructive/30";
  } else if (norm === "high") {
    colorClasses = "bg-accent/15 text-accent-foreground border-accent/40";
  } else if (norm === "medium") {
    colorClasses = "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30";
  } else if (norm === "low") {
    colorClasses = "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        colorClasses,
        className
      )}
    >
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        norm === "critical" ? "bg-destructive" :
        norm === "high" ? "bg-accent" :
        norm === "medium" ? "bg-amber-500" : "bg-emerald-500"
      )} />
      {value}
    </span>
  );
}
