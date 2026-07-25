import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { subDays, format, startOfDay } from "date-fns";
import { CATEGORY_EMOJI, formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/analytics")({ component: Analytics });

const COLORS = ["var(--violet)", "var(--lime)", "var(--peach)", "var(--sky)", "var(--mint)", "oklch(0.7 0.2 350)"];

function Analytics() {
  const { data: ex = [] } = useQuery({
    queryKey: ["analytics-expenses"],
    queryFn: async () => (await supabase.from("expenses").select("*")).data || [],
  });
  const { data: inc = [] } = useQuery({
    queryKey: ["analytics-income"],
    queryFn: async () => (await supabase.from("income").select("*")).data || [],
  });

  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = subDays(new Date(), 29 - i);
    const key = startOfDay(d).toISOString();
    const spending = (ex as any[]).filter(e => startOfDay(new Date(e.occurred_at)).toISOString() === key).reduce((s, e) => s + Number(e.amount), 0);
    const income = (inc as any[]).filter(i => startOfDay(new Date(i.occurred_at)).toISOString() === key).reduce((s, i) => s + Number(i.amount), 0);
    return { day: format(d, "d MMM"), spending: Math.round(spending), income: Math.round(income) };
  });

  const catMap = new Map<string, number>();
  (ex as any[]).forEach(e => catMap.set(e.category, (catMap.get(e.category) || 0) + Number(e.amount)));
  const pie = [...catMap.entries()].map(([name, value]) => ({ name, value }));

  let net = 0;
  const netSeries = days.map(d => ({ day: d.day, net: (net += d.income - d.spending) }));

  return (
    <PageShell title="Analytics" subtitle="Patterns, comparisons, and trends">
      <div className="grid lg:grid-cols-2 gap-4">
        <Chart title="Income vs Spending (30d)">
          <ResponsiveContainer><LineChart data={days}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" hide /><YAxis hide />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Legend />
            <Line type="monotone" dataKey="income" stroke="var(--lime)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="spending" stroke="var(--violet)" strokeWidth={2} dot={false} />
          </LineChart></ResponsiveContainer>
        </Chart>

        <Chart title="Category breakdown">
          {pie.length === 0 ? <Empty /> : (
          <ResponsiveContainer><PieChart>
            <Pie data={pie} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={2} label={(p) => `${CATEGORY_EMOJI[p.name as string] || ""} ${p.name}`}>
              {pie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v: any) => formatCurrency(Number(v))} contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
          </PieChart></ResponsiveContainer>
          )}
        </Chart>

        <Chart title="Daily spending">
          <ResponsiveContainer><BarChart data={days}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" hide />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Bar dataKey="spending" fill="var(--violet)" radius={[6,6,0,0]} />
          </BarChart></ResponsiveContainer>
        </Chart>

        <Chart title="Net worth trend">
          <ResponsiveContainer><AreaChart data={netSeries}>
            <defs><linearGradient id="netg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--lime)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--lime)" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" hide />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Area type="monotone" dataKey="net" stroke="var(--lime)" fill="url(#netg)" strokeWidth={2} />
          </AreaChart></ResponsiveContainer>
        </Chart>
      </div>
    </PageShell>
  );
}

function Chart({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-5">
      <div className="font-semibold mb-3">{title}</div>
      <div className="h-64">{children}</div>
    </div>
  );
}
function Empty() { return <div className="h-full grid place-items-center text-sm text-muted-foreground">Add expenses to unlock insights.</div>; }
