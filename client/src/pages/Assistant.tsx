import React, { useState } from "react";
import { Bot, Send, Sparkles, Shield, Compass, UserCheck, Loader2 } from "lucide-react";
import { useAskAssistant } from "@/lib/api";
import type { AssistantResponse } from "@shared/types";

export function Assistant() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<AssistantResponse | null>(null);

  const ask = useAskAssistant();

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    ask.mutate({ question }, {
      onSuccess: (data) => setResponse(data),
    });
  };

  const samplePrompts = [
    "Which risks need owner review today?",
    "What is driving the increase in delivery exposure?",
    "Summarize the critical risks for the weekly review.",
  ];

  const valueProps = [
    { title: "Register-aware", text: "Answers use live risks and owners in your workspace.", icon: Shield },
    { title: "Evidence-led", text: "Every response points back to a source or telemetry signal.", icon: Compass },
    { title: "Human-directed", text: "Provides advisory context. Humans make the final call.", icon: UserCheck },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8 airms-rise">
      {/* Title */}
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <Bot size={28} />
        </div>
        <div className="eyebrow mt-4">AIRMS copilot</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Ask the risk desk.
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          A natural-language interface to your live risk register, telemetry feeds, and evidence trail.
        </p>
      </div>

      {/* Interactive Query Box */}
      <div className="panel airms-grid p-5 md:p-8">
        <form onSubmit={handleAsk}>
          <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question about your risk posture, milestone slippages, critical items..."
              rows={3}
              className="w-full resize-none border-0 bg-transparent p-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex items-center justify-between border-t border-border px-2 pt-3">
              <span className="font-mono text-[10px] text-muted-foreground">AIRMS / contextual answer</span>
              <button
                type="submit"
                disabled={ask.isPending || !question.trim()}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {ask.isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Ask AIRMS
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {samplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => setQuestion(p)}
              className="rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Answer Output */}
      {response ? (
        <section className="panel airms-rise p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Sparkles size={16} />
            <span>AIRMS response</span>
          </div>

          <div className="whitespace-pre-line text-sm leading-relaxed text-foreground">
            {response.answer}
          </div>

          {response.sources && response.sources.length > 0 && (
            <div className="border-t border-border pt-5">
              <div className="eyebrow">Sources consulted</div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {response.sources.map((s, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-muted px-2.5 py-1 font-mono text-[10px] text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        /* Value props 3-col */
        <div className="grid gap-4 md:grid-cols-3">
          {valueProps.map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-2xl border border-border bg-card/60 p-5 space-y-2">
              <Icon size={18} className="text-primary" />
              <div className="text-xs font-bold text-foreground">{title}</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
