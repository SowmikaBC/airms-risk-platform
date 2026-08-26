import React, { useState } from "react";
import { Link } from "wouter";
import { Radar, Sparkles, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { useAnalyzeRisk } from "@/lib/api";
import { SeverityBadge } from "@/components/SeverityBadge";
import type { Risk, RiskCategory } from "@shared/types";

export function DetectRisk() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Delivery" as RiskCategory,
    description: "",
    probability: 3,
    impact: 3,
    budgetUsage: 50,
    completion: 50,
    daysRemaining: 30,
    incidents: 0,
  });

  const [analyzedRisk, setAnalyzedRisk] = useState<Risk | null>(null);
  const analyze = useAnalyzeRisk();

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: ["probability", "impact", "budgetUsage", "completion", "daysRemaining", "incidents"].includes(field)
        ? Number(value)
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyze.mutate(formData, {
      onSuccess: (result) => setAnalyzedRisk(result),
    });
  };

  return (
    <div className="space-y-8 airms-rise">
      {/* Header */}
      <div>
        <div className="eyebrow">Signal lab / new analysis</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Detect a risk
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Give AIRMS the project context. It will score the exposure, explain the signal, and suggest a measured next step.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        {/* Input Form */}
        <form onSubmit={handleSubmit} className="panel p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Radar size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Project context</h2>
                <p className="text-xs text-muted-foreground">Required signal inputs</p>
              </div>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">01 / 02</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="field sm:col-span-2">
              <span>Risk or project title</span>
              <input
                required
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Northstar API migration"
              />
            </label>

            <label className="field">
              <span>Category</span>
              <select
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="Delivery">Delivery</option>
                <option value="Technology">Technology</option>
                <option value="Compliance">Compliance</option>
                <option value="Third party">Third party</option>
                <option value="Financial">Financial</option>
                <option value="People">People</option>
              </select>
            </label>

            <label className="field">
              <span>Current probability <em>(1 - 5)</em></span>
              <input
                required
                type="number"
                min="1"
                max="5"
                value={formData.probability}
                onChange={(e) => handleChange("probability", e.target.value)}
              />
            </label>

            <label className="field sm:col-span-2">
              <span>What is happening?</span>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe the conditions, recent signals, and what could happen next..."
              />
            </label>

            <label className="field">
              <span>Potential impact <em>(1 - 5)</em></span>
              <input
                required
                type="number"
                min="1"
                max="5"
                value={formData.impact}
                onChange={(e) => handleChange("impact", e.target.value)}
              />
            </label>

            <label className="field">
              <span>Known incidents</span>
              <input
                type="number"
                min="0"
                value={formData.incidents}
                onChange={(e) => handleChange("incidents", e.target.value)}
              />
            </label>
          </div>

          {/* Telemetry section */}
          <div className="border-t border-border pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-xs font-bold text-foreground">Optional telemetry</div>
              <span className="font-mono text-[10px] text-muted-foreground">Improves confidence</span>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <label className="field">
                <span>Budget used <em>%</em></span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.budgetUsage}
                  onChange={(e) => handleChange("budgetUsage", e.target.value)}
                />
              </label>

              <label className="field">
                <span>Completion <em>%</em></span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.completion}
                  onChange={(e) => handleChange("completion", e.target.value)}
                />
              </label>

              <label className="field">
                <span>Days remaining</span>
                <input
                  type="number"
                  min="0"
                  value={formData.daysRemaining}
                  onChange={(e) => handleChange("daysRemaining", e.target.value)}
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={analyze.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition-all disabled:opacity-60"
          >
            {analyze.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing signals...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Run AIRMS analysis
              </>
            )}
          </button>
        </form>

        {/* Output Readout */}
        <div className="panel airms-grid p-6 flex flex-col justify-center">
          {analyzedRisk ? (
            <div className="space-y-6 airms-rise">
              <div className="eyebrow">Analysis complete & registered</div>

              <div className="flex items-end justify-between border-b border-border pb-5">
                <div>
                  <div className="font-mono text-5xl font-extrabold text-primary">
                    {analyzedRisk.score}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">AIRMS risk score</div>
                </div>
                <SeverityBadge value={analyzedRisk.severity} />
              </div>

              {/* Confidence Meter */}
              <div className="rounded-xl border border-border bg-card/80 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-mono font-bold">{analyzedRisk.confidence}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${analyzedRisk.confidence}%` }} />
                </div>
              </div>

              {/* Reasoning */}
              <div>
                <div className="text-xs font-bold text-foreground">Signal reasoning</div>
                <ul className="mt-3 space-y-2">
                  {analyzedRisk.reasons?.slice(0, 3).map((r, i) => (
                    <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/risks/${analyzedRisk.id}`}
                className="flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/10 py-3 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
              >
                Open risk detail <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                <Sparkles size={22} />
              </div>
              <div>
                <div className="eyebrow">What you will get</div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  A decision-ready signal.
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  AIRMS combines your narrative with numeric telemetry to provide calibrated exposure scores and practical next moves.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  ["01", "Calibrated score", "Probability Ã— impact, adjusted by signal quality."],
                  ["02", "Plain-language reasons", "The precise conditions that moved the score."],
                  ["03", "Recommended action", "A practical next move for human review."],
                ].map(([num, title, desc]) => (
                  <div key={num} className="flex gap-3 rounded-xl bg-card/60 p-3.5 border border-border/50">
                    <span className="font-mono text-xs font-bold text-primary">{num}</span>
                    <div>
                      <div className="text-xs font-bold text-foreground">{title}</div>
                      <div className="text-[11px] text-muted-foreground">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
