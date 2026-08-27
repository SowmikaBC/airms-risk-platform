import { Risk, RiskAlert, DashboardSummary, TrendPoint } from "./types";

export interface IStorage {
  getRisks(params?: { search?: string; severity?: string; status?: string; category?: string }): Promise<Risk[]>;
  getRiskById(id: number): Promise<Risk | undefined>;
  createRisk(risk: Omit<Risk, "id" | "createdAt" | "updatedAt">): Promise<Risk>;
  updateRisk(id: number, updates: Partial<Risk>): Promise<Risk | undefined>;
  deleteRisk(id: number): Promise<boolean>;
  getAlerts(): Promise<RiskAlert[]>;
  markAlertRead(id: number): Promise<RiskAlert | undefined>;
  getDashboardSummary(): Promise<DashboardSummary>;
  getDashboardTrends(): Promise<TrendPoint[]>;
}

export class MemStorage implements IStorage {
  private risks: Map<number, Risk>;
  private alerts: Map<number, RiskAlert>;
  private trendData: TrendPoint[];
  private currentRiskId: number;
  private currentAlertId: number;

  constructor() {
    this.risks = new Map();
    this.alerts = new Map();
    this.currentRiskId = 105;
    this.currentAlertId = 4;

    this.trendData = [
      { label: "Mar 04", score: 42, incidents: 3 },
      { label: "Mar 11", score: 48, incidents: 4 },
      { label: "Mar 18", score: 45, incidents: 2 },
      { label: "Mar 25", score: 56, incidents: 5 },
      { label: "Apr 01", score: 51, incidents: 3 },
      { label: "Apr 08", score: 63, incidents: 7 },
      { label: "Apr 15", score: 58, incidents: 4 }
    ];

    this.seedInitialData();
  }

  private seedInitialData() {
    const initialRisks: Risk[] = [
      {
        id: 101,
        title: "Northstar API migration",
        description: "Dependency migration is tracking behind the integration window, increasing release exposure.",
        category: "Delivery",
        probability: 4,
        impact: 5,
        score: 82,
        severity: "Critical",
        confidence: 91,
        trend: "Increasing",
        status: "Open",
        owner: "Maya Chen",
        source: "Project telemetry",
        createdAt: "2025-04-12T10:00:00Z",
        updatedAt: "2025-04-16T08:30:00Z",
        reasons: [
          "Integration milestones slipped by 9 days",
          "Three blocking incidents in the last sprint",
          "Vendor response time is above the agreed threshold"
        ],
        recommendations: [
          "Escalate vendor integration review",
          "Move contract testing ahead of feature freeze"
        ],
        events: [
          { label: "Milestone slip", value: "9 days", description: "Integration milestone moved from Apr 07 to Apr 16" },
          { label: "Open incidents", value: "3", description: "Blocking issues remain unresolved" }
        ]
      },
      {
        id: 102,
        title: "Identity provider capacity",
        description: "Authentication traffic is approaching the contracted burst ceiling during peak usage windows.",
        category: "Technology",
        probability: 3,
        impact: 5,
        score: 71,
        severity: "High",
        confidence: 86,
        trend: "Increasing",
        status: "Open",
        owner: "Jon Bell",
        source: "Service telemetry",
        createdAt: "2025-04-10T12:00:00Z",
        updatedAt: "2025-04-15T16:10:00Z",
        reasons: [
          "Peak volume is 82% of the ceiling",
          "Growth is outpacing capacity assumptions"
        ],
        recommendations: [
          "Confirm burst capacity with provider",
          "Add a failover load test to next sprint"
        ],
        events: [
          { label: "Peak utilization", value: "82%", description: "Observed during the last 14 days" }
        ]
      },
      {
        id: 103,
        title: "Regional data retention gap",
        description: "Retention policy mappings are incomplete for two newly onboarded regions.",
        category: "Compliance",
        probability: 3,
        impact: 4,
        score: 64,
        severity: "High",
        confidence: 79,
        trend: "Stable",
        status: "Under review",
        owner: "Inez Okafor",
        source: "Control review",
        createdAt: "2025-04-08T12:00:00Z",
        updatedAt: "2025-04-14T09:20:00Z",
        reasons: [
          "Two regional mappings need legal review"
        ],
        recommendations: [
          "Book a privacy counsel review",
          "Document exception owners"
        ],
        events: [
          { label: "Regions affected", value: "2", description: "Mappings pending approval" }
        ]
      },
      {
        id: 104,
        title: "Supplier concentration",
        description: "A single specialist supplier currently supports a critical operational path.",
        category: "Third party",
        probability: 2,
        impact: 4,
        score: 48,
        severity: "Medium",
        confidence: 74,
        trend: "Decreasing",
        status: "Open",
        owner: "Theo Martin",
        source: "Control review",
        createdAt: "2025-04-02T12:00:00Z",
        updatedAt: "2025-04-13T14:40:00Z",
        reasons: [
          "Single supplier supports 68% of the path"
        ],
        recommendations: [
          "Complete secondary supplier assessment"
        ],
        events: [
          { label: "Concentration", value: "68%", description: "Current operational dependency" }
        ]
      }
    ];

    initialRisks.forEach(r => this.risks.set(r.id, r));

    const initialAlerts: RiskAlert[] = [
      {
        id: 1,
        riskId: 101,
        title: "Risk score changed",
        message: "Northstar API migration moved into the critical band.",
        severity: "Critical",
        createdAt: "2025-04-16T09:30:00Z",
        isRead: false
      },
      {
        id: 2,
        riskId: 102,
        title: "Threshold approaching",
        message: "Identity provider capacity is at 82% of burst ceiling.",
        severity: "High",
        createdAt: "2025-04-16T08:10:00Z",
        isRead: false
      },
      {
        id: 3,
        riskId: 103,
        title: "Review due",
        message: "Regional data retention gap is due for owner review.",
        severity: "Medium",
        createdAt: "2025-04-15T14:00:00Z",
        isRead: true
      }
    ];

    initialAlerts.forEach(a => this.alerts.set(a.id, a));
  }

