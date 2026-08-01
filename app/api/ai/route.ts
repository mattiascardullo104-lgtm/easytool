import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt = String(body.prompt ?? "").trim();
    const system = String(body.system ?? "").trim();

    if (!prompt) {
      return NextResponse.json({ error: "The prompt is empty." }, { status: 400 });
    }

    const messages: { role: "system" | "user"; content: string }[] = [
      ...(system ? [{ role: "system" as const, content: system }] : []),
      { role: "user" as const, content: prompt },
    ];

    const { text, provider } = await chatCompletion(messages);
    return NextResponse.json({ text: text.trim(), provider });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "The AI service is temporarily unavailable. Try again in a few seconds." },
      { status: 500 }
    );
  }
}
