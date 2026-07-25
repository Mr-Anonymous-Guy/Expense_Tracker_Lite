import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/income")({ component: IncomePage });

const SOURCES = ["Salary", "Freelance", "Passive", "Gift", "Other"] as const;

function IncomePage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: rows = [] } = useQuery({
    queryKey: ["income"],
    queryFn: async () => {
      const { data, error } = await supabase.from("income").select("*").order("occurred_at", { ascending: false });
      if (error) throw error;
      return data as Array<{ id: string; amount: number; source: string; occurred_at: string; note: string | null }>;
    },
  });
  const total = rows.reduce((s, r) => s + Number(r.amount), 0);
  const create = useMutation({
    mutationFn: async (p: any) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("income").insert({ ...p, user_id: u.user!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Income added"); qc.invalidateQueries({ queryKey: ["income"] }); setOpen(false); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("income").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["income"] }),
  });

  return (
    <PageShell title="Income" subtitle={`${rows.length} entries · ${formatCurrency(total)}`}>
      <div className="flex justify-end mb-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full gap-2"><Plus className="h-4 w-4" />Add income</Button></DialogTrigger>
          <IncomeForm onSubmit={(p) => create.mutate(p)} loading={create.isPending} />
        </Dialog>
      </div>
      <div className="surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground"><tr><th className="text-left px-4 py-3">Date</th><th className="text-left px-4 py-3">Source</th><th className="text-left px-4 py-3">Note</th><th className="text-right px-4 py-3">Amount</th><th></th></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">No income recorded.</td></tr>}
            {rows.map(r => (
              <tr key={r.id} className="border-t">
                <td className="px-4 py-3 text-muted-foreground">{format(new Date(r.occurred_at), "d MMM yyyy")}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-success/15 text-success px-2 py-0.5 text-xs">{r.source}</span></td>
                <td className="px-4 py-3">{r.note || "—"}</td>
                <td className="px-4 py-3 text-right font-semibold text-success">+{formatCurrency(Number(r.amount))}</td>
                <td><Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => del.mutate(r.id)}><Trash2 className="h-4 w-4" /></Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

function IncomeForm({ onSubmit, loading }: { onSubmit: (p: any) => void; loading: boolean }) {
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<string>("Salary");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add income</DialogTitle></DialogHeader>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit({ amount: Number(amount), source, note: note || null, occurred_at: new Date(date).toISOString() }); }}>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Amount</Label><Input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        </div>
        <div><Label>Source</Label><Select value={source} onValueChange={setSource}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
        <div><Label>Note</Label><Input value={note} onChange={(e) => setNote(e.target.value)} /></div>
        <DialogFooter><Button type="submit" disabled={loading} className="rounded-full">{loading ? "Saving…" : "Save"}</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
