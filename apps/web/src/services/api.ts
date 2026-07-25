import type { Budget, Expense, Goal, Investment, Report } from "../types/finance";

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:5000/api";

type ApiOptions = RequestInit & { token?: string | null };

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");
  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  register: (name: string, email: string, password: string) =>
    request<{ token: string; user: { id: string; name: string; email: string } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    }),
  expenses: (token: string) => request<{ expenses: Expense[] }>("/expenses", { token }),
  createExpense: (token: string, expense: Omit<Expense, "id">) =>
    request<{ expense: Expense }>("/expenses", {
      method: "POST",
      token,
      body: JSON.stringify(expense)
    }),
  deleteExpense: (token: string, id: string) =>
    request<{ ok: boolean }>(`/expenses/${id}`, { method: "DELETE", token }),
  budgets: (token: string) => request<{ budgets: Budget[] }>("/budgets", { token }),
  upsertBudget: (token: string, budget: Omit<Budget, "id" | "used">) =>
    request<{ budget: Budget }>("/budgets", {
      method: "POST",
      token,
      body: JSON.stringify(budget)
    }),
  investments: (token: string) => request<{ investments: Investment[] }>("/investments", { token }),
  createInvestment: (token: string, investment: Omit<Investment, "id">) =>
    request<{ investment: Investment }>("/investments", {
      method: "POST",
      token,
      body: JSON.stringify(investment)
    }),
  goals: (token: string) => request<{ goals: Goal[] }>("/goals", { token }),
  createGoal: (token: string, goal: Omit<Goal, "id">) =>
    request<{ goal: Goal }>("/goals", {
      method: "POST",
      token,
      body: JSON.stringify(goal)
    }),
  reports: (token: string) => request<{ reports: Report[] }>("/reports", { token }),
  analytics: (token: string) => request("/analytics/overview", { token }),
  insights: (token: string) => request("/ai/insights", { token })
};
