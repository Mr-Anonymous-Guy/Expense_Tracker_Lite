import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/ai/history")({ component: History });

const sample = [
  { id: "1", title: "How can I save $200 more this month?", when: "2h ago", count: 12 },
  { id: "2", title: "Build a 50/30/20 budget", when: "Yesterday", count: 8 },
  { id: "3", title: "Forecast my end-of-month balance", when: "3 days ago", count: 6 },
  { id: "4", title: "Find subscriptions to cancel", when: "Last week", count: 4 },
];

function History() {
  return (
    <div className="space-y-2">
      {sample.map(c => (
        <Link key={c.id} to="/ai/chat" className="surface-card p-4 flex items-center gap-3 hover-lift">
          <div className="h-10 w-10 rounded-xl bg-accent text-primary grid place-items-center"><MessageSquare className="h-5 w-5" /></div>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{c.title}</div>
            <div className="text-xs text-muted-foreground">{c.count} messages · {c.when}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