  async getRisks(params?: { search?: string; severity?: string; status?: string; category?: string }): Promise<Risk[]> {
    let result = Array.from(this.risks.values()).sort((a, b) => b.score - a.score);

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(r => 
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        `r-${r.id}`.toLowerCase().includes(q)
      );
    }

    if (params?.severity) {
      result = result.filter(r => r.severity.toLowerCase() === params.severity!.toLowerCase());
    }

    if (params?.status) {
      result = result.filter(r => r.status.toLowerCase() === params.status!.toLowerCase());
    }

    if (params?.category) {
      result = result.filter(r => r.category.toLowerCase() === params.category!.toLowerCase());
    }

    return result;
  }

  async getRiskById(id: number): Promise<Risk | undefined> {
    return this.risks.get(id);
  }

  async createRisk(riskData: Omit<Risk, "id" | "createdAt" | "updatedAt">): Promise<Risk> {
    const id = this.currentRiskId++;
    const now = new Date().toISOString();
    const newRisk: Risk = {
      ...riskData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.risks.set(id, newRisk);

    if (newRisk.severity === "Critical" || newRisk.severity === "High") {
      const alertId = this.currentAlertId++;
      this.alerts.set(alertId, {
        id: alertId,
        riskId: id,
        title: `New ${newRisk.severity} risk detected`,
        message: `${newRisk.title} was scored at ${newRisk.score} (${newRisk.severity}).`,
        severity: newRisk.severity,
        createdAt: now,
        isRead: false,
      });
    }

    return newRisk;
  }

  async updateRisk(id: number, updates: Partial<Risk>): Promise<Risk | undefined> {
    const risk = this.risks.get(id);
    if (!risk) return undefined;

    const updated: Risk = {
      ...risk,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.risks.set(id, updated);
    return updated;
  }

  async deleteRisk(id: number): Promise<boolean> {
    return this.risks.delete(id);
  }

  async getAlerts(): Promise<RiskAlert[]> {
    return Array.from(this.alerts.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async markAlertRead(id: number): Promise<RiskAlert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    alert.isRead = true;
    this.alerts.set(id, alert);
    return alert;
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const all = Array.from(this.risks.values());
    const totalRisks = all.length;
    const criticalRisks = all.filter(r => r.severity === "Critical").length;
    const highRisks = all.filter(r => r.severity === "High").length;
    const mediumRisks = all.filter(r => r.severity === "Medium").length;
    const lowRisks = all.filter(r => r.severity === "Low").length;
    const resolvedRisks = all.filter(r => r.status === "Resolved" || r.status === "Accepted").length;
    const activeRisks = all.filter(r => r.status === "Open" || r.status === "Under review").length;
    const increasingRisks = all.filter(r => r.trend === "Increasing").length;

    const catCounts: Record<string, number> = {};
    all.forEach(r => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });
    let topCategory = "Delivery";
    let maxCatCount = 0;
    for (const [cat, count] of Object.entries(catCounts)) {
      if (count > maxCatCount) {
        maxCatCount = count;
        topCategory = cat;
      }
    }

    const totalScore = all.reduce((acc, r) => acc + r.score, 0);
    const averageScore = totalRisks > 0 ? Number((totalScore / totalRisks).toFixed(1)) : 0;

    return {
      totalRisks,
      criticalRisks,
      highRisks,
      mediumRisks,
      lowRisks,
      resolvedRisks,
      activeRisks,
      increasingRisks,
      topCategory,
      averageScore
    };
  }

  async getDashboardTrends(): Promise<TrendPoint[]> {
    return this.trendData;
  }
}

export const storage = new MemStorage();
