export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

export const EXPENSE_CATEGORIES = [
  "Food", "Transport", "Shopping", "Bills", "Entertainment",
  "Health", "Education", "Travel", "Subscriptions", "Other",
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const CATEGORY_EMOJI: Record<string, string> = {
  Food: "🍔", Transport: "🚗", Shopping: "🛍️", Bills: "💡",
  Entertainment: "🎬", Health: "💊", Education: "📚", Travel: "✈️",
  Subscriptions: "📺", Other: "💳",
};
