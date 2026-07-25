import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, PieChart as PieIcon } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/investments")({ component: Investments });

const ALLOC = [
  { name: "Stocks", value: 4200, color: "var(--violet)" },
  { name: "Mutual Funds", value: 2100, color: "var(--lime)" },
  { name: "Crypto", value: 800, color: "var(--peach)" },
  { name: "FD", value: 1500, color: "var(--sky)" },
  { name: "SIP", value: 1200, color: "var(--mint)" },
];

const GROWTH = Array.from({ length: 12 }).map((_, i) => ({
  m: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  v: Math.round(6000 + i * 350 + Math.sin(i) * 400),
}));

function Investments() {
  const total = ALLOC.reduce((s, a) => s + a.value, 0);
  return (
    <PageShell title="Investments" subtitle="Portfolio overview & risk">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card-dark p-6 text-white">
          <div className="text-xs text-white/60">Portfolio value</div>
          <div className="text-4xl font-display font-bold mt-1">{formatCurrency(total)}</div>
          <div className="text-sm text-success mt-1 inline-flex items-center gap-1"><TrendingUp className="h-4 w-4" />+8.3% YTD</div>
          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white/5 rounded-xl p-3"><div className="text-white/60">Risk score</div><div className="text-lg font-bold mt-1">6.8 / 10</div></div>
            <div className="bg-white/5 rounded-xl p-3"><div className="text-white/60">Diversification</div><div className="text-lg font-bold mt-1">Good</div></div>
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="font-semibold mb-2 inline-flex items-center gap-2"><PieIcon className="h-4 w-4 text-primary" /> Allocation</div>
          <div className="h-48">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={ALLOC} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={2}>
                  {ALLOC.map((a) => <Cell key={a.name} fill={a.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs mt-2">
            {ALLOC.map(a => (
              <div key={a.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: a.color }} />{a.name}</div>
            ))}
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="font-semibold mb-2">Growth (12mo)</div>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={GROWTH}>
                <XAxis dataKey="m" stroke="var(--muted-foreground)" tickLine={false} axisLine={false} fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="v" fill="var(--violet)" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="surface-card mt-4 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="text-left px-4 py-3">Asset</th><th className="text-left px-4 py-3">Type</th><th className="text-right px-4 py-3">Value</th><th className="text-right px-4 py-3">Change</th></tr></thead>
          <tbody>
            {[
              ["AAPL", "Stock", 1200, 2.4],
              ["NIFTY 50 Index", "Mutual Fund", 2100, 1.1],
              ["BTC", "Crypto", 800, -3.2],
              ["SBI FD", "FD", 1500, 0.6],
              ["Vanguard SIP", "SIP", 1200, 1.8],
            ].map(([n, t, v, c]) => (
              <tr key={n as string} className="border-t">
                <td className="px-4 py-3 font-medium">{n}</td>
                <td className="px-4 py-3 text-muted-foreground">{t}</td>
                <td className="px-4 py-3 text-right">{formatCurrency(v as number)}</td>
                <td className={`px-4 py-3 text-right font-medium inline-flex justify-end items-center gap-1 ${(c as number) >= 0 ? "text-success" : "text-destructive"}`}>
                  {(c as number) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}{c}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
