import React, { useState } from "react";
import { Switch, Route } from "wouter";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Overview } from "@/pages/Overview";
import { RiskRegister } from "@/pages/RiskRegister";
import { RiskDetail } from "@/pages/RiskDetail";
import { DetectRisk } from "@/pages/DetectRisk";
import { Analytics } from "@/pages/Analytics";
import { Assistant } from "@/pages/Assistant";
import { NotFound } from "@/pages/NotFound";
import { cn } from "@/lib/utils";

export function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Navigation Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          collapsed ? "md:pl-[76px]" : "md:pl-[248px]"
        )}
      >
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
          >
            <Menu size={20} />
          </button>
          <div className="font-bold text-sm tracking-tight text-foreground">AIRMS Risk Platform</div>
          <div className="w-8" />
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Switch>
            <Route path="/" component={Overview} />
            <Route path="/risks" component={RiskRegister} />
            <Route path="/risks/:id" component={RiskDetail} />
            <Route path="/detect" component={DetectRisk} />
            <Route path="/analytics" component={Analytics} />
            <Route path="/assistant" component={Assistant} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}
