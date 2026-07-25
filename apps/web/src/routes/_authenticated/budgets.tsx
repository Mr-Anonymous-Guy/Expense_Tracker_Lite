import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { EXPENSE_CATEGORIES, CATEGORY_EMOJI, formatCurrency } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/budgets")({ component: Budgets });

function Budgets() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: budgets = [] } = useQuery({
    queryKey: ["budgets"],
    queryFn: async () => (await supabase.from("budgets").select("*")).data || [],
  });
  const { data: expenses = [] } = useQuery({
    queryKey: ["expenses"],
    queryFn: async () => (await supabase.from("expenses").select("*")).data || [],
  });
  const spent: Record<string, number> = {};
  (expenses as any[]).forEach((e) => { spent[e.category] = (spent[e.category] || 0) + Number(e.amount); });

  const create = useMutation({
    mutationFn: async (p: any) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("budgets").insert({ ...p, user_id: u.user!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Budget created"); qc.invalidateQueries({ queryKey: ["budgets"] }); setOpen(false); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("budgets").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });

  return (
    <PageShell title="Budgets" subtitle="Plan, track, and beat your spending caps">
      <div className="flex justify-end mb-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full gap-2"><Plus className="h-4 w-4" />New budget</Button></DialogTrigger>
          <BudgetForm onSubmit={(p) => create.mutate(p)} loading={create.isPending} />
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.length === 0 && <div className="surface-card p-10 text-center text-muted-foreground col-span-full">No budgets yet. Create one to start tracking.</div>}
        {(budgets as any[]).map((b) => {
          const used = spent[b.category] || 0;
          const pct = Math.min(100, (used / Number(b.monthly_limit)) * 100);
          const over = used > Number(b.monthly_limit);
          return (
            <div key={b.id} className="surface-card p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-lg">{CATEGORY_EMOJI[b.category]} <span className="font-semibold">{b.category}</span></div>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => del.mutate(b.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="mt-3 text-2xl font-display font-bold">{formatCurrency(used)}<span className="text-sm font-normal text-muted-foreground"> / {formatCurrency(Number(b.monthly_limit))}</span></div>
              <Progress value={pct} className="h-2 mt-3" />
              <div className={`text-xs mt-2 ${over ? "text-destructive" : "text-muted-foreground"}`}>
                {over ? `${formatCurrency(used - Number(b.monthly_limit))} over budget` : `${formatCurrency(Number(b.monthly_limit) - used)} left this month`}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

function BudgetForm({ onSubmit, loading }: { onSubmit: (p: any) => void; loading: boolean }) {
  const [category, setCategory] = useState<string>("Food");
  const [limit, setLimit] = useState("");
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New monthly budget</DialogTitle></DialogHeader>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit({ category, monthly_limit: Number(limit) }); }}>
        <div><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Monthly limit</Label><Input type="number" step="0.01" required value={limit} onChange={(e) => setLimit(e.target.value)} /></div>
        <DialogFooter><Button type="submit" disabled={loading} className="rounded-full">Save</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
