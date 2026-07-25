import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Star, Coffee, ShoppingBag, PiggyBank, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/savings")({ component: Savings });

const BADGES = [
  { icon: "🦊", name: "Level 4", sub: "$100 Saved", color: "bg-orange-100" },
  { icon: "☕", name: "10 Cups", sub: "$30 Saved", color: "bg-amber-100" },
  { icon: "🐷", name: "Grocery Guru", sub: "$60 Saved", color: "bg-pink-100" },
  { icon: "🏆", name: "Streak 7", sub: "Logged daily", color: "bg-yellow-100" },
];

function Savings() {
  const { user } = useAuth();
  const name = user?.user_metadata?.full_name?.split(" ")[0] || "Friend";
  return (
    <PageShell title="Gamified Savings" subtitle={`Keep going, ${name}! You're crushing it.`}>
      {/* Hero level card */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 surface-card p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 gradient-lime rounded-full opacity-30 blur-2xl" />
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-24 w-24 rounded-full gradient-lime grid place-items-center text-4xl shadow-glow">🦊</div>
              <div className="absolute -bottom-1 -right-1 bg-foreground text-background text-[10px] font-bold rounded-full px-2 py-0.5">LV 7</div>
            </div>
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Level 7</div>
              <div className="text-3xl font-display font-bold mt-1">$79.00</div>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={68} className="h-2 flex-1" />
                <span className="text-xs text-success font-medium">+3%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">9,450 / 12,000 XP to next level</div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent grid place-items-center"><Coffee className="h-5 w-5 text-primary" /></div>
            <div className="flex-1">
              <div className="font-medium text-sm">Today's mission</div>
              <div className="text-xs text-muted-foreground">Save $10 on coffee this week</div>
            </div>
            <Button size="sm" variant="outline" className="rounded-full">Skip</Button>
          </div>
        </div>

        {/* Streak / stats */}
        <div className="space-y-4">
          <div className="card-lime p-5">
            <Flame className="h-6 w-6" />
            <div className="text-3xl font-display font-bold mt-2">12 days</div>
            <div className="text-sm">Savings streak 🔥</div>
          </div>
          <div className="surface-card p-5">
            <div className="flex items-center gap-2 mb-3"><Trophy className="h-4 w-4 text-primary" /><span className="font-semibold">#1 March Savings</span></div>
            <div className="text-3xl font-display font-bold">$240.00</div>
            <div className="text-xs text-muted-foreground mt-1">02 Mar – 31 Mar · 12 days</div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="surface-card p-6 mt-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">Your Badges</h2>
          <button className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">Show more <ChevronRight className="h-3 w-3" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map(b => (
            <div key={b.name} className={`${b.color} rounded-2xl p-4 text-center hover-lift cursor-pointer`}>
              <div className="text-4xl">{b.icon}</div>
              <div className="font-semibold text-sm mt-2">{b.name}</div>
              <div className="text-xs text-foreground/60">{b.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly challenges */}
      <div className="grid sm:grid-cols-2 gap-4 mt-4">
        <ChallengeCard icon={<PiggyBank className="h-5 w-5" />} title="No-spend Sunday" desc="Don't spend a dollar on Sunday." reward="+200 XP" />
        <ChallengeCard icon={<ShoppingBag className="h-5 w-5" />} title="Grocery sniper" desc="Stay under $80 on groceries this week." reward="+150 XP" />
        <ChallengeCard icon={<Star className="h-5 w-5" />} title="Log it all" desc="Add an expense every day for 7 days." reward="+100 XP" />
        <ChallengeCard icon={<Trophy className="h-5 w-5" />} title="Goal pusher" desc="Add $50 to any goal this week." reward="+250 XP" />
      </div>
    </PageShell>
  );
}

function ChallengeCard({ icon, title, desc, reward }: any) {
  return (
    <div className="surface-card p-5 flex items-center gap-4 hover-lift">
      <div className="h-12 w-12 rounded-xl gradient-violet grid place-items-center text-primary-foreground">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <span className="text-xs font-semibold text-primary bg-accent rounded-full px-2.5 py-1">{reward}</span>
    </div>
  );
}
