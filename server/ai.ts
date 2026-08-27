import { AnalyzeRiskInput, Risk, Severity, Trend, AssistantResponse } from "./types";
import { storage } from "./storage";

export function calculateRiskScore(input: AnalyzeRiskInput): {
  score: number;
  severity: Severity;
  confidence: number;
  trend: Trend;
  reasons: string[];
  recommendations: string[];
} {
  const { probability, impact, incidents = 0, budgetUsage = 50, completion = 50, daysRemaining = 30 } = input;
  
  let rawScore = (probability * impact * 4);
  
  if (incidents > 0) {
    rawScore += Math.min(incidents * 4, 15);
  }
  if (budgetUsage > 80 && completion < 50) {
    rawScore += 10;
  }
  if (daysRemaining < 14 && completion < 70) {
    rawScore += 8;
  }

  const score = Math.max(10, Math.min(98, Math.round(rawScore)));

  let severity: Severity = "Low";
  if (score >= 75) severity = "Critical";
  else if (score >= 60) severity = "High";
  else if (score >= 40) severity = "Medium";

  let confidence = Math.min(95, Math.max(65, 75 + (incidents > 0 ? 10 : 0) + (daysRemaining < 30 ? 6 : 0)));

  let trend: Trend = "Stable";
  if (score >= 65 || incidents > 1) {
    trend = "Increasing";
  } else if (score < 45) {
    trend = "Decreasing";
  }

  const reasons: string[] = [];
  if (probability >= 4) reasons.push(`Elevated probability (${probability}/5) based on current operating indicators.`);
  if (impact >= 4) reasons.push(`High consequence severity (${impact}/5) affecting core deliverables.`);
  if (incidents > 0) reasons.push(`${incidents} recorded incident(s) tied directly to this signal.`);
  if (budgetUsage > 75) reasons.push(`Budget burn (${budgetUsage}%) significantly outpacing schedule.`);
  if (daysRemaining < 20) reasons.push(`Compressed delivery window with only ${daysRemaining} day(s) remaining.`);
  if (reasons.length === 0) {
    reasons.push("Signal metrics indicate nominal exposure within baseline operational tolerances.");
    reasons.push("Continuous telemetry monitoring recommended to catch trajectory shifts early.");
  }

  const recommendations: string[] = [];
  if (severity === "Critical" || severity === "High") {
    recommendations.push("Convene urgent control review and assign accountable milestone owner.");
    recommendations.push("Establish automated telemetry threshold alerts to prevent cascade failures.");
    recommendations.push("Prepare containment fallback plan prior to upcoming milestone gate.");
  } else {
    recommendations.push("Maintain bi-weekly telemetry checkpoints with project leads.");
    recommendations.push("Document early-warning threshold criteria in the team register.");
  }

  return {
    score,
    severity,
    confidence,
    trend,
    reasons,
    recommendations
  };
}

