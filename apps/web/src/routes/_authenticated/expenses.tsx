import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2, Download, Filter } from "lucide-react";
import { EXPENSE_CATEGORIES, CATEGORY_EMOJI, formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/expenses")({
  component: Expenses,
});

type Expense = {
  id: string; amount: number; category: string; note: string | null;
  merchant: string | null; occurred_at: string; is_recurring: boolean;
};

function Expenses() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<string>("all");

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("expenses").select("*").order("occurred_at", { ascending: false });
      if (error) throw error;
      return data as Expense[];
    },
  });

  const createMut = useMutation({
    mutationFn: async (payload: Omit<Expense, "id">) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Not signed in");
      const { error } = await supabase.from("expenses").insert({ ...payload, user_id: u.user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Expense added");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dash-expenses"] });
      setOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["expenses"] });
      qc.invalidateQueries({ queryKey: ["dash-expenses"] });
    },
  });

  const filtered = expenses.filter(e => {
    if (filterCat !== "all" && e.category !== filterCat) return false;
    if (search && !`${e.merchant || ""} ${e.note || ""} ${e.category}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const total = filtered.reduce((s, e) => s + Number(e.amount), 0);

  const exportCsv = () => {
    const rows = ["Date,Merchant,Category,Amount,Note"];
    filtered.forEach(e => rows.push(`${format(new Date(e.occurred_at), "yyyy-MM-dd")},${e.merchant || ""},${e.category},${e.amount},"${(e.note || "").replace(/"/g, '""')}"`));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `expenses-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported");
  };

  return (
    <PageShell title="Expenses" subtitle={`${filtered.length} items · ${formatCurrency(total)}`}>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9 rounded-full" placeholder="Search merchant, note, category…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-44 rounded-full"><Filter className="h-4 w-4 mr-2" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={exportCsv}><Download className="h-4 w-4" />CSV</Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-full gap-2 ml-auto"><Plus className="h-4 w-4" />Add expense</Button>
          </DialogTrigger>
          <ExpenseForm onSubmit={(p) => createMut.mutate(p)} loading={createMut.isPending} />
        </Dialog>
      </div>

      <div className="surface-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Merchant / Note</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="w-12"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Loading…</td></tr>}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-16">
                <div className="text-4xl mb-2">📭</div>
                <div className="text-muted-foreground">No expenses match. Try adding one!</div>
              </td></tr>
            )}
            {filtered.map((e) => (
              <tr key={e.id} className="border-t hover:bg-muted/30">
                <td className="px-4 py-3 text-muted-foreground">{format(new Date(e.occurred_at), "d MMM")}</td>
                <td className="px-4 py-3 font-medium">{e.merchant || e.note || "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs">
                    {CATEGORY_EMOJI[e.category]} {e.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatCurrency(Number(e.amount))}</td>
                <td className="px-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteMut.mutate(e.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageShell>
  );
}

function ExpenseForm({ onSubmit, loading }: { onSubmit: (p: any) => void; loading: boolean }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<string>("Food");
  const [merchant, setMerchant] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Add expense</DialogTitle></DialogHeader>
      <form className="space-y-3" onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          amount: Number(amount), category, merchant: merchant || null, note: note || null,
          occurred_at: new Date(date).toISOString(), is_recurring: false,
        });
      }}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Amount</Label>
            <Input type="number" step="0.01" min="0" required value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{CATEGORY_EMOJI[c]} {c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Merchant</Label>
          <Input value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="Starbucks" />
        </div>
        <div>
          <Label>Note (optional)</Label>
          <Input value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading} className="rounded-full">{loading ? "Saving…" : "Save expense"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
