import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/ai/settings")({ component: AISettings });

function AISettings() {
  return (
    <div className="surface-card p-6 max-w-2xl space-y-5">
      <Row label="Personality" desc="Choose how the assistant talks to you.">
        <Select defaultValue="friendly">
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="concise">Concise</SelectItem>
            <SelectItem value="analyst">Analyst</SelectItem>
          </SelectContent>
        </Select>
      </Row>
      <Row label="Proactive insights" desc="Push tips automatically when patterns appear.">
        <Switch defaultChecked />
      </Row>
      <Row label="Use my data for replies" desc="Ground responses in your transactions.">
        <Switch defaultChecked />
      </Row>
      <Row label="Mock mode" desc="Currently active. Will switch to live model after integration.">
        <Switch defaultChecked disabled />
      </Row>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b last:border-0">
      <div>
        <Label className="font-medium">{label}</Label>
        <p className="text-xs text-muted-foreground mt-1">{desc}</p>
      </div>
      {children}
    </div>
  );
}
