export type Severity = "Critical" | "High" | "Medium" | "Low";
export type Trend = "Increasing" | "Stable" | "Decreasing";
export type RiskStatus = "Open" | "Under review" | "Accepted" | "Resolved";
export type RiskCategory = "Delivery" | "Technology" | "Compliance" | "Third party" | "Financial" | "People";

export interface RiskEvent {
  label: string;
  value: string;
  description: string;
}

export interface Risk {
  id: number;
  title: string;
  description: string;
  category: RiskCategory;
  probability: number; // 1 - 5
  impact: number;      // 1 - 5
  score: number;       // 0 - 100
  severity: Severity;
  confidence: number;  // 0 - 100 %
  trend: Trend;
  status: RiskStatus;
  owner: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  reasons: string[];
  recommendations: string[];
  events: RiskEvent[];
}

export interface RiskAlert {
  id: number;
  riskId: number;
  title: string;
  message: string;
  severity: Severity;
  createdAt: string;
  isRead: boolean;
}

export interface DashboardSummary {
  totalRisks: number;
  criticalRisks: number;
  highRisks: number;
  mediumRisks: number;
  lowRisks: number;
  resolvedRisks: number;
  activeRisks: number;
  increasingRisks: number;
  topCategory: string;
  averageScore: number;
}

export interface TrendPoint {
  label: string;
  score: number;
  incidents: number;
}

export interface AnalyzeRiskInput {
  title: string;
  category: RiskCategory;
  description: string;
  probability: number;
  impact: number;
  budgetUsage?: number;
  completion?: number;
  daysRemaining?: number;
  incidents?: number;
}

export interface AssistantAskRequest {
  question: string;
}

export interface AssistantResponse {
  answer: string;
  sources: string[];
}
