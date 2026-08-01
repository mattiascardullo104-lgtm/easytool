import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

type ChatMessage = { role: "system" | "user"; content: string };

async function callProvider(
  messages: ChatMessage[]
): Promise<{ text: string; provider: string }> {
  const system = messages.find((m) => m.role === "system")?.content ?? "";
  const user = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n\n");

  // 1. Groq (free tier: many requests/day with Llama models)
  if (process.env.GROQ_API_KEY) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return { text: data.choices?.[0]?.message?.content ?? "", provider: "Groq" };
    }
  }

  // 2. Google Gemini (free tier: generous daily limits)
  if (process.env.GEMINI_API_KEY) {
    const model = "gemini-1.5-flash";
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          contents: [{ parts: [{ text: user }] }],
          generationConfig: { maxOutputTokens: 1500, temperature: 0.7 },
        }),
      }
    );
    if (res.ok) {
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("") ?? "";
      return { text, provider: "Gemini" };
    }
  }

  // 3. DeepSeek (very cheap, has free credits at signup)
  if (process.env.DEEPSEEK_API_KEY) {
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return { text: data.choices?.[0]?.message?.content ?? "", provider: "DeepSeek" };
    }
  }

  // 4. OpenAI (works with any OpenAI-compatible key)
  if (process.env.OPENAI_API_KEY) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return { text: data.choices?.[0]?.message?.content ?? "", provider: "OpenAI" };
    }
  }

  // 5. Pollinations AI: 100% free, no key required
  const res = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        ...(system ? [{ role: "system", content: system }] : []),
        ...messages.filter((m) => m.role === "user"),
      ],
      model: "openai",
    }),
  });
  if (res.ok) {
    const text = await res.text();
    return { text, provider: "Pollinations" };
  }
  throw new Error(`Provider error: ${res.status}`);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt ?? "").trim();
    const system = String(body.system ?? "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "The prompt is empty." }, { status: 400 });
    }

    const messages: ChatMessage[] = [
      ...(system ? [{ role: "system" as const, content: system }] : []),
      { role: "user" as const, content: prompt },
    ];

    const { text, provider } = await callProvider(messages);
    return NextResponse.json({ text: text.trim(), provider });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "The AI service is temporarily unavailable. Try again in a few seconds." },
      { status: 500 }
    );
  }
}
