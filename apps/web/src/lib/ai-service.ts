// AI service placeholder — replace mock with real model later (Ollama / Lovable AI).
// All routes & UI exist; only the model call is mocked.

export type AIMessage = { role: "user" | "assistant"; content: string };

const MOCK_REPLIES = [
  "Looking at your spending, your biggest opportunity is **Food** — you spent ~18% more than your 30-day average this week. Cutting two coffee shop visits would save about $24/wk.",
  "Your savings rate is currently 14%. Aim for 20% — that means moving an extra ~$120/mo into your Emergency Fund goal.",
  "Subscription audit: you have 4 active subscriptions totaling $48/mo. I'd cancel Apple Music (overlaps with Spotify) for an instant $9.99/mo save.",
  "Your projected end-of-month balance is **$1,240**, assuming current spend continues. You'll be in the green if you skip 2 takeout orders.",
  "Great streak! You've logged expenses 7 days in a row 🔥 — that's worth +50 XP and unlocks the *Consistent Tracker* badge.",
];

export async function generateMockReply(messages: AIMessage[]): Promise<string> {
  // Simulate latency
  await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
  const last = messages[messages.length - 1]?.content?.toLowerCase() || "";
  if (last.includes("budget")) return "Based on your last 30 days, a healthy budget split is: 50% needs ($1,200), 30% wants ($720), 20% savings ($480). Want me to create these budgets for you?";
  if (last.includes("save") || last.includes("saving")) return MOCK_REPLIES[1];
  if (last.includes("subscription")) return MOCK_REPLIES[2];
  if (last.includes("forecast") || last.includes("predict")) return MOCK_REPLIES[3];
  return MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)];
}

export const SUGGESTED_PROMPTS = [
  "What's draining my budget this month?",
  "Build me a 50/30/20 budget",
  "Forecast my end-of-month balance",
  "Find subscriptions I should cancel",
  "How can I save $200 more this month?",
];
