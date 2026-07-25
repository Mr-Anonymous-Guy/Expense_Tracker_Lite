import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";

const THEMES = [
  { v: "light", l: "Light" }, { v: "dark", l: "Dark" }, { v: "pastel", l: "Pastel" },
  { v: "midnight", l: "Midnight" }, { v: "purple", l: "Purple" },
];

export const Route = createFileRoute("/_authenticated/settings")({ component: SettingsPage });

function SettingsPage() {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    const t = localStorage.getItem("fs-theme") || "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark" || t === "midnight");
  }, []);
  const change = (t: string) => {
    setTheme(t);
    localStorage.setItem("fs-theme", t);
    document.documentElement.classList.toggle("dark", t === "dark" || t === "midnight");
  };

  return (
    <PageShell title="Settings" subtitle="Preferences & privacy">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card title="Appearance">
          <Row label="Theme">
            <Select value={theme} onValueChange={change}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{THEMES.map(t => <SelectItem key={t.v} value={t.v}>{t.l}</SelectItem>)}</SelectContent>
            </Select>
          </Row>
          <Row label="Compact density"><Switch /></Row>
        </Card>
        <Card title="Localization">
          <Row label="Currency">
            <Select defaultValue="USD"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>{["USD","EUR","GBP","INR","JPY"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </Row>
          <Row label="Language">
            <Select defaultValue="en"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="en">English</SelectItem><SelectItem value="es">Español</SelectItem><SelectItem value="fr">Français</SelectItem></SelectContent>
            </Select>
          </Row>
          <Row label="Date format">
            <Select defaultValue="md"><SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="md">MM/DD/YYYY</SelectItem><SelectItem value="dm">DD/MM/YYYY</SelectItem></SelectContent>
            </Select>
          </Row>
        </Card>
        <Card title="Notifications">
          <Row label="Bill reminders"><Switch defaultChecked /></Row>
          <Row label="Goal nudges"><Switch defaultChecked /></Row>
          <Row label="Weekly summary email"><Switch defaultChecked /></Row>
        </Card>
        <Card title="Privacy & Security">
          <Row label="Two-factor auth"><Switch /></Row>
          <Row label="Anonymous analytics"><Switch defaultChecked /></Row>
          <Row label="Auto-lock after 5 min"><Switch /></Row>
        </Card>
      </div>
    </PageShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <h2 className="font-semibold mb-3">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between py-3 border-b last:border-0"><Label>{label}</Label>{children}</div>;
}
