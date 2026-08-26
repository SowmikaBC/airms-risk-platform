import React from "react";
import type { TrendPoint } from "@shared/types";

interface RiskTrendChartProps {
  data?: TrendPoint[];
}

export function RiskTrendChart({ data = [] }: RiskTrendChartProps) {
  if (!data || data.length === 0) {
    return <div className="h-48 grid place-items-center text-xs text-muted-foreground">No trend telemetry available</div>;
  }

  const width = 600;
  const height = 180;
  const padding = 28;

  const maxScore = 100;
  const minScore = 0;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.score / maxScore) * (height - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.28" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[25, 50, 75, 100].map((level) => {
          const y = height - padding - (level / maxScore) * (height - padding * 2);
          return (
            <g key={level}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="hsl(var(--border))"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={padding - 6}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground font-mono text-[9px]"
              >
                {level}
              </text>
            </g>
          );
        })}

        {/* Gradient fill */}
        <path d={areaD} fill="url(#scoreGradient)" />

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points & incident bars */}
        {points.map((p, i) => (
          <g key={i}>
            {/* Score circle */}
            <circle
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill="hsl(var(--card))"
              stroke="hsl(var(--primary))"
              strokeWidth="2.5"
            />
            {/* Incident pill */}
            {p.incidents > 0 && (
              <g transform={`translate(${p.x - 8}, ${p.y - 20})`}>
                <rect width="16" height="12" rx="3" fill="hsl(var(--accent))" />
                <text
                  x="8"
                  y="9"
                  textAnchor="middle"
                  className="fill-accent-foreground font-mono text-[8px] font-bold"
                >
                  {p.incidents}
                </text>
              </g>
            )}
            {/* X-axis label */}
            <text
              x={p.x}
              y={height - 6}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[10px]"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
