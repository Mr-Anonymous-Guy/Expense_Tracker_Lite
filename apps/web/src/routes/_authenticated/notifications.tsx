import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Bell, Trophy, AlertCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/notifications")({ component: NotificationsPage });

const SEED = [
  { id: 1, icon: AlertCircle, color: "bg-destructive/15 text-destructive", title: "Budget alert", body: "You hit 90% of your Food budget this month.", time: "2h ago", read: false },
  { id: 2, icon: Trophy, color: "bg-warning/20 text-warning-foreground", title: "Achievement unlocked!", body: "You earned the *Consistent Tracker* badge.", time: "1d ago", read: false },
  { id: 3, icon: Bell, color: "bg-accent text-primary", title: "Netflix renews tomorrow", body: "$15.99 will be charged to your Visa.", time: "1d ago", read: true },
  { id: 4, icon: Sparkles, color: "bg-success/15 text-success", title: "AI insight ready", body: "Your weekly spending summary is available.", time: "3d ago", read: true },
];

function NotificationsPage() {
  const [items, setItems] = useState(SEED);
  return (
    <PageShell title="Notifications" subtitle={`${items.filter(i => !i.read).length} unread`}
      actions={<Button size="sm" variant="outline" className="rounded-full" onClick={() => setItems(items.map(i => ({ ...i, read: true })))}>Mark all read</Button>}>
      <div className="space-y-2">
        {items.map(n => (
          <div key={n.id} className={`surface-card p-4 flex gap-3 ${!n.read ? "ring-1 ring-primary/30" : ""}`}>
            <div className={`h-10 w-10 rounded-xl grid place-items-center ${n.color}`}><n.icon className="h-5 w-5" /></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">{n.title}</span>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary" />}
              </div>
              <div className="text-sm text-muted-foreground">{n.body}</div>
              <div className="text-xs text-muted-foreground mt-1">{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