export async function askAssistant(question: string): Promise<AssistantResponse> {
  const risks = await storage.getRisks();
  const summary = await storage.getDashboardSummary();
  const alerts = await storage.getAlerts();

  if (process.env.GEMINI_API_KEY) {
    try {
      const { GoogleGenerativeAI } = await import("@google/generative-ai");
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are AIRMS Copilot, the AI risk intelligence officer.
Context Data:
- Total risks: ${summary.totalRisks} (${summary.criticalRisks} Critical, ${summary.highRisks} High, ${summary.mediumRisks} Medium, ${summary.lowRisks} Low)
- Active risks: ${summary.activeRisks}, Resolved: ${summary.resolvedRisks}
- Top Category: ${summary.topCategory}
- Average score: ${summary.averageScore}
- Active Risk Register items:
${JSON.stringify(risks.slice(0, 8), null, 2)}
- Active Alerts:
${JSON.stringify(alerts.slice(0, 5), null, 2)}

User Question: "${question}"

Instructions:
1. Provide a direct, analytical, professional risk advisory answer.
2. Refer to specific risk items (e.g. R-101 Northstar API migration) and accountable owners where applicable.
3. Suggest a clear, measured next move for risk control.
4. Keep the tone concise, executive, and evidence-driven.`;

      const response = await model.generateContent(prompt);
      const text = response.response.text() || "AIRMS Copilot could not generate an answer.";
      const sources = risks.slice(0, 3).map(r => `R-${r.id}: ${r.title} (${r.category})`);
      sources.push("AIRMS Telemetry Feed");

      return { answer: text, sources };
    } catch (err) {
      console.warn("Gemini generation failed, falling back to heuristic engine:", err);
    }
  }

  const q = question.toLowerCase();
  let answer = "";
  const sources: string[] = [];

  if (q.includes("critical") || q.includes("highest") || q.includes("summarize") || q.includes("weekly")) {
    const criticals = risks.filter(r => r.severity === "Critical" || r.severity === "High");
    answer = `Based on current telemetry, **${summary.criticalRisks} critical** and **${summary.highRisks} high-severity risks** require active management:\n\n` +
      criticals.map(r => `â€¢ **R-${r.id}: ${r.title}** (Score: ${r.score}/100, Owner: ${r.owner}) â€” ${r.description} Top recommendation: ${r.recommendations[0] || 'Review milestone dependencies.'}`).join("\n\n") +
      `\n\n**Recommended Control Action:** Escalate vendor reviews and ensure fallback contingencies are verified before the next release window.`;

    criticals.forEach(r => sources.push(`Register: R-${r.id} (${r.title})`));
    sources.push("Executive Dashboard Feed");
  } else if (q.includes("review") || q.includes("today") || q.includes("owner")) {
    const unreviewed = risks.filter(r => r.status === "Open" || r.status === "Under review");
    answer = `**${unreviewed.length} risks** have pending owner actions or scheduled checkpoints:\n\n` +
      unreviewed.map(r => `â€¢ **${r.owner}** is accountable for **R-${r.id} (${r.title})** [Status: ${r.status}, Trend: ${r.trend}]`).join("\n") +
      `\n\n**Priority Action:** Request an updated milestone status from Maya Chen regarding Northstar API integration slippage.`;

    unreviewed.slice(0, 3).forEach(r => sources.push(`Owner Directory: ${r.owner}`));
    sources.push("Risk Register Schedule");
  } else if (q.includes("delivery") || q.includes("increase") || q.includes("exposure")) {
    const deliveryRisks = risks.filter(r => r.category === "Delivery");
    answer = `Delivery exposure has increased primarily due to **R-101 (Northstar API migration)** moving into the critical band.\n\n` +
      `**Contributing Factors:**\n` +
      `1. Integration milestones slipped by 9 days beyond the planned integration gate.\n` +
      `2. Three blocking incidents occurred during the last sprint cycle.\n` +
      `3. Vendor support turnaround times exceeded SLA thresholds by 35%.\n\n` +
      `**Suggested Strategy:** Bring contract testing forward and schedule a dedicated triage checkpoint.`;

    sources.push("Telemetry: Milestone Tracker");
    sources.push("Register: R-101 (Northstar API migration)");
    sources.push("Sprint Incident Log");
  } else {
    answer = `AIRMS evaluated the risk register against your query. Currently, the platform tracks **${summary.totalRisks} total signals** with an average risk posture of **${summary.averageScore}/100**.\n\n` +
      `â€¢ **Top Category:** ${summary.topCategory} represents the highest density of active exposure.\n` +
      `â€¢ **Alert Posture:** ${alerts.filter(a => !a.isRead).length} unread signal alert(s) awaiting review.\n\n` +
      `To drill down further, check individual risk entries in the **Risk Register** or run a fresh simulation in the **Signal Lab**.`;

    sources.push("AIRMS Live Workspace");
    sources.push("Telemetry Metrics Feed");
  }

  return {
    answer,
    sources
  };
}
