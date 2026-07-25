import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, format,
  isSameMonth, isToday, addMonths, subMonths,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_EMOJI, formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/calendar")({ component: CalendarPage });

function CalendarPage() {
  const [cursor, setCursor] = useState(new Date());
  const { data: ex = [] } = useQuery({
    queryKey: ["cal-expenses"],
    queryFn: async () => (await supabase.from("expenses").select("*")).data || [],
  });

  const start = startOfWeek(startOfMonth(cursor));
  const end = endOfWeek(endOfMonth(cursor));
  const days: Date[] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) days.push(d);

  const byDay = new Map<string, any[]>();
  (ex as any[]).forEach(e => {
    const k = format(new Date(e.occurred_at), "yyyy-MM-dd");
    if (!byDay.has(k)) byDay.set(k, []);
    byDay.get(k)!.push(e);
  });

  return (
    <PageShell title="Calendar" subtitle="Income, bills, and spending events">
      <div className="surface-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-semibold">{format(cursor, "MMMM yyyy")}</h2>
          <div className="flex gap-1">
            <Button size="icon" variant="outline" className="rounded-full h-9 w-9" onClick={() => setCursor(subMonths(cursor, 1))}><ChevronLeft className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" className="rounded-full h-9 w-9" onClick={() => setCursor(new Date())}>·</Button>
            <Button size="icon" variant="outline" className="rounded-full h-9 w-9" onClick={() => setCursor(addMonths(cursor, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-[11px] text-muted-foreground uppercase tracking-widest text-center pb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map(d => {
            const k = format(d, "yyyy-MM-dd");
            const items = byDay.get(k) || [];
            const total = items.reduce((s, x) => s + Number(x.amount), 0);
            return (
              <div key={k} className={`aspect-square rounded-xl p-1.5 border ${isSameMonth(d, cursor) ? "bg-card" : "bg-muted/30 text-muted-foreground"} ${isToday(d) ? "ring-2 ring-primary" : ""}`}>
                <div className="text-xs font-medium">{format(d, "d")}</div>
                {items.length > 0 && (
                  <div className="mt-1 space-y-0.5">
                    <div className="text-[10px] flex flex-wrap gap-0.5">
                      {items.slice(0, 3).map((i, idx) => <span key={idx}>{CATEGORY_EMOJI[i.category] || "💳"}</span>)}
                    </div>
                    <div className="text-[10px] text-destructive font-medium">{formatCurrency(total)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageShell>
  );
}
