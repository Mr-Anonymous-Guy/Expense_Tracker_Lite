import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/profile")({ component: ProfilePage });

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }: any) => {
      setName(data?.full_name || user.user_metadata?.full_name || "");
    });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({ id: user.id, full_name: name });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile updated");
  };

  const deleteAccount = async () => {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    await supabase.auth.signOut();
    toast.success("Signed out. Contact support to permanently delete data.");
    navigate({ to: "/", replace: true });
  };

  const initials = (name || user?.email || "U").slice(0, 2).toUpperCase();

  return (
    <PageShell title="Profile" subtitle="Manage your account">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="surface-card p-6 text-center">
          <Avatar className="h-24 w-24 mx-auto"><AvatarFallback className="text-2xl bg-accent">{initials}</AvatarFallback></Avatar>
          <div className="font-semibold mt-3">{name || "Anonymous"}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
          <div className="mt-4 text-xs text-muted-foreground">Level 7 · 9,450 XP</div>
        </div>
        <div className="lg:col-span-2 surface-card p-6 space-y-4">
          <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Email</Label><Input value={user?.email || ""} disabled /></div>
          <Button onClick={save} disabled={saving} className="rounded-full">{saving ? "Saving…" : "Save changes"}</Button>
          <hr />
          <div>
            <div className="font-semibold text-destructive">Danger zone</div>
            <p className="text-sm text-muted-foreground mt-1">Permanently delete your account and data.</p>
            <Button variant="destructive" className="rounded-full mt-3" onClick={deleteAccount}>Delete account</Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
