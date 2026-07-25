import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Bot, MessageSquare, History, Brain, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/ai")({
  component: AILayout,
});

const tabs = [
  { to: "/ai", label: "Overview", icon: Bot, exact: true },
  { to: "/ai/chat", label: "Chat", icon: MessageSquare },
  { to: "/ai/history", label: "History", icon: History },
  { to: "/ai/memory", label: "Memory", icon: Brain },
  { to: "/ai/settings", label: "Settings", icon: SettingsIcon },
];

function AILayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <PageShell title="AI Assistant" subtitle="Your financial copilot">
      <div className="surface-card p-1 inline-flex gap-1 mb-4 flex-wrap">
        {tabs.map((t) => {
          const active = t.exact ? pathname === t.to : pathname.startsWith(t.to) && pathname !== "/ai";
          const isActive = t.exact ? pathname === t.to : pathname === t.to;
          return (
            <Link key={t.to} to={t.to} className={cn(
              "px-3.5 py-1.5 rounded-full text-sm font-medium inline-flex items-center gap-2 transition",
              isActive ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            )}>
              <t.icon className="h-3.5 w-3.5" />{t.label}
            </Link>
          );
        })}
      </div>
      <Outlet />
    </PageShell>
  );
}
