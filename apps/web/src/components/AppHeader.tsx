import { Bell, Search, Plus } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { user } = useAuth();
  const initials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(/\s|@/)[0].slice(0, 2).toUpperCase();
  return (
    <header className="flex items-center justify-between gap-4 px-4 md:px-8 py-5">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="md:hidden" />
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-display font-bold truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full hidden sm:inline-flex">
          <Search className="h-[18px] w-[18px]" />
        </Button>
        <Link to="/notifications">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-[18px] w-[18px]" />
          </Button>
        </Link>
        <Link to="/expenses">
          <Button size="sm" className="rounded-full gap-1.5 hidden sm:inline-flex">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </Link>
        <Link to="/profile">
          <Avatar className="h-9 w-9 ring-2 ring-border">
            <AvatarFallback className="text-xs font-semibold bg-accent text-accent-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
