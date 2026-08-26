import React from "react";
import { Link } from "wouter";
import type { Risk } from "@shared/types";

interface RiskMatrixProps {
  risks?: Risk[];
}

export function RiskMatrix({ risks = [] }: RiskMatrixProps) {
  // 5x5 Probability (rows: 5 down to 1) x Impact (cols: 1 to 5)
  const rows = [5, 4, 3, 2, 1];
  const cols = [1, 2, 3, 4, 5];

  const getCellColor = (prob: number, imp: number) => {
    const product = prob * imp;
    if (product >= 16) return "bg-red-500/20 border-red-500/30 text-red-700 dark:text-red-300";
    if (product >= 10) return "bg-amber-500/20 border-amber-500/30 text-amber-700 dark:text-amber-300";
    if (product >= 5) return "bg-yellow-500/15 border-yellow-500/30 text-yellow-700 dark:text-yellow-300";
    return "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[auto_1fr] gap-3">
        {/* Y Axis Label */}
        <div className="flex items-center justify-center">
          <div className="writing-mode-vertical -rotate-180 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Probability â†’
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="space-y-1.5">
          {rows.map((prob) => (
            <div key={prob} className="grid grid-cols-5 gap-1.5">
              {cols.map((imp) => {
                const cellRisks = risks.filter(r => r.probability === prob && r.impact === imp);
                return (
                  <div
                    key={`${prob}-${imp}`}
                    className={`relative min-h-[58px] rounded-xl border p-1.5 flex flex-col justify-between ${getCellColor(prob, imp)}`}
                  >
                    <div className="flex justify-between items-center text-[9px] font-mono opacity-60">
                      <span>P{prob}</span>
                      <span>I{imp}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {cellRisks.map(r => (
                        <Link
                          key={r.id}
                          href={`/risks/${r.id}`}
                          title={`R-${r.id}: ${r.title} (Score: ${r.score})`}
                          className="grid h-5 w-5 place-items-center rounded-md bg-foreground text-background font-mono text-[9px] font-bold shadow-sm hover:scale-110 transition-transform"
                        >
                          {r.id}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* X Axis Label */}
          <div className="grid grid-cols-5 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground pt-1">
            <span>Impact 1</span>
            <span>Impact 2</span>
            <span>Impact 3</span>
            <span>Impact 4</span>
            <span>Impact 5</span>
          </div>
        </div>
      </div>
    </div>
  );
}
