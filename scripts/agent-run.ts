import {
  getLiveAgentListings,
  getOpenAgentListingsFallback,
  normalizeListings,
} from "../lib/superteam";
import { analyzeListing } from "../lib/gemini";

async function main() {
  if (!process.env.SUPERTEAM_AGENT_API_KEY) throw new Error("SUPERTEAM_AGENT_API_KEY is not configured");
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

  // Official Agent API: server caps `take` at 50.
  let payload = await getLiveAgentListings({ take: 50, type: "bounty" });
  let listings = normalizeListings(payload);
  let discoverySource = "agent-live:bounty";

  // Public feed is discovery-only. These listings may be marked AGENT_ALLOWED but
  // can still be hidden from the Agent API by Superteam's sponsor verification filter.
  if (listings.length === 0) {
    const fallback = await getOpenAgentListingsFallback({ take: 100 });
    listings = normalizeListings(fallback).filter((item) => item.type === "bounty" || !item.type);
    discoverySource = "public-feed-fallback:bounty";
  }

  const allowed = listings.filter((item) =>
    item.agentAccess === "AGENT_ALLOWED" || item.agentAccess === "AGENT_ONLY"
  );

  // IMPORTANT: do not call the Agent details endpoint for public-feed fallback
  // listings. The same sponsor-verification visibility filter can legitimately
  // return 404 even when the listing is visible in /api/listings.
  const detailed = allowed.map((listing) => listing);

  // Gemini free-tier limit is 20 requests/day. Keep each scheduled run small.
  const prioritized = [...detailed].sort((a, b) => {
    const ad = a.deadline ? Date.parse(a.deadline) : Number.MAX_SAFE_INTEGER;
    const bd = b.deadline ? Date.parse(b.deadline) : Number.MAX_SAFE_INTEGER;
    if (ad !== bd) return ad - bd;
    return JSON.stringify(b.reward ?? "").localeCompare(JSON.stringify(a.reward ?? ""));
  });

  const analysisLimit = Math.min(3, prioritized.length);
  const results = [];
  for (const listing of prioritized.slice(0, analysisLimit)) {
    try {
      const analysis = await analyzeListing(listing);
      results.push({ listing, analysis });
    } catch (error) {
      results.push({
        listing,
        analysis: null,
        error: error instanceof Error ? error.message : "Unknown analysis error",
      });
    }
  }

  const unanalysed = prioritized.slice(analysisLimit).map((listing) => ({
    listing,
    analysis: null,
    error: "Gemini daily request budget reserved; not analyzed in this run",
  }));

  const report = {
    generatedAt: new Date().toISOString(),
    agent: "SwarmCore",
    username: "swarmcore-purple-22",
    discoverySource,
    scanned: listings.length,
    agentEligible: allowed.length,
    detailed: detailed.length,
    geminiAnalyzed: results.length,
    results: [...results, ...unanalysed],
    policy: {
      zeroCostRequired: true,
      autonomousExecutionRequired: true,
      humanActionRequired: false,
      spending: "never without explicit human approval",
      walletSigning: "allowed only for zero-value/no-spend actions when a secure signer is available",
      kyc: "informational only; not an execution blocker",
      autonomousSubmission: "only when submission is concrete, valid, zero-cost, and requires no human action",
    },
  };

  const fs = await import("node:fs/promises");
  await fs.mkdir("artifacts", { recursive: true });
  await fs.writeFile("artifacts/swarmcore-report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
