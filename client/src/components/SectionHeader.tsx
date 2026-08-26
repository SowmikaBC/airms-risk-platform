import React, { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}

export function SectionHeader({ eyebrow, title, action }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h3 className="mt-1 text-base font-semibold text-foreground tracking-tight">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
