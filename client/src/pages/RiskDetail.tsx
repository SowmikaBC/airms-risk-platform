import React, { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { 
  ChevronLeft, 
  User, 
  Bot, 
  CheckCircle, 
  Sparkles, 
  Calendar, 
  Activity,
  Layers
} from "lucide-react";
import { useRisk, useUpdateRisk } from "@/lib/api";
import { SeverityBadge } from "@/components/SeverityBadge";
import { TrendIcon } from "@/components/TrendIcon";
import { SectionHeader } from "@/components/SectionHeader";
import { formatDate } from "@/lib/utils";
import type { RiskStatus } from "@shared/types";

export function RiskDetail() {
  const [, params] = useRoute("/risks/:id");
  const id = Number(params?.id);

  const { data: risk, isLoading } = useRisk(id);
  const updateRisk = useUpdateRisk();

  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState<RiskStatus>("Open");

  useEffect(() => {
    if (risk) {
      setOwner(risk.owner || "");
      setStatus(risk.status || "Open");
    }
  }, [risk]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
        <div className="h-40 bg-muted rounded-2xl animate-pulse" />
        <div className="h-72 bg-muted rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!risk) {
    return (
      <div className="panel p-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Risk Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested risk ID #{id} does not exist in the register.</p>
        <Link href="/risks" className="inline-block rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground">
          Return to register
        </Link>
      </div>
    );
  }

  const handleStatusChange = (newStatus: RiskStatus) => {
    setStatus(newStatus);
    updateRisk.mutate({ id: risk.id, data: { status: newStatus } });
  };

  const handleSaveOwner = (e: React.FormEvent) => {
    e.preventDefault();
    updateRisk.mutate({ id: risk.id, data: { owner } });
  };

  const scoreDialColor = risk.severity === "Critical" 
    ? "hsl(var(--destructive))" 
    : risk.severity === "High" 
    ? "hsl(var(--accent))" 
    : "hsl(var(--primary))";

  return (
    <div className="space-y-8 airms-rise">
      {/* Breadcrumb */}
      <Link
        href="/risks"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeft size={16} /> Back to register
      </Link>

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-muted-foreground">R-{risk.id}</span>
            <SeverityBadge value={risk.severity} />
            <TrendIcon value={risk.trend} />
            <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
              {risk.category}
            </span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {risk.title}
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {risk.description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as RiskStatus)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-semibold shadow-sm outline-none"
          >
            <option value="Open">Open</option>
            <option value="Under review">Under review</option>
            <option value="Accepted">Accepted</option>
            <option value="Resolved">Resolved</option>
          </select>

          <Link
            href="/assistant"
            title="Ask Copilot about this risk"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:border-primary hover:text-primary transition-all"
          >
            <Bot size={18} />
          </Link>
        </div>
      </div>

      {/* Main Grid: Posture + Explainability */}
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Posture Card */}
        <section className="panel p-6 space-y-6">
          <SectionHeader eyebrow="Model output" title="Risk posture" />

          {/* Radial score gauge */}
          <div className="flex items-center gap-6 py-2">
            <div
              className="relative grid h-32 w-32 shrink-0 place-items-center rounded-full shadow-inner"
              style={{
                background: `conic-gradient(${scoreDialColor} ${risk.score}%, hsl(var(--muted)) 0)`,
              }}
            >
              <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-card shadow-sm">
                <div className="text-center">
                  <div className="font-mono text-3xl font-bold tracking-tight text-foreground">
                    {risk.score}
                  </div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    score
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-lg font-bold text-foreground">
                {risk.severity} exposure
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Probability {risk.probability}/5 â€¢ Impact {risk.impact}/5
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
                <Sparkles size={14} />
                <span>{risk.confidence}% model confidence</span>
              </div>
            </div>
          </div>

          {/* Owner & Source info */}
          <div className="grid grid-cols-2 gap-3 border-t border-border pt-5">
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="eyebrow">Owner</div>
              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <User size={14} className="text-primary" />
                {risk.owner || "Unassigned"}
              </div>
            </div>
            <div className="rounded-xl bg-muted/50 p-3">
              <div className="eyebrow">Source</div>
              <div className="mt-1 text-xs font-semibold text-foreground">
                {risk.source || "Project telemetry"}
              </div>
            </div>
          </div>

          {/* Update Owner Form */}
          <form onSubmit={handleSaveOwner} className="field border-t border-border pt-4">
            <span>Accountable owner</span>
            <div className="flex gap-2">
              <input
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                placeholder="Assign team owner..."
              />
              <button
                type="submit"
                disabled={updateRisk.isPending}
                className="shrink-0 rounded-xl bg-foreground px-4 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
              >
                Save
              </button>
            </div>
          </form>
        </section>

        {/* Explainability & Recommendations */}
        <section className="panel p-6 space-y-6">
          <SectionHeader
            eyebrow="Explainability"
            title="Why AIRMS flagged this"
            action={
              <span className="font-mono text-[10px] text-muted-foreground">
                Updated {formatDate(risk.updatedAt)}
              </span>
            }
          />

          {/* Reason bullets */}
          <div className="space-y-3">
            {(risk.reasons || []).map((reason, idx) => (
              <div key={idx} className="flex gap-3 rounded-xl border border-border/80 bg-background/50 p-3.5">
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-accent/20 font-mono text-[10px] font-bold text-accent-foreground">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <p className="text-xs leading-relaxed text-foreground">{reason}</p>
              </div>
            ))}
          </div>

          {/* Recommended Next Moves */}
          <div className="border-t border-border pt-5">
            <div className="eyebrow mb-3">Recommended next moves</div>
            <div className="space-y-2.5">
              {(risk.recommendations || []).map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                  <CheckCircle size={15} className="mt-0.5 shrink-0 text-primary" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Evidence Trail / Events Timeline */}
      {risk.events && risk.events.length > 0 && (
        <section className="panel p-6">
          <SectionHeader eyebrow="Evidence trail" title="Risk telemetry & timeline events" />
          <div className="mt-6 space-y-4">
            {risk.events.map((event, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <Activity size={16} />
                </div>
                <div className="flex-1 rounded-xl bg-muted/40 p-3.5 border border-border/60">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-foreground">{event.label}</span>
                    <span className="font-mono text-xs font-semibold text-primary">{event.value}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
