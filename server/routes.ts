import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { calculateRiskScore, askAssistant } from "./ai";
import { AnalyzeRiskInput } from "./types";

export function registerRoutes(app: Express) {
  app.get("/api/dashboard/summary", async (_req: Request, res: Response) => {
    try {
      const summary = await storage.getDashboardSummary();
      res.json(summary);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/dashboard/trends", async (_req: Request, res: Response) => {
    try {
      const trends = await storage.getDashboardTrends();
      res.json(trends);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/risks", async (req: Request, res: Response) => {
    try {
      const { search, severity, status, category } = req.query as Record<string, string>;
      const risks = await storage.getRisks({ search, severity, status, category });
      res.json(risks);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/risks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const risk = await storage.getRiskById(id);
      if (!risk) {
        return res.status(404).json({ error: "Risk not found" });
      }
      res.json(risk);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/risks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const updated = await storage.updateRisk(id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Risk not found" });
      }
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/risks", async (req: Request, res: Response) => {
    try {
      const risk = await storage.createRisk(req.body);
      res.status(201).json(risk);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/risks/analyze", async (req: Request, res: Response) => {
    try {
      const input: AnalyzeRiskInput = req.body;
      if (!input.title || !input.category || !input.description) {
        return res.status(400).json({ error: "Missing required fields: title, category, description" });
      }

      const analysis = calculateRiskScore(input);

      const newRisk = await storage.createRisk({
        title: input.title,
        description: input.description,
        category: input.category,
        probability: input.probability || 3,
        impact: input.impact || 3,
        score: analysis.score,
        severity: analysis.severity,
        confidence: analysis.confidence,
        trend: analysis.trend,
        status: "Open",
        owner: "Unassigned",
        source: "Signal telemetry",
        reasons: analysis.reasons,
        recommendations: analysis.recommendations,
        events: [
          { label: "Signal detected", value: `${analysis.score}/100`, description: "Computed by AIRMS Signal Engine" }
        ]
      });

      res.status(201).json(newRisk);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/alerts", async (_req: Request, res: Response) => {
    try {
      const alerts = await storage.getAlerts();
      res.json(alerts);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/alerts/:id/read", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      const alert = await storage.markAlertRead(id);
      if (!alert) {
        return res.status(404).json({ error: "Alert not found" });
      }
      res.json(alert);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/assistant/ask", async (req: Request, res: Response) => {
    try {
      const { question } = req.body;
      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "question string is required" });
      }

      const response = await askAssistant(question);
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });
}
