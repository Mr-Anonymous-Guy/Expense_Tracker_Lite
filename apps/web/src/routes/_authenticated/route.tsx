import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) throw redirect({ to: "/auth" });
    return { user: useAuthStore.getState().user };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-svh bg-muted/40">
        <AppSidebar />
        <SidebarInset className="bg-background rounded-l-3xl my-2 mr-2 overflow-hidden shadow-card">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
