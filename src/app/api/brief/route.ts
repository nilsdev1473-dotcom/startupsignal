import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase";

const OLLAMA_BASE = "http://187.77.175.61:11434";
const MODEL = "qwen2.5:7b";

function buildPrompt(
  title: string,
  description: string,
  category: string,
): string {
  return `You are an expert startup advisor. Analyze this startup idea and provide a structured execution brief.

Idea: ${title}
Description: ${description}
Category: ${category}

Respond ONLY with valid JSON in this exact format:
{
  "founding_team": "Description of roles needed and key skills (2-3 sentences)",
  "realistic_funding": "Specific funding range with explanation (e.g. '$50K-200K bootstrappable, or $500K-2M seed round')",
  "time_to_revenue": "Realistic time estimate with explanation (e.g. '6-12 months to first paying customer')",
  "core_components": ["Component 1", "Component 2", "Component 3", "Component 4", "Component 5"],
  "key_risks": ["Risk 1 specific to this idea", "Risk 2", "Risk 3"],
  "why_now": "2-3 sentences on market timing and why this moment is right",
  "path_to_profitability": "Realistic path with key milestones (2-3 sentences)",
  "tip": "Practical note for a solo technical founder with a modern web stack (Next.js, Supabase, Vercel), limited budget but AI capabilities. What makes this accessible or not accessible as a solo build?"
}`;
}

interface ExecutionBrief {
  founding_team: string;
  realistic_funding: string;
  time_to_revenue: string;
  core_components: string[];
  key_risks: string[];
  why_now: string;
  path_to_profitability: string;
  tip: string;
}

function isValidBrief(data: unknown): data is ExecutionBrief {
  if (typeof data !== "object" || data === null) return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.founding_team === "string" &&
    typeof d.realistic_funding === "string" &&
    typeof d.time_to_revenue === "string" &&
    Array.isArray(d.core_components) &&
    Array.isArray(d.key_risks) &&
    typeof d.why_now === "string" &&
    typeof d.path_to_profitability === "string" &&
    typeof d.tip === "string"
  );
}

export async function POST(req: Request) {
  const body: unknown = await req.json();
  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).idea_id !== "string"
  ) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const { idea_id, title, description, category } = body as {
    idea_id: string;
    title: string;
    description: string;
    category: string;
  };

  const sb = createServerSupabase();

  // Check cache
  const { data: existing } = await sb
    .from("yc_ideas")
    .select("execution_brief")
    .eq("id", idea_id)
    .single();

  if (existing?.execution_brief) {
    return NextResponse.json({ brief: existing.execution_brief, cached: true });
  }

  const prompt = buildPrompt(title, description, category);

  try {
    const ollamaResp = await fetch(`${OLLAMA_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        format: "json",
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!ollamaResp.ok) {
      throw new Error(`Ollama returned ${ollamaResp.status}`);
    }

    const ollamaData: unknown = await ollamaResp.json();

    if (
      typeof ollamaData !== "object" ||
      ollamaData === null ||
      typeof (ollamaData as Record<string, unknown>).response !== "string"
    ) {
      throw new Error("Unexpected Ollama response shape");
    }

    const responseText = (ollamaData as { response: string }).response;
    const parsed: unknown = JSON.parse(responseText);

    if (!isValidBrief(parsed)) {
      throw new Error("Ollama response did not match ExecutionBrief schema");
    }

    // Cache in Supabase
    await sb
      .from("yc_ideas")
      .update({ execution_brief: parsed })
      .eq("id", idea_id);

    return NextResponse.json({ brief: parsed, cached: false });
  } catch {
    return NextResponse.json({
      brief: null,
      error: "Brief generation pending — AI model loading",
      pending: true,
    });
  }
}
