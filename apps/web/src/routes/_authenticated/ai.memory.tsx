import { createFileRoute } from "@tanstack/react-router";
import { Brain, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai/memory")({ component: Memory });

const facts = [
  "User prefers visual breakdowns over tables.",
  "Primary savings goal: Emergency fund ($2,000).",
  "Tends to overspend on Food on weekends.",
  "Salary lands on the 1st of each month.",
  "Cares about minimizing subscription costs.",
];

function Memory() {
  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 surface-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">What FinSmart remembers about you</h2>
        </div>
        <ul className="space-y-2">
          {facts.map(f => (
            <li key={f} className="flex items-start gap-3 p-3 rounded-xl bg-accent/30">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="surface-card p-6">
        <h3 className="font-semibold mb-2">Privacy</h3>
        <p className="text-sm text-muted-foreground">
          Memory is per-user, encrypted, and never shared. Clear any fact anytime — your model will forget instantly.
        </p>
      </div>
    </div>
  );
}
