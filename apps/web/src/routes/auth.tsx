import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — FinSmart" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isAuthenticated, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        await useAuthStore.getState().register(name, email, password);
        toast.success("Account created!");
        navigate({ to: "/dashboard", replace: true });
      } else {
        await useAuthStore.getState().login(email, password);
        toast.success("Welcome back!");
        navigate({ to: "/dashboard", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    toast.error("Google sign-in not configured");
  };

  const forgot = async () => {
    toast.error("Password reset not implemented");
  };

  return (
    <div className="min-h-svh grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 card-dark text-white">
        <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-10 w-10 rounded-xl gradient-lime grid place-items-center">
              <Trophy className="h-5 w-5 text-sidebar" />
            </div>
            <span className="font-display text-xl font-bold">FinSmart</span>
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight">Money that<br />explains itself.</h2>
          <p className="text-white/60 mt-4 max-w-sm">Sign in to track expenses, beat budgets, and unlock AI-powered insights about your finances.</p>
        </div>
        <div className="text-xs text-white/40">© 2026 FinSmart</div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl gradient-lime grid place-items-center">
              <Trophy className="h-5 w-5 text-sidebar" />
            </div>
            <span className="font-display font-bold">FinSmart</span>
          </Link>
          <Tabs value={mode} onValueChange={(v) => setMode(v as "signin" | "signup")}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              <h1 className="text-3xl font-display font-bold">
                {mode === "signin" ? "Welcome back" : "Get started"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === "signin" ? "Sign in to your account" : "Create your free FinSmart account"}
              </p>
            </div>

            <Button onClick={google} disabled={loading} variant="outline" className="w-full mt-6 rounded-full gap-2">
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </Button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="h-px flex-1 bg-border" /> OR <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="space-y-3">
              <TabsContent value="signup" className="m-0">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Jane Cooper" />
                </div>
              </TabsContent>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "signin" && (
                    <button type="button" onClick={forgot} className="text-xs text-primary hover:underline">Forgot?</button>
                  )}
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="••••••••" />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-full mt-2">
                {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
            <p className="text-[11px] text-muted-foreground text-center mt-4">
              By continuing you agree to our Terms & Privacy.
            </p>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
