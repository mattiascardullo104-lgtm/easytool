import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.SUMMARIZE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured." },
      { status: 500 }
    );
  }

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

  const res = await fetch("https://summarizeapi.com/api/summarize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
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
  return NextResponse.json(data, { status: res.status });
}
