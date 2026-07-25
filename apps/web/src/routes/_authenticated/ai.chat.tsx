import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User as UserIcon, Sparkles } from "lucide-react";
import { generateMockReply, SUGGESTED_PROMPTS, type AIMessage } from "@/lib/ai-service";
import { z } from "zod";

const search = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/_authenticated/ai/chat")({
  validateSearch: search,
  component: AIChat,
});

function AIChat() {
  const { q } = Route.useSearch();
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: "assistant", content: "Hi! I'm FinSmart AI. Ask me about your spending, savings, budgets, or what to do next. 💸" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => { scrollerRef.current?.scrollTo({ top: 99999, behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (q) sendMessage(q); /* eslint-disable-next-line */ }, [q]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const reply = await generateMockReply(next);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4 h-[calc(100svh-13rem)]">
      <div className="surface-card flex flex-col overflow-hidden">
        <div ref={scrollerRef} className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 rounded-xl grid place-items-center shrink-0 ${m.role === "user" ? "bg-primary text-primary-foreground" : "gradient-lime text-sidebar"}`}>
                {m.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}
                dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-xl gradient-lime text-sidebar grid place-items-center"><Bot className="h-4 w-4" /></div>
              <div className="bg-muted rounded-2xl px-4 py-2.5 text-sm text-muted-foreground inline-flex gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
              </div>
            </div>
          )}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="border-t p-3 flex gap-2">
          <Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask FinSmart anything…" className="rounded-full" />
          <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-full"><Send className="h-4 w-4" /></Button>
        </form>
      </div>

      <div className="surface-card p-4 space-y-3 hidden lg:block overflow-y-auto">
        <div className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> SUGGESTIONS</div>
        {SUGGESTED_PROMPTS.map(p => (
          <button key={p} onClick={() => sendMessage(p)} className="text-left text-sm w-full p-3 rounded-xl bg-accent/40 hover:bg-accent transition">
            {p}
          </button>
        ))}
        <div className="text-[10px] text-muted-foreground pt-2 border-t mt-3">
          AI is currently in mock mode. Real model integration is wired and ready.
        </div>
      </div>
    </div>
  );
}
