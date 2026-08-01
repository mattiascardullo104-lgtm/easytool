import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/ai";

export async function POST(req: NextRequest) {
  let body: { text?: string; length?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const text = body.text ?? "";
  if (text.length < 50) {
    return NextResponse.json(
      { error: "The text is too short (minimum 50 characters)." },
      { status: 400 }
    );
  }

  // Optional dedicated summarizer API (higher quality, paid).
  if (process.env.SUMMARIZE_API_KEY) {
    const res = await fetch("https://summarizeapi.com/api/summarize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUMMARIZE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        length: body.length ?? "medium",
        style: "simple",
        format: "paragraph",
        outputLang: "auto",
      }),
    });
    const data = await res.json();
    return NextResponse.json(
      { summary: data.summary ?? "", provider: "SummarizeAPI" },
      { status: res.status }
    );
  }

  // Free fallback: same provider chain as the AI chat.
  const system =
    "You are a text summarizer. Write a concise summary of the user's text in the same language as the original text. Use plain paragraphs, no bullet lists, no preamble.";
  try {
    const { text: summary, provider } = await chatCompletion([
      { role: "system", content: system },
      { role: "user", content: text },
    ]);
    return NextResponse.json({ summary, provider });
  } catch (error) {
    console.error("Summarize route error:", error);
    return NextResponse.json(
      { error: "Summarization failed. Try again in a few seconds." },
      { status: 500 }
    );
  }
}
