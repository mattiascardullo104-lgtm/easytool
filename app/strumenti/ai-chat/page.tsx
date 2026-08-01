"use client";

import { useEffect, useRef, useState } from "react";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AIChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [provider, setProvider] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          system: "You are a helpful assistant. Answer in the same language as the user. Keep answers concise and clear.",
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setMessages([...next, { role: "assistant", content: data.text }]);
        setProvider(data.provider);
      }
    } catch {
      setError("Something went wrong. Try again in a few seconds.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setProvider("");
    setError("");
  };

  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <a href="/strumenti/ai" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to AI Arena
        </a>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          TOOLS · AI
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-6">
          AI Chat Assistant
        </h1>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg p-4 mb-4 max-h-96 overflow-y-auto min-h-[280px]">
          {messages.length === 0 && !loading && (
            <p className="text-sm text-[var(--text-muted)] text-center py-10">
              Ask anything. The AI answers in your language.
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] whitespace-pre-wrap ${
                  m.role === "user"
                    ? "border border-[var(--accent-brass)] bg-[var(--bg-base)]"
                    : "bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-3">
              <div className="max-w-[80%] rounded-lg px-4 py-3 text-sm text-[var(--text-muted)] bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                Thinking...
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {error && <p className="font-tool text-xs text-red-400 text-center mb-6">{error}</p>}

        {provider && messages.length > 0 && (
          <p className="font-tool text-[11px] text-[var(--text-muted)] text-center mb-6">
            Powered by {provider}
          </p>
        )}

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type your message..."
          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-brass)] transition mb-4"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={send}
            disabled={loading}
            className="w-full sm:w-auto bg-[var(--accent-brass)] text-[#15181C] font-medium px-6 py-3 rounded-md hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
          <button
            onClick={clearChat}
            className="w-full sm:w-auto border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium px-6 py-3 rounded-md hover:border-[var(--accent-steel)] transition"
          >
            Clear chat
          </button>
        </div>
      </div>
    </main>
  );
}
