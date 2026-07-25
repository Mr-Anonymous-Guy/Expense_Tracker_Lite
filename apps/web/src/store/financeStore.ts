import { create } from "zustand";
import type { Budget, Expense, Goal, HealthScore, Insight, Investment, Report } from "../types/finance";

type FinanceState = {
  expenses: Expense[];
  budgets: Budget[];
  investments: Investment[];
  goals: Goal[];
  reports: Report[];
  insights: Insight[];
  healthScore: HealthScore;
  addExpense: (expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  upsertBudget: (budget: Omit<Budget, "id" | "used">) => void;
  addInvestment: (investment: Omit<Investment, "id">) => void;
  addGoal: (goal: Omit<Goal, "id">) => void;
};

const expenses: Expense[] = [
  { id: "exp-1", merchant: "Urban Company", category: "Home", amount: 3400, spentAt: "2026-05-28", note: "Appliance service" },
  { id: "exp-2", merchant: "Swiggy", category: "Dining", amount: 1280, spentAt: "2026-05-27", note: "Team dinner" },
  { id: "exp-3", merchant: "Uber", category: "Transport", amount: 720, spentAt: "2026-05-25" },
  { id: "exp-4", merchant: "Zerodha Coin", category: "Investment", amount: 15000, spentAt: "2026-05-22", note: "Monthly SIP" },
  { id: "exp-5", merchant: "Amazon", category: "Shopping", amount: 4899, spentAt: "2026-05-20" },
  { id: "exp-6", merchant: "Airtel", category: "Bills", amount: 999, spentAt: "2026-05-18" }
];

const budgets: Budget[] = [
  { id: "bud-1", category: "Dining", monthlyLimit: 12000, used: 7850 },
  { id: "bud-2", category: "Transport", monthlyLimit: 8000, used: 4320 },
  { id: "bud-3", category: "Shopping", monthlyLimit: 15000, used: 10340 },
  { id: "bud-4", category: "Bills", monthlyLimit: 10000, used: 7100 }
];

const investments: Investment[] = [
  { id: "inv-1", asset: "Nifty 50 Index Fund", kind: "Mutual Fund", units: 128.7, currentValue: 284000, monthlySip: 15000, goal: "Retirement corpus" },
  { id: "inv-2", asset: "S&P 500 ETF", kind: "ETF", units: 42, currentValue: 171500, monthlySip: 8000, goal: "Global diversification" },
  { id: "inv-3", asset: "Sovereign Gold Bond", kind: "Fixed Income", units: 18, currentValue: 112800, monthlySip: 0, goal: "Inflation hedge" }
];

const goals: Goal[] = [
  { id: "goal-1", title: "Emergency fund", targetAmount: 300000, currentAmount: 226000, deadline: "2026-12-31", priority: "High" },
  { id: "goal-2", title: "MacBook upgrade", targetAmount: 180000, currentAmount: 78000, deadline: "2026-09-15", priority: "Medium" },
  { id: "goal-3", title: "Goa trip", targetAmount: 65000, currentAmount: 39000, deadline: "2026-08-01", priority: "Low" }
];

const reports: Report[] = [
  {
    id: "rep-1",
    title: "May spending intelligence",
    period: "May 2026",
    summary: "Spending is below trend, but dining and shopping require tighter weekly caps.",
    generatedAt: "2026-05-31"
  },
  {
    id: "rep-2",
    title: "Investment allocation review",
    period: "Q2 2026",
    summary: "SIP consistency is strong. Global diversification can be improved with a small monthly rebalance.",
    generatedAt: "2026-05-30"
  }
];

export const useFinanceStore = create<FinanceState>((set) => ({
  expenses,
  budgets,
  investments,
  goals,
  reports,
  insights: [
    {
      id: "ins-1",
      title: "Dining velocity is rising",
      body: "Dining spend is tracking 18% above your usual pace. A weekly cap of 2800 keeps the month inside budget.",
      impact: "Potential monthly saving: 2600",
      priority: "High"
    },
    {
      id: "ins-2",
      title: "SIP consistency is strong",
      body: "Your automated investing rate is 22% of income. Increasing the global ETF allocation by 3000 can improve diversification.",
      impact: "Better risk balance",
      priority: "Medium"
    },
    {
      id: "ins-3",
      title: "Emergency reserve gap",
      body: "Your reserve covers 4.6 months. Reaching 6 months needs around 74000 more in liquid savings.",
      impact: "Lower financial stress",
      priority: "Medium"
    }
  ],
  healthScore: {
    score: 82,
    savingsRate: 31,
    budgetUtilization: 68,
    emergencyMonths: 4.6
  },
  addExpense: (expense) =>
    set((state) => ({
      expenses: [{ ...expense, id: crypto.randomUUID() }, ...state.expenses]
    })),
  deleteExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== id)
    })),
  upsertBudget: (budget) =>
    set((state) => {
      const existing = state.budgets.find((item) => item.category === budget.category);
      if (existing) {
        return {
          budgets: state.budgets.map((item) =>
            item.id === existing.id ? { ...item, monthlyLimit: budget.monthlyLimit } : item
          )
        };
      }
      return {
        budgets: [...state.budgets, { ...budget, id: crypto.randomUUID(), used: 0 }]
      };
    }),
  addInvestment: (investment) =>
    set((state) => ({
      investments: [{ ...investment, id: crypto.randomUUID() }, ...state.investments]
    })),
  addGoal: (goal) =>
    set((state) => ({
      goals: [{ ...goal, id: crypto.randomUUID() }, ...state.goals]
    }))
}));
