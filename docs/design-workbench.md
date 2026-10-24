# SwarmCore Design Workbench

## Routes
- Landing-page CTA: `Start design`
- Workbench: `/design`
- Endpoint: `POST /api/design`

## Required server-side environment variables
- `DESIGN_PASSWORD`: workbench access password.
- `GEMINI` (or `GEMINI_API_KEY`): Google Gemini API key. Keep it server-side; never use a `NEXT_PUBLIC_` prefix.

The workbench endpoint runs as a Vercel server function. Environment variables set on a Render service are not automatically visible to Vercel. To use the key already stored on Render, add the same secret value to the Vercel project's environment variables as `GEMINI`, for Production (and Preview if testing preview deployments), then redeploy. Do not commit the key to GitHub or send it in chat.

## Local setup

macOS/Linux:
```bash
export DESIGN_PASSWORD='your-workbench-password'
export GEMINI='your-gemini-api-key'
npm run dev
```

Windows PowerShell:
```powershell
$env:DESIGN_PASSWORD="your-workbench-password"
$env:GEMINI="your-gemini-api-key"
npm run dev
```

## Current Gemini workflow
The API route sends the task to `gemini-3.8-flash` using Google's `generateContent` REST endpoint. The model returns a JSON report with requirements, role-based specialist outputs, calculations, a textual netlist/connection notes, and critic checks. The API key is used only by the server. The "agents" are currently simulated as specialist roles within one model request; they are not separate concurrent agents or independent verification services.

## Important limitations
- AI calculations and component choices may be wrong; validate datasheets and independently check calculations.
- The netlist is textual output, not a validated SPICE netlist, CAD-generated schematic, or PCB layout.
- The current prototype has no user rate limiting or persistent job queue. Keep access restricted while testing.
- Gemini quota, model availability, and API access depend on the Google AI project/key settings.

## Engineering disclaimer
This is a prototype for preliminary design exploration. Do not use generated output as a substitute for simulation, datasheet checks, safety analysis, or qualified engineering review.
