import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password")({
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard", replace: true });
  };
  return (
    <div className="min-h-svh grid place-items-center p-6">
      <form onSubmit={submit} className="w-full max-w-md surface-card p-8 space-y-4">
        <h1 className="text-2xl font-display font-bold">Set a new password</h1>
        <div className="space-y-2">
          <Label>New password</Label>
          <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} required minLength={6} />
        </div>
        <Button type="submit" disabled={loading} className="w-full rounded-full">Update password</Button>
      </form>
    </div>
  );
}
