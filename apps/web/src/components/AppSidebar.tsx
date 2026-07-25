import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Receipt, Wallet, TrendingUp, PiggyBank, Target,
  Sparkles, LineChart, FileText, Calendar, Bell, User, Settings,
  HelpCircle, Bot, CreditCard, ArrowLeftRight, LogOut, Trophy,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";

const main = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Transactions", url: "/transactions", icon: ArrowLeftRight },
  { title: "Expenses", url: "/expenses", icon: Receipt },
  { title: "Income", url: "/income", icon: Wallet },
];
const planning = [
  { title: "Budgets", url: "/budgets", icon: CreditCard },
  { title: "Goals", url: "/goals", icon: Target },
  { title: "Savings", url: "/savings", icon: PiggyBank },
  { title: "Investments", url: "/investments", icon: TrendingUp },
  { title: "Subscriptions", url: "/subscriptions", icon: Sparkles },
];
const insights = [
  { title: "Analytics", url: "/analytics", icon: LineChart },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "AI Assistant", url: "/ai", icon: Bot },
];
const system = [
  { title: "Notifications", url: "/notifications", icon: Bell },
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Help", url: "/help", icon: HelpCircle },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const isActive = (u: string) => pathname === u || pathname.startsWith(u + "/");

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  const renderGroup = (label: string, items: typeof main) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-[18px] w-[18px] shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader>
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <div className="grid place-items-center h-9 w-9 rounded-xl gradient-lime">
            <Trophy className="h-5 w-5 text-sidebar" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display font-bold text-sidebar-foreground">FinSmart</div>
              <div className="text-[10px] text-sidebar-foreground/50">Intelligence</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-1">
        {renderGroup("Overview", main)}
        {renderGroup("Planning", planning)}
        {renderGroup("Insights", insights)}
        {renderGroup("Account", system)}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Sign out">
              <LogOut className="h-[18px] w-[18px]" />
              {!collapsed && <span>Sign out</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
