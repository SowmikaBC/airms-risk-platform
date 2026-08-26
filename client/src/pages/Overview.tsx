import React from "react";
import { Link } from "wouter";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  Radar, 
  ArrowUpRight,
  Bell
} from "lucide-react";
import { useDashboardSummary, useDashboardTrends, useRisks } from "@/lib/api";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { RiskTrendChart } from "@/components/RiskTrendChart";
import { AlertsList } from "@/components/AlertsList";
import { RiskCard } from "@/components/RiskCard";
import { formatFullDate } from "@/lib/utils";

export function Overview() {
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: trends, isLoading: isTrendsLoading } = useDashboardTrends();
  const { data: risks = [], isLoading: isRisksLoading } = useRisks();

  const today = formatFullDate(new Date().toISOString());

  const s = summary || {
    totalRisks: 24,
    criticalRisks: 3,
    highRisks: 7,
    mediumRisks: 9,
    lowRisks: 5,
    resolvedRisks: 12,
    activeRisks: 12,
    increasingRisks: 5,
    topCategory: "Delivery",
    averageScore: 58.4,
  };

  const topRisks = risks.slice(0, 4);

  return (
    <div className="space-y-8 airms-rise">
      {/* Greeting Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">{today}</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Good morning, risk control.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            A clear view of what needs attention now, and what can wait.
          </p>
        </div>
        <Link
          href="/detect"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow"
        >
          <Radar size={15} />
          Run new detection
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Active risks"
          value={s.activeRisks}
          detail={`${s.totalRisks} total in register`}
          icon={ShieldAlert}
          tone="primary"
        />
        <MetricCard
          label="Critical exposure"
          value={s.criticalRisks}
          detail={`${s.highRisks} high-severity risks`}
          icon={AlertTriangle}
          tone="amber"
        />
        <MetricCard
          label="Average score"
          value={s.averageScore.toFixed(1)}
          detail={`${s.increasingRisks} signals increasing`}
          icon={Activity}
          tone="blue"
        />
        <MetricCard
          label="Resolved this cycle"
          value={s.resolvedRisks}
          detail="Closed or accepted"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      {/* Main Charts & Severity Mix */}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        {/* Trend Chart */}
        <section className="panel p-6">
          <SectionHeader
            eyebrow="Exposure over time"
            title="Risk score trend"
            action={
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] font-semibold text-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                7 week view
              </span>
            }
          />
          <div className="mt-6">
            <RiskTrendChart data={trends} />
          </div>
          <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Risk score
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Alert activity
            </span>
          </div>
        </section>

        {/* Severity Mix */}
        <section className="panel p-6 flex flex-col justify-between">
          <SectionHeader
            eyebrow="Severity mix"
            title="Where exposure sits"
            action={
              <span className="font-mono text-[11px] text-muted-foreground">
                {s.totalRisks} risks
              </span>
            }
          />
          <div className="mt-6 space-y-4 flex-1 justify-center flex flex-col">
            {[
              { label: "Critical", count: s.criticalRisks, dotClass: "bg-destructive", barClass: "bg-destructive" },
              { label: "High", count: s.highRisks, dotClass: "bg-accent", barClass: "bg-accent" },
              { label: "Medium", count: s.mediumRisks, dotClass: "bg-amber-500", barClass: "bg-amber-500" },
              { label: "Low", count: s.lowRisks, dotClass: "bg-emerald-500", barClass: "bg-emerald-500" },
            ].map(({ label, count, dotClass, barClass }) => {
              const pct = Math.round((count / Math.max(s.totalRisks, 1)) * 100);
              return (
                <div key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                      <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                      {label}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${barClass}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Priority Risks & Live Alerts */}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
        {/* Priority Watchlist */}
        <section className="panel overflow-hidden">
          <div className="p-6 border-b border-border">
            <SectionHeader
              eyebrow="Watchlist"
              title="Priority risks"
              action={
                <Link
                  href="/risks"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Full register <ArrowUpRight size={14} />
                </Link>
              }
            />
          </div>
          <div className="divide-y divide-border">
            {topRisks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        </section>

        {/* Live Alerts Feed */}
        <section className="panel overflow-hidden">
          <div className="p-6 border-b border-border">
            <SectionHeader
              eyebrow="Intelligence feed"
              title="Live signal alerts"
              action={
                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
                  <Bell size={12} />
                  Realtime
                </span>
              }
            />
          </div>
          <AlertsList />
        </section>
      </div>
    </div>
  );
}
