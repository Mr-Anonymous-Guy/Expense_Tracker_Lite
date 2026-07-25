import type { ReactNode } from "react";
import { AppHeader } from "./AppHeader";

export function PageShell({
  title, subtitle, actions, children,
}: { title: string; subtitle?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="min-h-svh">
      <AppHeader title={title} subtitle={subtitle} />
      {actions && <div className="px-4 md:px-8 -mt-2 mb-4 flex flex-wrap gap-2">{actions}</div>}
      <div className="px-4 md:px-8 pb-12">{children}</div>
    </div>
  );
}
