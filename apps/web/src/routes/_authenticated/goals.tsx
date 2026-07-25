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
import { Plus, Trash2, Target } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/goals")({ component: Goals });

function Goals() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: goals = [] } = useQuery({
    queryKey: ["goals"],
    queryFn: async () => (await supabase.from("goals").select("*").order("created_at", { ascending: false })).data || [],
  });
  const create = useMutation({
    mutationFn: async (p: any) => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("goals").insert({ ...p, user_id: u.user!.id });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Goal created"); qc.invalidateQueries({ queryKey: ["goals"] }); setOpen(false); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { await supabase.from("goals").delete().eq("id", id); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["goals"] }),
  });
  const contribute = useMutation({
    mutationFn: async ({ id, amount, current }: { id: string; amount: number; current: number }) => {
      await supabase.from("goals").update({ saved_amount: current + amount }).eq("id", id);
    },
    onSuccess: () => { toast.success("Added to goal"); qc.invalidateQueries({ queryKey: ["goals"] }); },
  });

  return (
    <PageShell title="Goals" subtitle="Dream it, track it, achieve it">
      <div className="flex justify-end mb-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full gap-2"><Plus className="h-4 w-4" />New goal</Button></DialogTrigger>
          <GoalForm onSubmit={(p) => create.mutate(p)} loading={create.isPending} />
        </Dialog>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.length === 0 && <div className="surface-card p-10 text-center text-muted-foreground col-span-full">No goals yet — start dreaming!</div>}
        {(goals as any[]).map((g) => {
          const pct = Math.min(100, (Number(g.saved_amount) / Number(g.target_amount)) * 100);
          return (
            <div key={g.id} className="surface-card p-5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2"><div className="h-10 w-10 rounded-xl bg-accent text-primary grid place-items-center"><Target className="h-5 w-5" /></div><div className="font-semibold">{g.name}</div></div>
                <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => del.mutate(g.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
              <div className="mt-4 text-2xl font-display font-bold">{formatCurrency(Number(g.saved_amount))}<span className="text-sm font-normal text-muted-foreground"> / {formatCurrency(Number(g.target_amount))}</span></div>
              <Progress value={pct} className="h-2 mt-3" />
              <div className="text-xs text-muted-foreground mt-2">{pct.toFixed(0)}% complete</div>
              <Button size="sm" variant="outline" className="rounded-full mt-3 w-full" onClick={() => contribute.mutate({ id: g.id, amount: 50, current: Number(g.saved_amount) })}>+ Add $50</Button>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
}

function GoalForm({ onSubmit, loading }: { onSubmit: (p: any) => void; loading: boolean }) {
  const [name, setName] = useState(""); const [target, setTarget] = useState(""); const [saved, setSaved] = useState("0");
  return (
    <DialogContent>
      <DialogHeader><DialogTitle>New goal</DialogTitle></DialogHeader>
      <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSubmit({ name, target_amount: Number(target), saved_amount: Number(saved) }); }}>
        <div><Label>Goal name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Emergency fund" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Target</Label><Input type="number" required value={target} onChange={(e) => setTarget(e.target.value)} /></div>
          <div><Label>Saved so far</Label><Input type="number" value={saved} onChange={(e) => setSaved(e.target.value)} /></div>
        </div>
        <DialogFooter><Button type="submit" disabled={loading} className="rounded-full">Create</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
