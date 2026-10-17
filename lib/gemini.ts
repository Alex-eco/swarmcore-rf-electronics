export type GeminiAnalysis = {
  eligible: boolean;
  confidence: number;
  categoryFit: string[];
  reasoning: string;
  plan: string[];
  zeroCost: boolean;
  autonomous: boolean;
  spendingRequired: boolean;
  humanActionRequired: boolean;
  walletSigningRequired: boolean;
  kyc: "required" | "not_required" | "unknown";
  submissionReady: boolean;
  notes: string[];
};

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.8-flash";
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";

function getKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return key;
}

async function analyzeListingOnce(listing: {
  id?: string | null;
  slug?: string | null;
  type?: string | null;
  title?: string | null;
  description?: string | null;
  agentAccess?: string | null;
  deadline?: string | null;
  reward?: unknown;
  compensationType?: string | null;
  skills?: string[];
  raw?: unknown;
}) {
  const prompt = [
    "You are SwarmCore, an autonomous bounty-hunting agent.",
    "Analyze the FULL Superteam listing contract below.",
    "Our primary filter is zero monetary entry cost and autonomous execution.",
    "KYC is informational only and must NOT by itself make a listing ineligible.",
    "Wallet signing is allowed in principle, including zero-value signatures or transactions, but spending money is forbidden without explicit human approval.",
    "A human-required action, paid transaction, deposit, purchase, or other monetary spend makes the listing not autonomously executable for the current MVP.",
    "Do not invent requirements, rewards, deadlines, or capabilities.",
    "Return ONLY valid JSON matching the requested schema.",
    "",
    JSON.stringify(listing, null, 2),
    "",
    "Schema:",
    JSON.stringify({
      eligible: "boolean",
      confidence: "number 0..1",
      categoryFit: ["string"],
      reasoning: "string",
      plan: ["short actionable step"],
      zeroCost: "boolean",
      autonomous: "boolean",
      spendingRequired: "boolean",
      humanActionRequired: "boolean",
      walletSigningRequired: "boolean",
      kyc: "required | not_required | unknown",
      submissionReady: "boolean",
      notes: ["string"],
    }),
  ].join("\n");

  const response = await fetch(
    `${BASE_URL}/${MODEL}:generateContent?key=${encodeURIComponent(getKey())}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    const retryable = response.status === 429 || response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504;
    throw Object.assign(
      new Error(`Gemini API ${response.status}: ${body.slice(0, 500)}`),
      { retryable },
    );
  }

  const data = await response.json() as any;
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no text");

  return JSON.parse(text) as GeminiAnalysis;
}

export async function analyzeListing(listing: Parameters<typeof analyzeListingOnce>[0]) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      return await analyzeListingOnce(listing);
    } catch (error) {
      lastError = error;
      const retryable = Boolean((error as { retryable?: boolean })?.retryable);
      if (!retryable || attempt === 3) throw error;
      const delayMs = attempt === 1 ? 5000 : 15000;
      console.warn(`Gemini transient error; retrying in ${delayMs}ms (attempt ${attempt + 1}/3)`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Gemini analysis failed");
}
