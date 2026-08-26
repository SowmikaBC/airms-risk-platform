import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Risk, RiskAlert, DashboardSummary, TrendPoint, AnalyzeRiskInput, AssistantResponse } from "@shared/types";

// Base fetcher helper
async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

// 1. Dashboard Summary
export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: ["dashboard", "summary"],
    queryFn: () => fetchJson<DashboardSummary>("/api/dashboard/summary"),
  });
}

// 2. Dashboard Trends
export function useDashboardTrends() {
  return useQuery<TrendPoint[]>({
    queryKey: ["dashboard", "trends"],
    queryFn: () => fetchJson<TrendPoint[]>("/api/dashboard/trends"),
  });
}

// 3. Risks List (with search/filter query)
export function useRisks(filters?: { search?: string; severity?: string; status?: string; category?: string }) {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.severity) params.append("severity", filters.severity);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.category) params.append("category", filters.category);

  const qs = params.toString();
  const url = qs ? `/api/risks?${qs}` : "/api/risks";

  return useQuery<Risk[]>({
    queryKey: ["risks", filters],
    queryFn: () => fetchJson<Risk[]>(url),
  });
}

// 4. Single Risk Detail
export function useRisk(id: number) {
  return useQuery<Risk>({
    queryKey: ["risks", id],
    queryFn: () => fetchJson<Risk>(`/api/risks/${id}`),
    enabled: Boolean(id),
  });
}

// 5. Update Risk
export function useUpdateRisk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Risk> }) =>
      fetchJson<Risk>(`/api/risks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedRisk) => {
      queryClient.setQueryData(["risks", updatedRisk.id], updatedRisk);
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// 6. Detect & Analyze Risk
export function useAnalyzeRisk() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AnalyzeRiskInput) =>
      fetchJson<Risk>("/api/risks/analyze", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["risks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

// 7. Alerts
export function useAlerts() {
  return useQuery<RiskAlert[]>({
    queryKey: ["alerts"],
    queryFn: () => fetchJson<RiskAlert[]>("/api/alerts"),
  });
}

// 8. Mark Alert Read
export function useMarkAlertRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      fetchJson<RiskAlert>(`/api/alerts/${id}/read`, {
        method: "PATCH",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

// 9. AI Copilot / Assistant
export function useAskAssistant() {
  return useMutation({
    mutationFn: (data: { question: string }) =>
      fetchJson<AssistantResponse>("/api/assistant/ask", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  });
}
