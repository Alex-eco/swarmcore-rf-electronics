import { NextResponse } from "next/server";
import { getLiveAgentListings, normalizeListings } from "@/lib/superteam";

export async function GET(request: Request) {
  if (!process.env.SUPERTEAM_AGENT_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: "SUPERTEAM_AGENT_API_KEY is not configured",
        setup: "Add your Superteam Earn agent API key to .env.local",
      },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "bounty" | "project" | "hackathon" | null;
  const take = Number(searchParams.get("take") ?? "20");

  try {
    const payload = await getLiveAgentListings({
      type: type || undefined,
      take: Number.isFinite(take) ? take : 20,
    });

    return NextResponse.json({
      ok: true,
      source: "superteam",
      fetchedAt: new Date().toISOString(),
      listings: normalizeListings(payload),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        source: "superteam",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 502 },
    );
  }
}
