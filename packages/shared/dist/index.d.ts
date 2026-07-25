export type ApiEnvelope<T> = {
    data?: T;
    error?: string;
};
export type HealthScore = {
    score: number;
    savingsRate: number;
    budgetUtilization: number;
    emergencyMonths: number;
};
export type AiModelProvider = "ollama" | "rules";
