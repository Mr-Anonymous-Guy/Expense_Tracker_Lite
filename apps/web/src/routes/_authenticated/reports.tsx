import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({ component: Reports });

function Reports() {
  const download = (name: string) => {
    const csv = "Report,Generated\n" + name + "," + new Date().toISOString();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${name}.csv`; a.click();
    URL.revokeObjectURL(url); toast.success(`${name} exported`);
  };
  return (
    <PageShell title="Reports" subtitle="Generate monthly & yearly reports">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: "Monthly summary", icon: BarChart3, desc: "Income, spending, and saved breakdown." },
          { name: "Yearly review", icon: FileText, desc: "Full-year category trends & insights." },
          { name: "Tax bundle", icon: FileText, desc: "All transactions for tax filing." },
          { name: "Budget performance", icon: BarChart3, desc: "How you tracked against your caps." },
          { name: "Goal progress", icon: BarChart3, desc: "Savings goal completion rate." },
          { name: "Subscription audit", icon: FileText, desc: "Find drains, cancel candidates." },
        ].map(r => (
          <div key={r.name} className="surface-card p-5">
            <div className="h-11 w-11 rounded-xl bg-accent text-primary grid place-items-center mb-3"><r.icon className="h-5 w-5" /></div>
            <div className="font-semibold">{r.name}</div>
            <p className="text-sm text-muted-foreground mt-1 mb-3">{r.desc}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => download(r.name)}><Download className="h-3.5 w-3.5" />CSV</Button>
              <Button size="sm" variant="outline" className="rounded-full gap-1" onClick={() => toast.info("PDF export coming soon")}><FileText className="h-3.5 w-3.5" />PDF</Button>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
