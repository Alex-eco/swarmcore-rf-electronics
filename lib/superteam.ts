export type SuperteamListing = {
  id?: string;
  slug?: string;
  type?: string;
  title?: string;
  description?: string;
  status?: string;
  agentAccess?: string;
  deadline?: string;
  reward?: unknown;
  rewards?: unknown;
  compensation?: unknown;
  compensationType?: string;
  skills?: string[];
  eligibilityQuestions?: unknown[];
  [key: string]: unknown;
};

const BASE_URL = "https://superteam.fun";

function getApiKey() {
  const apiKey = process.env.SUPERTEAM_AGENT_API_KEY;
  if (!apiKey) throw new Error("SUPERTEAM_AGENT_API_KEY is not configured");
  return apiKey;
}

async function publicRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Superteam public API ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json() as Promise<T>;
}

async function superteamRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${getApiKey()}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Superteam API ${response.status}: ${body.slice(0, 500)}`);
  }
  return response.json() as Promise<T>;
}

export async function getLiveAgentListings(options: {
  take?: number;
  type?: "bounty" | "project" | "hackathon";
  deadline?: string;
} = {}) {
  // Superteam Agent API documents a maximum take of 50.
  const params = new URLSearchParams();
  params.set("take", String(Math.min(Math.max(options.take ?? 20, 1), 50)));
  if (options.deadline) params.set("deadline", options.deadline);
  if (options.type) params.set("type", options.type);
  return superteamRequest<SuperteamListing[] | { listings?: SuperteamListing[] }>(
    `/api/agents/listings/live?${params.toString()}`,
  );
}

export async function getOpenAgentListingsFallback(options: { take?: number } = {}) {
  const take = Math.min(Math.max(options.take ?? 100, 1), 100);
  const payload = await publicRequest<SuperteamListing[] | { listings?: SuperteamListing[] }>(
    `/api/listings?take=${take}`,
  );
  const listings = Array.isArray(payload) ? payload : payload.listings ?? [];
  return listings.filter(
    (item) => item.status === "OPEN" &&
      (item.agentAccess === "AGENT_ALLOWED" || item.agentAccess === "AGENT_ONLY"),
  );
}

export async function getListingDetails(slug: string) {
  return superteamRequest<SuperteamListing>(
    `/api/agents/listings/details/${encodeURIComponent(slug)}`,
  );
}

export function normalizeListings(payload: SuperteamListing[] | { listings?: SuperteamListing[] }) {
  const listings = Array.isArray(payload) ? payload : payload.listings ?? [];
  return listings.map((item) => ({
    id: item.id ?? null,
    slug: item.slug ?? null,
    type: item.type ?? null,
    title: item.title ?? null,
    description: item.description ?? null,
    status: item.status ?? null,
    agentAccess: item.agentAccess ?? null,
    deadline: item.deadline ?? null,
    reward: item.reward ?? item.rewards ?? item.compensation ?? null,
    compensationType: item.compensationType ?? null,
    skills: item.skills ?? [],
    raw: item,
  }));
}
