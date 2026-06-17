import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages, system } = await req.json();

  if (!messages || !Array.isArray(messages)) {
    return NextResponse.json({ error: "messages array required" }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: system ?? "You are a helpful AI assistant.",
      messages,
    });

    // Log usage (optional — useful for usage-based billing)
    await supabase.from("usage_logs").insert({
      user_id: user.id,
      input_tokens: response.usage.input_tokens,
      output_tokens: response.usage.output_tokens,
    });

    return NextResponse.json({
      content: response.content,
      usage: response.usage,
    });
  } catch (err: any) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "AI request failed", detail: err.message },
      { status: 500 }
    );
  }
}
