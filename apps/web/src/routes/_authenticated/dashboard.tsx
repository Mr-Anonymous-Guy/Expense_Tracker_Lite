import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { formatCurrency, CATEGORY_EMOJI } from "@/lib/format";
import {
  TrendingUp, TrendingDown, Wallet, PiggyBank, Target, Sparkles,
  ArrowUpRight, MoreHorizontal, Plus, Send, ArrowDownLeft, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid,
} from "recharts";
import { useAuth } from "@/hooks/useAuth";
import { format, subDays, startOfDay } from "date-fns";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
});

type Expense = { id: string; amount: number; category: string; note: string | null; merchant: string | null; occurred_at: string };
type Income = { id: string; amount: number; source: string; occurred_at: string };

function Dashboard() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["dash-expenses"],
    queryFn: async () => {
      const since = subDays(new Date(), 90).toISOString();
      const { data, error } = await supabase.from("expenses").select("*")
        .gte("occurred_at", since).order("occurred_at", { ascending: false });
      if (error) throw error;
      return data as Expense[];
    },
  });
  const { data: income = [] } = useQuery<Income[]>({
    queryKey: ["dash-income"],
    queryFn: async () => {
      const since = subDays(new Date(), 90).toISOString();
      const { data, error } = await supabase.from("income").select("*").gte("occurred_at", since);
      if (error) throw error;
      return data as Income[];
    },
  });

  const totalSpending = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = income.reduce((s, i) => s + Number(i.amount), 0);
  const totalSaved = Math.max(totalIncome - totalSpending, 0);
  const balance = totalIncome - totalSpending + 5000; // demo starting balance

  // 7-day series
  const series = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    const key = startOfDay(d).toISOString();
    const dayExp = expenses.filter(e => startOfDay(new Date(e.occurred_at)).toISOString() === key)
      .reduce((s, e) => s + Number(e.amount), 0);
    return { day: format(d, "EEE"), spending: Math.round(dayExp) };
  });

  // Category breakdown
  const catMap = new Map<string, number>();
  expenses.forEach(e => catMap.set(e.category, (catMap.get(e.category) || 0) + Number(e.amount)));
  const cats = [...catMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const catTotal = cats.reduce((s, [, v]) => s + v, 0) || 1;

  // Health score
  const savingsRate = totalIncome > 0 ? totalSaved / totalIncome : 0;
  const health = Math.min(100, Math.round(40 + savingsRate * 70));

  const recent = expenses.slice(0, 5);

  return (
    <PageShell title={`Welcome back, ${name}!`} subtitle="Dashboard">
      {/* Top KPI row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <KpiCard variant="dark" icon={<Wallet className="h-5 w-5" />} label="Total Balance" value={formatCurrency(balance)} trend="+2.4%" up />
        <KpiCard variant="light" icon={<TrendingDown className="h-5 w-5" />} label="Total Spending" value={formatCurrency(totalSpending)} trend={totalSpending > 1000 ? "+8%" : "-3%"} up={totalSpending > 1000} negative />
        <KpiCard variant="light" icon={<PiggyBank className="h-5 w-5" />} label="Total Saved" value={formatCurrency(totalSaved)} trend="+12%" up />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left main column */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Income chart */}
          <div className="surface-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-muted-foreground">Income</div>
                <div className="text-2xl font-display font-bold">{formatCurrency(totalIncome)}</div>
                <div className="text-xs text-success mt-0.5 inline-flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +28%</div>
              </div>
              <span className="text-[11px] text-muted-foreground">90 days</span>
            </div>
            <div className="h-24">
              <ResponsiveContainer>
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--violet)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="spending" stroke="var(--violet)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="surface-card p-5">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Transactions</div>
              <Link to="/transactions" className="text-xs text-muted-foreground hover:text-foreground">This week ›</Link>
            </div>
            <div className="space-y-3">
              {recent.length === 0 && <EmptyTx />}
              {recent.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-accent grid place-items-center text-base">
                    {CATEGORY_EMOJI[e.category] || "💳"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{e.merchant || e.note || e.category}</div>
                    <div className="text-[11px] text-muted-foreground">{format(new Date(e.occurred_at), "d MMM yyyy")}</div>
                  </div>
                  <div className="text-sm font-semibold">{formatCurrency(Number(e.amount))}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses bar chart */}
          <div className="surface-card p-5 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="font-semibold">Spending</div>
                <div className="text-xs text-muted-foreground">Last 7 days</div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">2026</Button>
            </div>
            <div className="h-44">
              <ResponsiveContainer>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={12} />
                  <Tooltip cursor={{ fill: "var(--accent)" }} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="spending" fill="var(--violet)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Categories */}
          <div className="surface-card p-5 md:col-span-2">
            <div className="font-semibold mb-4">Top categories</div>
            <div className="space-y-3">
              {cats.length === 0 && <div className="text-sm text-muted-foreground">No expenses yet — <Link to="/expenses" className="text-primary">add your first one</Link>.</div>}
              {cats.map(([cat, val]) => (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="flex items-center gap-2">{CATEGORY_EMOJI[cat]} {cat}</span>
                    <span className="text-muted-foreground">{formatCurrency(val)}</span>
                  </div>
                  <Progress value={(val / catTotal) * 100} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — card + AI insight */}
        <div className="space-y-4">
          <div className="card-dark p-5 text-white">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">My Cards</div>
                <div className="text-xs text-white/60">2 Cards</div>
              </div>
              <Button size="icon" className="rounded-full h-8 w-8 bg-primary"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="mt-4 rounded-2xl card-lime p-5 relative overflow-hidden">
              <div className="text-xs font-bold tracking-widest">VISA</div>
              <div className="text-2xl font-bold mt-6">{formatCurrency(3265.75)}</div>
              <div className="text-xs mt-1 opacity-70">**** **** 1287 2342</div>
              <div className="text-[10px] mt-3 opacity-70">Exp 05/29</div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="secondary" size="sm" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 gap-1"><Send className="h-3.5 w-3.5" />Send</Button>
              <Button variant="secondary" size="sm" className="rounded-full bg-white/10 hover:bg-white/20 text-white border-0 gap-1"><ArrowDownLeft className="h-3.5 w-3.5" />Receive</Button>
            </div>
          </div>

          {/* AI Insight */}
          <Link to="/ai" className="block surface-card p-5 hover-lift">
            <div className="flex items-center gap-2 text-xs text-primary font-medium mb-2">
              <Sparkles className="h-3.5 w-3.5" /> AI Insight
            </div>
            <p className="text-sm font-medium leading-snug">
              You've spent <b>{formatCurrency(totalSpending * 0.4)}</b> on Food this month — 18% more than usual. Want a suggested cap?
            </p>
            <div className="mt-3 text-xs text-muted-foreground">Tap to chat with FinSmart AI ›</div>
          </Link>

          {/* Health */}
          <div className="surface-card p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Health Score</div>
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-4xl font-display font-extrabold">{health}<span className="text-base text-muted-foreground">/100</span></div>
            <Progress value={health} className="h-2 mt-3" />
            <p className="text-xs text-muted-foreground mt-2">Based on savings rate, spending vs income, and goal progress.</p>
          </div>

          {/* Goal */}
          <Link to="/goals" className="block surface-card p-5 hover-lift">
            <div className="flex items-center justify-between">
              <div className="font-semibold flex items-center gap-2"><Target className="h-4 w-4 text-primary" /> Goal Progress</div>
              <span className="text-xs text-muted-foreground">2 active</span>
            </div>
            <div className="mt-3 text-sm font-medium">Emergency fund</div>
            <Progress value={45} className="h-2 mt-2" />
            <div className="flex justify-between text-xs mt-2 text-muted-foreground"><span>{formatCurrency(900)}</span><span>{formatCurrency(2000)}</span></div>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function KpiCard({ variant, icon, label, value, trend, up, negative }: {
  variant: "dark" | "light"; icon: React.ReactNode; label: string; value: string; trend: string; up?: boolean; negative?: boolean;
}) {
  const Trend = up ? TrendingUp : TrendingDown;
  const trendCls = negative ? "text-destructive" : up ? "text-success" : "text-muted-foreground";
  if (variant === "dark") {
    return (
      <div className="card-dark p-5 text-white">
        <div className="flex justify-between items-start">
          <div className="h-11 w-11 rounded-xl gradient-lime grid place-items-center text-sidebar">{icon}</div>
          <MoreHorizontal className="h-4 w-4 text-white/40" />
        </div>
        <div className="text-xs text-white/60 mt-6">{label}</div>
        <div className="text-3xl font-display font-bold mt-1">{value}</div>
        <div className={`text-xs mt-1 inline-flex items-center gap-1 ${trendCls}`}>
          <Trend className="h-3 w-3" /> {trend}
        </div>
      </div>
    );
  }
  return (
    <div className="surface-card p-5">
      <div className="flex justify-between items-start">
        <div className="h-11 w-11 rounded-xl bg-accent grid place-items-center text-primary">{icon}</div>
        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-xs text-muted-foreground mt-6">{label}</div>
      <div className="text-3xl font-display font-bold mt-1">{value}</div>
      <div className={`text-xs mt-1 inline-flex items-center gap-1 ${trendCls}`}>
        <Trend className="h-3 w-3" /> {trend}
      </div>
    </div>
  );
}

function EmptyTx() {
  return (
    <div className="text-center py-6">
      <div className="text-3xl mb-2">💸</div>
      <div className="text-sm text-muted-foreground">No transactions yet.</div>
      <Link to="/expenses"><Button size="sm" variant="outline" className="mt-3 rounded-full">Add expense</Button></Link>
    </div>
  );
}
