import React from "react";
import { Activity, TrendingUp, CheckCircle2 } from "lucide-react";
import { useDashboardSummary, useDashboardTrends, useRisks } from "@/lib/api";
import { MetricCard } from "@/components/MetricCard";
import { SectionHeader } from "@/components/SectionHeader";
import { RiskTrendChart } from "@/components/RiskTrendChart";
import { RiskMatrix } from "@/components/RiskMatrix";

export function Analytics() {
  const { data: summary } = useDashboardSummary();
  const { data: trends } = useDashboardTrends();
  const { data: risks = [] } = useRisks();

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

  const categoryDistribution = risks.reduce<Record<string, number>>((acc, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1;
    return acc;
  }, {});

  const barColors = ["bg-primary", "bg-accent", "bg-sky-500", "bg-emerald-500", "bg-purple-500", "bg-rose-500"];

  return (
    <div className="space-y-8 airms-rise">
      {/* Header */}
      <div>
        <div className="eyebrow">Intelligence / patterns</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          See the shape of exposure before it becomes a surprise.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3.5 sm:grid-cols-3">
        <MetricCard
          label="Average score"
          value={s.averageScore.toFixed(1)}
          detail="Across active signals"
          icon={Activity}
          tone="primary"
        />
        <MetricCard
          label="Increasing signals"
          value={s.increasingRisks}
          detail="Need active attention"
          icon={TrendingUp}
          tone="amber"
        />
        <MetricCard
          label="Resolved / total"
          value={`${s.resolvedRisks} / ${s.totalRisks}`}
          detail="Current cycle"
          icon={CheckCircle2}
          tone="green"
        />
      </div>

      {/* Trend & Category Distribution */}
      <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <section className="panel p-6">
          <SectionHeader
            eyebrow="Risk trend"
            title="Score and incident activity"
            action={
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary" /> Score
              </span>
            }
          />
          <div className="mt-6">
            <RiskTrendChart data={trends} />
          </div>
        </section>

        <section className="panel p-6">
          <SectionHeader eyebrow="Distribution" title="By category" />
          <div className="mt-6 space-y-4">
            {Object.entries(categoryDistribution).map(([cat, count], idx) => {
              const pct = Math.round((count / Math.max(risks.length, 1)) * 100);
              return (
                <div key={cat} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-foreground">{cat}</span>
                    <span className="font-mono text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${barColors[idx % barColors.length]}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 5x5 Heatmap Matrix & Resolution Ratio */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="panel p-6">
          <SectionHeader eyebrow="Risk matrix" title="5x5 Probability vs Impact heatmap" />
          <div className="mt-6">
            <RiskMatrix risks={risks} />
          </div>
        </section>

        <section className="panel p-6 flex flex-col justify-between">
          <SectionHeader eyebrow="Resolution" title="Active vs resolved posture" />
          
          <div className="mt-6 flex items-center justify-center gap-8 py-4">
            <div
              className="relative grid h-40 w-40 place-items-center rounded-full shadow-inner"
              style={{
                background: `conic-gradient(hsl(var(--primary)) ${(s.activeRisks / Math.max(s.totalRisks, 1)) * 100}%, hsl(var(--muted)) 0)`,
              }}
            >
              <div className="grid h-28 w-28 place-items-center rounded-full bg-card shadow-sm">
                <div className="text-center">
                  <div className="font-mono text-2xl font-bold">
                    {Math.round((s.activeRisks / Math.max(s.totalRisks, 1)) * 100)}%
                  </div>
                  <div className="eyebrow">active</div>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  <span className="font-medium">Active Signals</span>
                </div>
                <div className="mt-1 pl-4.5 font-mono text-xl font-bold">{s.activeRisks}</div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/40" />
                  <span className="font-medium">Resolved / Accepted</span>
                </div>
                <div className="mt-1 pl-4.5 font-mono text-xl font-bold">{s.resolvedRisks}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
