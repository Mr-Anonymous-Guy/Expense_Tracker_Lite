import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Sparkles, MessageSquare, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUGGESTED_PROMPTS } from "@/lib/ai-service";

export const Route = createFileRoute("/_authenticated/ai/")({
  component: AIOverview,
});

function AIOverview() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 card-dark p-8 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-48 w-48 gradient-lime rounded-full opacity-30 blur-3xl" />
        <div className="h-12 w-12 rounded-2xl gradient-lime grid place-items-center text-sidebar mb-4">
          <Bot className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-display font-bold">Meet your AI copilot</h2>
        <p className="text-white/70 mt-2 max-w-lg">
          Ask anything about your money. FinSmart explains what's happening, why,
          and what you should do next — grounded in your real data.
        </p>
        <Link to="/ai/chat" className="inline-block mt-6">
          <Button className="rounded-full gap-2">Start chatting <MessageSquare className="h-4 w-4" /></Button>
        </Link>
      </div>

      <div className="surface-card p-6">
        <div className="font-semibold flex items-center gap-2 mb-3"><Sparkles className="h-4 w-4 text-primary" />Suggested prompts</div>
        <div className="space-y-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <Link key={p} to="/ai/chat" search={{ q: p } as any} className="block text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-3 py-2 transition">
              {p}
            </Link>
          ))}
        </div>
      </div>

      {[
        { icon: TrendingUp, t: "Spending insights", d: "Pattern detection across categories with weekly summaries." },
        { icon: Lightbulb, t: "Smart suggestions", d: "Budgets, cuts, and savings ideas grounded in your real numbers." },
        { icon: Bot, t: "Always available", d: "Mock responses today, real AI tomorrow — architecture ready." },
      ].map(f => (
        <div key={f.t} className="surface-card p-5">
          <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center text-primary mb-3"><f.icon className="h-5 w-5" /></div>
          <div className="font-semibold">{f.t}</div>
          <p className="text-sm text-muted-foreground mt-1">{f.d}</p>
        </div>
      ))}
    </div>
  );
}
