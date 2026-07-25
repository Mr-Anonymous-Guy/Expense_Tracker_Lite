export type User = {
  id: string;
  name: string;
  email: string;
};

export type Expense = {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  spentAt: string;
  note?: string;
};

export type Budget = {
  id: string;
  category: string;
  monthlyLimit: number;
  used: number;
};

export type Investment = {
  id: string;
  asset: string;
  kind: "Mutual Fund" | "ETF" | "Stock" | "Crypto" | "Fixed Income";
  units: number;
  currentValue: number;
  monthlySip: number;
  goal: string;
};

export type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  priority: "High" | "Medium" | "Low";
};

export type Report = {
  id: string;
  title: string;
  period: string;
  summary: string;
  generatedAt: string;
};

export type Insight = {
  id: string;
  title: string;
  body: string;
  impact: string;
  priority: "High" | "Medium" | "Low";
};

export type HealthScore = {
  score: number;
  savingsRate: number;
  budgetUtilization: number;
  emergencyMonths: number;
};
