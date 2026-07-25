import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { format } from "date-fns";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/subscriptions")({ component: SubsPage });

function SubsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: subs = [] } = useQuery({
    queryKey: ["subs"],
    queryFn: async () => (await supabase.from("subscriptions").select("*").order("next_renewal", { ascending: true })).data || [],
  });
  const monthly = (subs as any[]).reduce((s, x) => s + Number(x.amount), 0);
  const create = useMutation({
    mutationFn: async (p: any) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("subscriptions").insert({ ...p, user_id: u.user!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Subscription added"); qc.invalidateQueries({ queryKey: ["subs"] }); setOpen(false); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("subscriptions").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subs"] }),
  });

  return (
    <PageShell title="Subscriptions" subtitle={`${subs.length} active · ${formatCurrency(monthly)} / month`}>
      <div className="flex justify-end mb-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full gap-2"><Plus className="h-4 w-4" />New subscription</Button></DialogTrigger>
          <SubForm onSubmit={(p) => create.mutate(p)} loading={create.isPending} />
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subs.length === 0 && <div className="surface-card p-10 text-center text-muted-foreground col-span-full">No subscriptions tracked.</div>}
        {(subs as any[]).map(s => (
          <div key={s.id} className="surface-card p-4 flex items-center gap-3 hover-lift">
            <div className="h-12 w-12 rounded-xl bg-accent text-primary grid place-items-center font-bold">{s.name[0]}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{s.name}</div>
              <div className="text-xs text-muted-foreground">Renews {s.next_renewal ? format(new Date(s.next_renewal), "d MMM") : "soon"} · {s.billing_cycle}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold">{formatCurrency(Number(s.amount))}</div>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => del.mutate(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}

function SubForm({ onSubmit, loading }: { onSubmit: (p: any) => void; loading: boolean }) {
  const [name, setName] = useState(""); const [amount, setAmount] = useState(""); const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New subscription</DialogTitle></DialogHeader>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit({ name, amount: Number(amount), next_renewal: date, billing_cycle: "monthly" }); }}>
        <div><Label>Name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Netflix" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Amount</Label><Input type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div><Label>Next renewal</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        </div>
        <DialogFooter><Button type="submit" disabled={loading} className="rounded-full">Save</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
