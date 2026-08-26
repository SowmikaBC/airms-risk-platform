import React from "react";
import { Link, useLocation } from "wouter";
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ListFilter, 
  Radar, 
  BarChart3, 
  Bot, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
}

export function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }: SidebarProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/risks", label: "Risk register", icon: ListFilter },
    { href: "/detect", label: "Detect risk", icon: Radar },
    { href: "/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/assistant", label: "AIRMS copilot", icon: Bot, isAi: true },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar px-4 py-5 text-sidebar-foreground transition-all duration-300",
          collapsed ? "md:w-[76px]" : "md:w-[248px]",
          mobileOpen ? "translate-x-0 w-[248px]" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Header / Brand */}
        <div className="flex items-center justify-between px-2">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
                <ShieldAlert size={20} strokeWidth={2.2} />
                <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
              </div>
              <div>
                <div className="font-bold tracking-tight text-sidebar-foreground">AIRMS</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-sidebar-foreground/60">
                  risk intelligence
                </div>
              </div>
            </div>
          ) : (
            <div className="mx-auto grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
              <ShieldAlert size={20} strokeWidth={2.2} />
            </div>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:grid h-8 w-8 place-items-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="grid md:hidden h-8 w-8 place-items-center rounded-lg text-sidebar-foreground/60 hover:bg-sidebar-accent"
          >
            <X size={18} />
          </button>
        </div>

        {/* Section label */}
        <div className={cn(
          "mt-8 px-2 font-mono text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/45",
          collapsed && "text-center"
        )}>
          {collapsed ? "â€¢â€¢â€¢" : "Workspace"}
        </div>

        {/* Navigation links */}
        <nav className="mt-3 space-y-1.5 flex-1">
          {navItems.map(({ href, label, icon: Icon, isAi }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-sidebar-foreground/70 transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  active && "bg-sidebar-accent text-sidebar-foreground shadow-[inset_3px_0_0_hsl(var(--sidebar-primary))]",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon size={18} strokeWidth={active ? 2.4 : 1.8} className={active ? "text-sidebar-primary" : ""} />
                <span className={cn(collapsed && "hidden")}>{label}</span>
                {isAi && !collapsed && (
                  <span className="ml-auto rounded-md bg-sidebar-primary/20 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-sidebar-primary">
                    AI
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Status card footer */}
        <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/40 p-3.5">
          {collapsed ? (
            <div className="mx-auto h-2.5 w-2.5 rounded-full bg-sidebar-primary animate-ping" />
          ) : (
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sidebar-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live Telemetry Active
              </div>
              <p className="mt-1 text-[11px] text-sidebar-foreground/60 leading-4">
                Continuous risk evaluation & heuristic scoring active.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
