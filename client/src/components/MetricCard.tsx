import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: "primary" | "amber" | "blue" | "green";
  delay?: string;
}

export function MetricCard({ label, value, detail, icon: Icon, tone = "primary", delay }: MetricCardProps) {
  const iconTones = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-accent/15 text-accent-foreground",
    blue: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
    green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  };

  return (
    <div className={cn("panel p-5", delay)}>
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <div className={cn("grid h-9 w-9 place-items-center rounded-xl", iconTones[tone])}>
          <Icon size={18} />
        </div>
      </div>
      <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        {detail}
      </div>
    </div>
  );
}
