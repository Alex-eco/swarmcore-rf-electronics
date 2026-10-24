import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const expected = process.env.DESIGN_PASSWORD;
  if (!expected) return NextResponse.json({ error: "Workbench password is not configured. Set DESIGN_PASSWORD in Vercel project environment variables." }, { status: 503 });
  let body: { password?: string; task?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request body." }, { status: 400 }); }
  if (typeof body.password !== "string" || body.password !== expected) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  const task = typeof body.task === "string" ? body.task.trim().slice(0, 5000) : "";
  if (!task) return NextResponse.json({ error: "Please describe the design task." }, { status: 400 });
  const result = {
    title: "5 V LED indicator · reference solution",
    requirements: ["5 V DC supply", "Red LED, assumed forward voltage 2.0 V", "Target current approximately 10 mA"],
    agents: [
      { name: "Orchestrator", task: "Split the request into requirements, calculations, circuit assembly and verification subtasks.", output: "Four bounded subtasks with explicit assumptions" },
      { name: "Requirements Agent", task: "Extract supply voltage, LED type, forward voltage and target current.", output: "VCC = 5 V; VF ≈ 2 V; target I ≈ 10 mA" },
      { name: "Calculation Agent", task: "Calculate the series resistor and check a standard value.", output: "R = (5 − 2) / 0.01 = 300 Ω; choose 330 Ω standard value" },
      { name: "Circuit Agent", task: "Connect supply, current-limiting resistor and LED in series.", output: "5 V → R1 330 Ω → red LED → GND" },
      { name: "Critic / Verification Agent", task: "Independently recalculate current and resistor dissipation; flag assumptions.", output: "I ≈ 9.1 mA; resistor dissipation ≈ 27 mW; 0.125 W resistor is sufficient under stated assumptions" }
    ],
    calculations: [
      "Resistor voltage: VR = VS − VF = 5.0 V − 2.0 V = 3.0 V.",
      "Ideal resistor for 10 mA: R = VR / I = 3.0 V / 0.010 A = 300 Ω.",
      "Choose a common 330 Ω resistor: I = 3.0 V / 330 Ω ≈ 9.09 mA.",
      "Resistor power: P = I²R ≈ (0.00909 A)² × 330 Ω ≈ 0.027 W. A 0.125 W resistor provides ample nominal margin.",
      "Assumptions: 5 V regulated supply; red LED VF ≈ 2.0 V at this current. Real VF varies by part, temperature and current."
    ],
    netlist: ["V1 +5V 0 DC 5", "R1 +5V LED_A 330", "D1 LED_A 0 RED_LED", "* Reference topology; use the selected LED model for SPICE simulation"],
    checks: [
      "Independent check: (5 − 2) / 330 = 9.09 mA, consistent with the calculation agent.",
      "Resistor dissipation is approximately 27 mW; a 1/8 W (0.125 W) resistor is adequate nominally.",
      "LED polarity matters: anode toward resistor/+5 V, cathode toward ground.",
      "The LED forward voltage is an assumption; verify the selected component datasheet.",
      "This is a deterministic demonstration workflow; agents are represented as separate software steps, not independent LLM calls."
    ]
  };
  return NextResponse.json({ result, taskReceived: task.length }, { headers: { "Cache-Control": "no-store" } });
}
