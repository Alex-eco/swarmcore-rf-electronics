# SwarmCore Design Workbench (prototype)

## Route
- Landing-page CTA: `Start design`
- Workbench: `/design`
- Endpoint: `POST /api/design`

## Local setup
Set the password in the server environment before starting the app:

```bash
# macOS/Linux
export DESIGN_PASSWORD=alexeco
npm run dev
```

On Windows PowerShell:
```powershell
$env:DESIGN_PASSWORD="alexeco"
npm run dev
```

For Vercel, open Project → Settings → Environment Variables and add `DESIGN_PASSWORD` with value `alexeco` for the environments where the workbench should be accessible, then redeploy. Do not put the password in client-side code or commit it to the repository.

## Current demo task
A 5 V red LED indicator circuit:
- Assumed LED forward voltage: 2.0 V
- Target current: about 10 mA
- Ideal resistor: (5 − 2) / 0.01 = 300 Ω
- Selected standard value: 330 Ω
- Estimated current: 3 / 330 = 9.1 mA
- Estimated resistor dissipation: about 27 mW

The current endpoint is a deterministic baseline that makes the orchestration steps visible. It is not a live Gemini integration and currently returns the reference solution even when the user enters a different task; the entered task is received and displayed as the request context only. Do not present this as autonomous general-purpose design yet.

## Planned next steps
1. Replace the fixed result with a task classifier and structured requirements extraction.
2. Implement agent interfaces with explicit inputs/outputs and orchestrator validation.
3. Add a real model provider behind a server-side API key (Gemini API availability/pricing/limits to be checked at implementation time).
4. Add EDA export (e.g. KiCad-compatible netlist/schematic generation) and automated checks.
5. Add rate limiting and stronger access control before public use.

## Engineering disclaimer
This is an educational reference design. Check the selected LED datasheet and validate the circuit before assembly. AI or rule-based output is not a substitute for engineering review.
