import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { formatCurrency, CATEGORY_EMOJI } from "@/lib/format";
import { format } from "date-fns";

export const Route = createFileRoute("/_authenticated/transactions")({ component: Transactions });

function Transactions() {
  const { data: ex = [] } = useQuery({
    queryKey: ["all-expenses"],
    queryFn: async () => (await supabase.from("expenses").select("*").order("occurred_at", { ascending: false })).data || [],
  });
  const { data: inc = [] } = useQuery({
    queryKey: ["all-income"],
    queryFn: async () => (await supabase.from("income").select("*").order("occurred_at", { ascending: false })).data || [],
  });
  const all = [
    ...ex.map((e: any) => ({ ...e, kind: "expense" as const })),
    ...inc.map((i: any) => ({ ...i, kind: "income" as const })),
  ].sort((a, b) => +new Date(b.occurred_at) - +new Date(a.occurred_at));

  return (
    <PageShell title="Transactions" subtitle={`${all.length} total`}>
      <div className="surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Description</th><th className="text-left px-4 py-3">Type</th><th className="text-right px-4 py-3">Amount</th></tr></thead>
          <tbody>
            {all.length === 0 && <tr><td colSpan={4} className="text-center py-12 text-muted-foreground">No transactions yet.</td></tr>}
            {all.map((t: any) => (
              <tr key={t.kind + t.id} className="border-t">
                <td className="px-4 py-3 text-muted-foreground">{format(new Date(t.occurred_at), "d MMM yyyy")}</td>
                <td className="px-4 py-3 font-medium">{t.kind === "expense" ? `${CATEGORY_EMOJI[t.category] || "💳"} ${t.merchant || t.note || t.category}` : `💰 ${t.source}${t.note ? ` — ${t.note}` : ""}`}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${t.kind === "expense" ? "bg-destructive/10 text-destructive" : "bg-success/15 text-success"}`}>{t.kind}</span></td>
                <td className={`px-4 py-3 text-right font-semibold ${t.kind === "expense" ? "text-destructive" : "text-success"}`}>{t.kind === "expense" ? "-" : "+"}{formatCurrency(Number(t.amount))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}
