import React, { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Radar, RotateCcw, AlertCircle } from "lucide-react";
import { useRisks } from "@/lib/api";
import { RiskCard } from "@/components/RiskCard";

export function RiskRegister() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");

  const filters = useMemo(() => ({
    ...(search ? { search } : {}),
    ...(severity ? { severity } : {}),
    ...(status ? { status } : {}),
    ...(category ? { category } : {}),
  }), [search, severity, status, category]);

  const { data: risks = [], isLoading, isError, refetch } = useRisks(filters);

  const clearFilters = () => {
    setSearch("");
    setSeverity("");
    setStatus("");
    setCategory("");
  };

  return (
    <div className="space-y-7 airms-rise">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="eyebrow">Register / live view</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Risk register
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Every active signal, with a clear owner and a next step.
          </p>
        </div>
        <Link
          href="/detect"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground transition-all hover:border-primary/50 hover:text-primary"
        >
          <Radar size={15} />
          New detection
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="panel flex flex-col gap-3 p-3 md:flex-row">
        <label className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search risks, owners, categories..."
            className="h-10 w-full rounded-xl border border-transparent bg-muted/60 pl-10 pr-3.5 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium outline-none"
          >
            <option value="">All severity</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium outline-none"
          >
            <option value="">All status</option>
            <option value="Open">Open</option>
            <option value="Under review">Under review</option>
            <option value="Resolved">Resolved</option>
            <option value="Accepted">Accepted</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-xl border border-border bg-card px-3 text-xs font-medium outline-none"
          >
            <option value="">All categories</option>
            <option value="Delivery">Delivery</option>
            <option value="Technology">Technology</option>
            <option value="Compliance">Compliance</option>
            <option value="Third party">Third party</option>
            <option value="Financial">Financial</option>
            <option value="People">People</option>
          </select>

          <button
            onClick={clearFilters}
            title="Reset filters"
            className="grid h-10 w-10 place-items-center rounded-xl border border-border text-muted-foreground hover:text-primary transition-colors"
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Risks Table / List */}
      <div className="panel overflow-hidden">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-muted/60 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="mx-auto text-destructive" size={24} />
            <p className="text-sm text-destructive">Failed to load risk register.</p>
            <button
              onClick={() => refetch()}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        ) : risks.length > 0 ? (
          <div className="divide-y divide-border">
            {risks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <h3 className="font-semibold text-foreground">No risks match these filters</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search criteria or reset filters to view all entries.
            </p>
            <button
              onClick={clearFilters}
              className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
