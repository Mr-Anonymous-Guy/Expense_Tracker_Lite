import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, TrendingUp, Bot, Trophy, LineChart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FinSmart — Your AI Money Copilot" },
      { name: "description", content: "Track expenses, set goals, and get AI insights that explain what's happening with your money and what to do next." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* Nav */}
      <header className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl gradient-lime grid place-items-center">
            <Trophy className="h-5 w-5 text-sidebar" />
          </div>
          <span className="font-display font-bold text-lg">FinSmart</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Features</a>
          <a href="#stats" className="hover:text-foreground transition">Why us</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/auth"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link to="/auth"><Button size="sm" className="rounded-full gap-1">Get started <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full surface-card px-3 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI Forecast • Gamified savings • Bank-grade privacy
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-[1.02] tracking-tight">
            Money that <span className="bg-clip-text text-transparent gradient-violet">explains itself</span>.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            FinSmart isn't another expense tracker. It's an AI copilot that tells you what happened,
            why it happened, and what to do next — built for students and young professionals.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth"><Button size="lg" className="rounded-full gap-2">Start free <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link to="/dashboard"><Button size="lg" variant="outline" className="rounded-full">See dashboard</Button></Link>
          </div>
          <div className="flex items-center gap-3 pt-4 text-sm text-muted-foreground">
            <div className="flex">{[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}</div>
            Loved by 12,000+ early users
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative">
          <div className="absolute -inset-8 gradient-violet opacity-20 blur-3xl rounded-full" />
          <div className="relative card-dark p-6 shadow-soft">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs text-white/60">Total balance</div>
                <div className="text-4xl font-display font-bold text-white">$6,556.73</div>
              </div>
              <div className="h-10 w-10 rounded-xl gradient-lime grid place-items-center">
                <TrendingUp className="h-5 w-5 text-sidebar" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">Spending</div>
                <div className="text-xl font-semibold text-white mt-1">$3,450</div>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <div className="text-xs text-white/60">Saved</div>
                <div className="text-xl font-semibold text-white mt-1">$1,867</div>
              </div>
            </div>
            <div className="rounded-2xl card-lime p-4 flex items-center gap-3">
              <Bot className="h-5 w-5" />
              <div className="text-sm font-medium">You'll hit your $720 monthly goal in 6 days at this pace.</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-4xl md:text-5xl font-display font-bold">A finance OS, not a spreadsheet</h2>
          <p className="text-muted-foreground mt-4">Everything you need to answer three questions: what happened, why, and what to do next.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { icon: LineChart, t: "Smart Dashboard", d: "Net worth, cash flow, health score & trends in one premium view." },
            { icon: Bot, t: "AI Copilot", d: "Ask anything about your money. Get answers grounded in your data." },
            { icon: Trophy, t: "Gamified Savings", d: "XP, streaks, missions and a cute mascot that cheers you on." },
            { icon: TrendingUp, t: "Forecast Engine", d: "Predicts overspending before it happens and suggests fixes." },
            { icon: Sparkles, t: "Subscriptions", d: "Find forgotten Netflix, ChatGPT and Prime drains automatically." },
            { icon: ShieldCheck, t: "Private by design", d: "Encrypted, RLS-protected, you own every byte of your data." },
          ].map((f) => (
            <div key={f.t} className="surface-card p-6 hover-lift">
              <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center mb-4">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{f.t}</h3>
              <p className="text-sm text-muted-foreground mt-2">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="mx-auto max-w-7xl px-6 py-16">
        <div className="card-dark p-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { n: "12K+", l: "Active users" },
            { n: "$4.2M", l: "Tracked this year" },
            { n: "97%", l: "Hit a monthly goal" },
            { n: "4.9★", l: "App rating" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-4xl md:text-5xl font-display font-extrabold text-primary">{s.n}</div>
              <div className="text-sm text-white/60 mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold">Simple pricing</h2>
          <p className="text-muted-foreground mt-3">Start free. Upgrade only when you want AI superpowers.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name: "Starter", price: "$0", desc: "Everything you need to start.", featured: false, perks: ["Unlimited expenses", "3 budgets", "Basic charts"] },
            { name: "Pro", price: "$6", desc: "Most popular for students.", featured: true, perks: ["Unlimited everything", "Full AI copilot", "Forecasts & insights", "Gamified savings"] },
            { name: "Family", price: "$12", desc: "Up to 4 members.", featured: false, perks: ["All Pro features", "Shared budgets", "Family goals"] },
          ].map((p) => (
            <div key={p.name} className={`surface-card p-7 ${p.featured ? "ring-2 ring-primary relative" : ""}`}>
              {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-primary text-primary-foreground">Most popular</div>}
              <div className="font-semibold text-lg">{p.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-display font-extrabold">{p.price}</span>
                <span className="text-muted-foreground text-sm">/ month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{p.desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {p.perks.map((perk) => <li key={perk} className="flex gap-2"><Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />{perk}</li>)}
              </ul>
              <Link to="/auth" className="block mt-6">
                <Button className="w-full rounded-full" variant={p.featured ? "default" : "outline"}>Choose {p.name}</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="text-4xl font-display font-bold text-center mb-10">Questions, answered</h2>
        <div className="space-y-3">
          {[
            ["Is my data private?", "Yes. Every row is protected by row-level security, encrypted at rest, and only visible to you."],
            ["Do I need to connect my bank?", "No. You can add expenses manually, import CSVs, or connect later. FinSmart works fully without a bank link."],
            ["What does the AI do?", "The AI Copilot explains spending patterns, predicts overspending, drafts budgets, and answers natural-language questions about your money."],
            ["Can I cancel anytime?", "Yes. Cancel in one click from Settings. No questions, no dark patterns."],
          ].map(([q, a]) => (
            <details key={q} className="surface-card p-5 group">
              <summary className="cursor-pointer font-medium list-none flex justify-between items-center">{q}<span className="text-muted-foreground group-open:rotate-45 transition">+</span></summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="card-dark p-12 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full gradient-lime opacity-30 blur-3xl" />
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">Your money. Finally making sense.</h2>
          <p className="text-white/70 mt-3 max-w-xl mx-auto">Join thousands turning chaos into clarity with FinSmart.</p>
          <Link to="/auth" className="inline-block mt-6">
            <Button size="lg" className="rounded-full gap-2 bg-primary text-primary-foreground">Get started free <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      <footer className="mx-auto max-w-7xl px-6 py-10 text-center text-sm text-muted-foreground border-t">
        © 2026 FinSmart. Built with ❤️ for clarity.
      </footer>
    </div>
  );
}
