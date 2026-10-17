# Superteam bounty API

GET /api/bounties

Optional query parameters:

- `type=bounty`
- `type=project`
- `type=hackathon`
- `take=20`

The route calls Superteam's documented agent endpoint:

`GET https://superteam.fun/api/agents/listings/live`

The API key is server-side only and must be stored in `.env.local` as `SUPERTEAM_AGENT_API_KEY`.

The current implementation sends an explicit ISO-8601 `deadline` equal to the current server time because the documented endpoint has had issues returning stale/expired listings when the deadline filter is omitted.

This first integration only discovers listings. It does not submit work, sign transactions, or access a wallet.
