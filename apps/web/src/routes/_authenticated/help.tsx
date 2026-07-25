import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Input } from "@/components/ui/input";
import { HelpCircle, MessageSquare, BookOpen, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/help")({ component: Help });

const QA = [
  { q: "How is my data protected?", a: "Every row is scoped to your account via row-level security and encrypted at rest." },
  { q: "Can I import bank statements?", a: "Yes — use the CSV import button on the Expenses page." },
  { q: "What does the AI Assistant do?", a: "It analyzes your real data, predicts overspending, drafts budgets, and answers natural-language questions." },
  { q: "How do I cancel my subscription?", a: "Go to Settings → Billing → Cancel. Takes one click. No questions asked." },
];

function Help() {
  return (
    <PageShell title="Help & Support" subtitle="We're here to help">
      <div className="surface-card p-6 mb-4">
        <Input placeholder="Search articles…" className="rounded-full max-w-xl" />
      </div>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        {[
          { icon: BookOpen, t: "Docs", d: "Read the manual." },
          { icon: MessageSquare, t: "Contact", d: "Talk to a human." },
          { icon: Sparkles, t: "Ask FinSmart AI", d: "Smart answers, instantly.", href: "/ai/chat" },
        ].map(c => (
          <Link key={c.t} to={c.href || "/help"} className="surface-card p-5 hover-lift">
            <div className="h-11 w-11 rounded-xl bg-accent text-primary grid place-items-center mb-3"><c.icon className="h-5 w-5" /></div>
            <div className="font-semibold">{c.t}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.d}</div>
          </Link>
        ))}
      </div>
      <div className="surface-card p-6">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary" />FAQ</h2>
        <div className="space-y-2">
          {QA.map(x => (
            <details key={x.q} className="rounded-xl bg-accent/30 p-4 group">
              <summary className="cursor-pointer font-medium list-none flex justify-between">{x.q}<span className="text-muted-foreground group-open:rotate-45 transition">+</span></summary>
              <p className="text-sm text-muted-foreground mt-2">{x.a}</p>
            </details>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
