export type ChatMessage = { role: "system" | "user"; content: string };

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

async function tryJsonPost(
  url: string,
  headers: Record<string, string>,
  body: unknown
): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(45000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.choices?.[0]?.message?.content ?? data.text ?? null;
  } catch {
    return null;
  }
}

export async function chatCompletion(
  messages: ChatMessage[]
): Promise<{ text: string; provider: string }> {
  const system = messages.find((m) => m.role === "system")?.content ?? "";
  const user = messages
    .filter((m) => m.role === "user")
    .map((m) => m.content)
    .join("\n\n");

  // 1. Groq (free tier: many requests/day with Llama models)
  if (process.env.GROQ_API_KEY) {
    const text = await tryJsonPost(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      { model: DEFAULT_MODEL, messages, max_tokens: 1500, temperature: 0.7 }
    );
    if (text !== null) return { text, provider: "Groq" };
  }

  // 2. Google Gemini (free tier: generous daily limits)
  if (process.env.GEMINI_API_KEY) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: system ? { parts: [{ text: system }] } : undefined,
            contents: [{ parts: [{ text: user }] }],
            generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
          }),
          signal: AbortSignal.timeout(45000),
        }
      );
      if (res.ok) {
        const data = await res.json();
        const text =
          data.candidates?.[0]?.content?.parts
            ?.map((p: { text?: string }) => p.text ?? "")
            .join("") ?? "";
        if (text) return { text, provider: "Gemini" };
      }
    } catch {
      // fall through
    }
  }

  // 3. DeepSeek (very cheap, has free credits at signup)
  if (process.env.DEEPSEEK_API_KEY) {
    const text = await tryJsonPost(
      "https://api.deepseek.com/chat/completions",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      { model: "deepseek-chat", messages, max_tokens: 1500, temperature: 0.7 }
    );
    if (text !== null) return { text, provider: "DeepSeek" };
  }

  // 4. OpenAI (works with any OpenAI-compatible key)
  if (process.env.OPENAI_API_KEY) {
    const text = await tryJsonPost(
      "https://api.openai.com/v1/chat/completions",
      {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      { model: "gpt-4o-mini", messages, max_tokens: 1500, temperature: 0.7 }
    );
    if (text !== null) return { text, provider: "OpenAI" };
  }

  // 5. Pollinations AI: 100% free, no key required (OpenAI-compatible endpoint)
  const pollinationsBody = {
    model: "openai",
    messages,
    temperature: 0.7,
    max_tokens: 1500,
  };
  let pollStatus = "";
  try {
    const res = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pollinationsBody),
      signal: AbortSignal.timeout(60000),
    });
    pollStatus = String(res.status);
    if (res.ok) {
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content ?? "";
      if (text) return { text: text.trim(), provider: "Pollinations" };
    } else {
      const bodyText = await res.text().catch(() => "");
      console.error("[pollinations] status", res.status, "body:", bodyText.slice(0, 300));
    }
  } catch (e) {
    pollStatus = "throw:" + (e as Error).message;
  }

  // 5b. Pollinations simple GET endpoint (anonymous, no key; 1 req/15s)
  const prompt = encodeURIComponent(user.slice(0, 800));
  const params = new URLSearchParams({ model: "openai" });
  if (system) params.set("system", system);
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(
        `https://text.pollinations.ai/${prompt}?${params.toString()}`,
        { signal: AbortSignal.timeout(60000) }
      );
      if (res.ok) {
        const text = (await res.text()).trim();
        if (text && !text.startsWith("{")) return { text, provider: "Pollinations" };
      } else {
        console.error("[pollinations-get] status", res.status);
      }
    } catch (e) {
      console.error("[pollinations-get] error", (e as Error).message);
    }
    if (attempt < 2) await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("All AI providers failed (pollinations post: " + pollStatus + ")");
}
