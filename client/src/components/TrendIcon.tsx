import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Trend } from "@shared/types";

export function TrendIcon({ value }: { value: Trend | string }) {
  const norm = (value || "").toLowerCase();
  if (norm === "increasing") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-destructive">
        <TrendingUp size={14} strokeWidth={2.2} />
        Increasing
      </span>
    );
  }
  if (norm === "decreasing") {
    return (
      <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <TrendingDown size={14} strokeWidth={2.2} />
        Decreasing
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-muted-foreground">
      <Minus size={14} strokeWidth={2.2} />
      Stable
    </span>
  );
}
