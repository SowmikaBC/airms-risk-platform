import React from "react";
import { Link } from "wouter";
import { User, ChevronRight } from "lucide-react";
import { SeverityBadge } from "./SeverityBadge";
import { TrendIcon } from "./TrendIcon";
import { cn } from "@/lib/utils";
import type { Risk } from "@shared/types";

export function RiskCard({ risk }: { risk: Risk }) {
  return (
    <Link
      href={`/risks/${risk.id}`}
      className="group flex flex-col justify-between gap-4 p-4 transition-all hover:bg-muted/40 sm:flex-row sm:items-center"
    >
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold text-muted-foreground">
            R-{risk.id}
          </span>
          <SeverityBadge value={risk.severity} />
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {risk.category}
          </span>
          <span className="rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
            {risk.status}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {risk.title}
        </h4>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {risk.description}
        </p>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <TrendIcon value={risk.trend} />
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <User size={14} className="text-primary" />
          <span>{risk.owner || "Unassigned"}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-lg font-bold text-foreground">
              {risk.score}
            </div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              Score
            </div>
          </div>
          <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary transition-all" />
        </div>
      </div>
    </Link>
  );
}
