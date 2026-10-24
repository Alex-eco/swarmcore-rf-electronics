import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type DesignResult = {
  title: string;
  requirements: string[];
  agents: { name: string; task: string; output: string }[];
  calculations: string[];
  netlist: string[];
  checks: string[];
};

function isDesignResult(value: unknown): value is DesignResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.title === "string"
    && Array.isArray(v.requirements)
    && Array.isArray(v.agents)
    && Array.isArray(v.calculations)
    && Array.isArray(v.netlist)
    && Array.isArray(v.checks)
    && v.agents.every((a) => a && typeof a === "object"
      && typeof (a as Record<string, unknown>).name === "string"
      && typeof (a as Record<string, unknown>).task === "string"
      && typeof (a as Record<string, unknown>).output === "string")
    && [v.requirements, v.calculations, v.netlist, v.checks].every((list) =>
      (list as unknown[]).every((item) => typeof item === "string"));
}

export async function POST(request: Request) {
  const expected = process.env.DESIGN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "Workbench password is not configured. Set DESIGN_PASSWORD in Vercel project environment variables." }, { status: 503 });
  }

  let body: { password?: string; task?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof body.password !== "string" || body.password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  // Keep prompts bounded to reduce token consumption on the free API tier.
  const task = typeof body.task === "string" ? body.task.trim().slice(0, 3000) : "";
  if (!task) return NextResponse.json({ error: "Please describe the design task." }, { status: 400 });

  const apiKey = process.env.GEMINI || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      error: "Gemini is not configured on Vercel. Add the API key as the server-side environment variable GEMINI, then redeploy.",
    }, { status: 503 });
  }

  const systemInstruction = `You are SwarmCore RF & Electronics, a careful electronics engineering workflow. Analyze the user's requested electronics design. In ONE response, simulate a coordinator and specialist roles for requirements, calculations/component selection, circuit design, and independent critic/verification. Be technically rigorous; do not invent datasheet values or claim simulations were run. State assumptions and uncertainty. If underspecified, list assumptions/questions and give a preliminary design where safe. Do not provide hazardous high-voltage, mains, explosive, weapon, or other dangerous device construction instructions.

Return ONLY valid JSON:
{
 "title": "short design title",
 "requirements": ["requirements and assumptions"],
 "agents": [{"name":"role","task":"specific subtask","output":"concise findings"}],
 "calculations": ["formulas, units, results; mark estimates"],
 "netlist": ["textual connections or illustrative pseudonetlist"],
 "checks": ["independent checks, limitations, safety notes, validation needed"]
}
Use 3-5 concise roles. Include units. Clearly mark assumed component specs. Keep the whole report concise. Never claim physical validation.`;

  try {
    // Exactly one Gemini request per user click; no automatic retries to conserve quota.
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: "user", parts: [{ text: task }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
          maxOutputTokens: 2500,
        },
      }),
      signal: AbortSignal.timeout(50000),
      cache: "no-store",
    });

    if (!response.ok) {
      const providerError = await response.json().catch(() => null) as { error?: { message?: string; status?: string } } | null;
      const status = response.status === 429 ? 429 : 502;
      const message = response.status === 429
        ? "Gemini free-tier quota or rate limit reached. No automatic retry was made. Check your quota in Google AI Studio and try again after it resets."
        : response.status === 400 || response.status === 403
          ? "Gemini rejected the request. Check the API key and Gemini API access in Google AI Studio."
          : "Gemini could not complete the design request. Please try again later.";
      console.error("Gemini API error", response.status, providerError?.error?.status ?? "unknown");
      return NextResponse.json({ error: message }, { status });
    }

    const payload = await response.json() as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    };
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) {
      const reason = payload.promptFeedback?.blockReason ?? payload.candidates?.[0]?.finishReason;
      console.error("Gemini returned no text", reason ?? "unknown");
      return NextResponse.json({ error: "Gemini returned no usable design. Refine the task and try again." }, { status: 502 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text.replace(/^\u0060\u0060\u0060(?:json)?\s*/i, "").replace(/\s*\u0060\u0060\u0060$/, ""));
    } catch {
      console.error("Gemini response was not valid JSON");
      return NextResponse.json({ error: "Gemini returned an invalid report format. Please run the task again." }, { status: 502 });
    }

    if (!isDesignResult(parsed)) {
      console.error("Gemini response did not match the design report schema");
      return NextResponse.json({ error: "Gemini returned an incomplete report. Please run the task again." }, { status: 502 });
    }

    return NextResponse.json({ result: parsed, model: "gemini-3.8-flash" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Gemini request failed", error instanceof Error ? error.name : "unknown");
    return NextResponse.json({ error: "Could not reach Gemini. Check connectivity and try again." }, { status: 502 });
  }
}
