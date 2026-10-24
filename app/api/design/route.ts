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
          maxOutputTokens: 1800,
        },
      }),
      signal: AbortSignal.timeout(50000),
      cache: "no-store",
    });

    if (!response.ok) {
      const providerError = await response.json().catch(() => null) as { error?: { message?: string; status?: string } } | null;
      const providerMessage = providerError?.error?.message;
      let message: string;
      if (response.status === 429) {
        message = "Gemini quota or rate limit reached (HTTP 429). Check the model quota in Google AI Studio and try again after it resets.";
      } else if (response.status === 401) {
        message = "Gemini rejected the API key (HTTP 401). Check that Vercel's GEMINI environment variable contains a valid key for this project, then redeploy.";
      } else if (response.status === 403) {
        message = "Gemini access was denied (HTTP 403). Check API access, project restrictions, and billing/quota eligibility in Google AI Studio.";
      } else if (response.status === 404) {
        message = "Gemini model or API endpoint was not found (HTTP 404). Verify the model name and that it is available to this API key.";
      } else if (response.status === 400) {
        message = "Gemini rejected the request (HTTP 400). The model may not support one of the requested generation settings.";
      } else if (response.status === 503) {
        message = `Gemini is temporarily unavailable (HTTP 503)${providerMessage ? `: ${providerMessage.slice(0, 240)}` : ". Check Google AI Studio service/model availability and try again later."}`;
      } else {
        message = `Gemini API returned HTTP ${response.status}${providerMessage ? `: ${providerMessage.slice(0, 240)}` : ". Check Vercel function logs for details."}`;
      }
      // Log provider diagnostics, but never log the API key or request headers.
      console.error("Gemini API error", response.status, providerError?.error?.status ?? "unknown", providerMessage?.slice(0, 300) ?? "no provider message");
      const clientStatus = response.status === 429 ? 429 : response.status === 503 ? 503 : 502;
      return NextResponse.json({ error: message }, { status: clientStatus });
    }

    const payload = await response.json() as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      promptFeedback?: { blockReason?: string };
    };
    const candidate = payload.candidates?.[0];
    const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    const finishReason = candidate?.finishReason;

    if (!text) {
      const reason = payload.promptFeedback?.blockReason ?? finishReason ?? "unknown";
      console.error("Gemini returned no text", reason);
      return NextResponse.json({ error: `Gemini returned no usable design (reason: ${reason}). Refine the task and try again.` }, { status: 502 });
    }

    // A MAX_TOKENS finish usually means the JSON was cut off before it could close.
    if (finishReason === "MAX_TOKENS") {
      console.error("Gemini response truncated at MAX_TOKENS");
      return NextResponse.json({
        error: "Gemini's report was cut off because it reached the output limit. Shorten the design task and run it again.",
      }, { status: 502 });
    }

    // Be tolerant of optional Markdown fences or short preambles, while still
    // validating the final parsed object against the expected report schema.
    const cleaned = text
      .replace(/^\uFEFF/, "")
      .replace(/^\u0060\u0060\u0060(?:json)?\s*/i, "")
      .replace(/\s*\u0060\u0060\u0060$/, "")
      .trim();
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    const jsonText = jsonStart >= 0 && jsonEnd > jsonStart
      ? cleaned.slice(jsonStart, jsonEnd + 1)
      : cleaned;

    let parsed: unknown;
    try {
      parsed = JSON.parse(jsonText);
    } catch (error) {
      const parseMessage = error instanceof Error ? error.message : "unknown parse error";
      console.error("Gemini response was not valid JSON", finishReason ?? "unknown finish reason", parseMessage.slice(0, 160));
      return NextResponse.json({
        error: "Gemini returned a report that was not valid JSON. Try a shorter design task; if it persists, check Vercel function logs.",
      }, { status: 502 });
    }

    if (!isDesignResult(parsed)) {
      console.error("Gemini response did not match the design report schema");
      return NextResponse.json({ error: "Gemini returned an incomplete report. Please run the task again." }, { status: 502 });
    }

    return NextResponse.json({ result: parsed, model: "gemini-3.8-flash" }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : "unknown";
    console.error("Gemini request failed", errorName);
    if (errorName === "TimeoutError" || errorName === "AbortError") {
      return NextResponse.json({
        error: "Gemini took too long to generate the report. Try a shorter design task with fewer requirements; no automatic retry was made.",
      }, { status: 504 });
    }
    return NextResponse.json({ error: "Could not reach Gemini. Check connectivity and try again." }, { status: 502 });
  }
}
