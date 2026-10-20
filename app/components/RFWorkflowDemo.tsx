"use client";

import { useEffect, useState } from "react";

const stages = [
  { title: "Define the task", subtitle: "Engineer describes the goal", agent: "Requirements Agent", detail: "Parse natural-language input into measurable RF requirements and constraints." },
  { title: "Analyze requirements", subtitle: "Turn the brief into parameters", agent: "Research Agent", detail: "Identify missing inputs, collect relevant evidence, and make assumptions explicit." },
  { title: "Calculate the link budget", subtitle: "Estimate signal performance", agent: "RF Calculation Agent", detail: "Calculate free-space path loss, received power, and link margin from the supplied values." },
  { title: "Select an antenna", subtitle: "Match frequency and constraints", agent: "Antenna Selection Agent", detail: "Compare candidate antennas by operating band, gain, size, connector, and documentation." },
  { title: "Select components", subtitle: "Compare real parts and datasheets", agent: "BOM Selection Agent", detail: "Rank RF components against frequency, supply, noise, gain, package, and source-backed specifications." },
  { title: "Generate schematic & BOM", subtitle: "Assemble a reference design", agent: "Design Assembly Agent", detail: "Create a reference signal-chain diagram and a bill of materials with part numbers and source links." },
  { title: "Validate the design", subtitle: "Check constraints and assumptions", agent: "Validation Agent", detail: "Flag compatibility questions and identify what still needs EDA simulation or engineering review." },
  { title: "Deliver the design package", subtitle: "Prepare reviewable artifacts", agent: "Report Agent", detail: "Bundle calculations, component shortlist, schematic reference, BOM, and validation checklist." },
];

const parts = [
  { ref: "U1", name: "Low-noise amplifier", spec: "Band, gain, noise figure, supply", tag: "LNA" },
  { ref: "FL1", name: "Band-pass filter", spec: "Passband, insertion loss, rejection", tag: "FILTER" },
  { ref: "D1", name: "RF switch / protection", spec: "Frequency, power handling, loss", tag: "RF" },
  { ref: "C1–C4", name: "Matching & decoupling", spec: "Impedance, value, package, layout", tag: "PASSIVES" },
];

export default function RFWorkflowDemo() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((n) => (n + 1) % stages.length), 3200);
    return () => window.clearInterval(timer);
  }, [playing]);

  return (
    <section id="rf-demo" className="border-y border-cyan-300/15 bg-[#060a12] px-5 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="font-mono text-xs tracking-[.22em] text-cyan-300">INTERACTIVE WORKFLOW DEMO</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">From an engineering brief to an RF design package.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-slate-400">Watch specialist AI agents turn a task into calculations, component options, a reference schematic, and a reviewable bill of materials.</p>
          </div>
          <button type="button" onClick={() => setPlaying((v) => !v)} className="rounded-full border border-cyan-200/25 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-200/10" aria-pressed={playing}>{playing ? "Pause animation Ⅱ" : "Play animation ▶"}</button>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[.82fr_1.18fr]">
          <div className="rounded-2xl border border-white/10 bg-[#090f1c] p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-sm font-semibold">New RF project</span><span className="rounded-full bg-cyan-300/10 px-2.5 py-1 font-mono text-[10px] text-cyan-200">DEMO INPUT</span>
            </div>
            <div className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[.035] p-4 text-sm leading-6 text-slate-200">
              “Design a 2.4 GHz wireless link for 1 km. TX power: 20 dBm. Receiver sensitivity: −95 dBm. Suggest an antenna and suitable RF front-end components.”
            </div>
            <p className="mt-5 font-mono text-[10px] tracking-[.16em] text-slate-500">EXTRACTED PARAMETERS</p>
            <div className="mt-3 space-y-0.5">
              {[["Frequency", "2.4 GHz"], ["Distance", "1 km"], ["TX power", "20 dBm"], ["RX sensitivity", "−95 dBm"]].map(([k,v]) => <div key={k} className="flex justify-between border-b border-white/[.06] py-2.5 text-sm"><span className="text-slate-400">{k}</span><span className="font-mono text-slate-200">{v}</span></div>)}
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Example brief · illustrative values</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#080d17] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">Multi-agent execution</p><span className="font-mono text-[10px] text-cyan-300">STEP {String(active + 1).padStart(2,"0")} / 08</span>
            </div>
            <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-8">
              {stages.map((s,i) => <button key={s.title} type="button" onClick={() => { setActive(i); setPlaying(false); }} aria-label={`Show step ${i+1}: ${s.title}`} aria-current={active===i ? "step" : undefined} className={`group flex min-w-0 flex-col items-center gap-2 rounded-lg border px-1 py-3 transition ${active===i ? "border-cyan-200/60 bg-cyan-200/10" : i<active ? "border-emerald-300/20 bg-emerald-300/[.035]" : "border-white/[.07] bg-white/[.015] hover:border-white/20"}`}>
                <span className={`flex h-7 w-7 items-center justify-center rounded-full font-mono text-[10px] ${active===i ? "bg-cyan-200 text-slate-950" : i<active ? "bg-emerald-300/15 text-emerald-200" : "bg-white/5 text-slate-500"}`}>{i<active ? "✓" : String(i+1).padStart(2,"0")}</span>
                <span className="hidden text-center text-[9px] leading-3 text-slate-400 sm:block">{["Task","Analyze","Calculate","Antenna","Parts","Schematic","Validate","Deliver"][i]}</span>
              </button>)}
            </div>
            <div className="mt-5 min-h-[160px] rounded-xl border border-cyan-300/20 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,.08),transparent_55%)] p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/25 bg-cyan-200/10 text-lg text-cyan-200">✳</div>
                <div>
                  <p className="font-mono text-[10px] tracking-[.14em] text-cyan-300">{stages[active].agent.toUpperCase()}</p>
                  <h3 className="mt-2 text-xl font-semibold">{stages[active].title}</h3>
                  <p className="mt-1 text-sm text-slate-400">{stages[active].subtitle}</p>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{stages[active].detail}</p>
                </div>
              </div>
              <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/5"><div key={active} className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 rf-progress" /></div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500"><span>Agents collaborate; each output remains reviewable.</span><span className="text-emerald-300">● Source-aware workflow</span></div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-[#090f1c] p-5 sm:p-6">
            <div className="flex items-center justify-between"><h3 className="font-semibold">RF front-end · reference schematic</h3><span className="font-mono text-[10px] text-violet-200">CONCEPT</span></div>
            <div className="mt-5 overflow-hidden rounded-xl border border-white/[.07] bg-[#050912] p-3 sm:p-5">
              <svg viewBox="0 0 640 160" role="img" aria-label="Reference signal chain: antenna to band-pass filter, low-noise amplifier, RF switch, and receiver" className="w-full">
                <defs><linearGradient id="rfLine"><stop stopColor="#22d3ee"/><stop offset="1" stopColor="#a78bfa"/></linearGradient></defs>
                <g fill="none" stroke="url(#rfLine)" strokeWidth="2">
                  <path d="M32 78 L90 78 M150 78 L198 78 M258 78 L306 78 M366 78 L414 78 M474 78 L540 78"/>
                  <path d="M82 70 L90 78 L82 86 M190 70 L198 78 L190 86 M298 70 L306 78 L298 86 M406 70 L414 78 L406 86 M532 70 L540 78 L532 86"/>
                  <path d="M32 78 L32 54 M18 54 Q32 28 46 54 M23 54 Q32 38 41 54"/>
                  <rect x="90" y="53" width="60" height="50" rx="5"/><path d="M100 66 Q110 54 120 66 T140 66 M100 79 Q110 67 120 79 T140 79 M100 92 Q110 80 120 92 T140 92"/>
                  <path d="M198 53 L258 78 L198 103 Z"/>
                  <rect x="306" y="53" width="60" height="50" rx="5"/><path d="M321 68 L351 88 M351 68 L321 88"/>
                  <rect x="414" y="53" width="60" height="50" rx="5"/><path d="M429 91 L459 65 M429 65 L459 91"/>
                </g>
                <g fill="#dbeafe" fontSize="12" textAnchor="middle"><text x="32" y="125">ANT</text><text x="120" y="125">BPF</text><text x="228" y="125">LNA</text><text x="336" y="125">SWITCH</text><text x="444" y="125">MATCH</text><text x="580" y="82">RX</text></g>
                <text x="320" y="151" fill="#64748b" fontSize="10" textAnchor="middle">Conceptual signal chain · not a production schematic</text>
              </svg>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">The actual topology and component values depend on the receiver architecture, impedance targets, PCB stack-up, and validation results.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#090f1c] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3"><h3 className="font-semibold">Component shortlist</h3><span className="font-mono text-[10px] text-cyan-200">BOM PREVIEW</span></div>
            <p className="mt-2 text-sm text-slate-400">Candidates are ranked against requirements and manufacturer datasheets.</p>
            <div className="mt-4 space-y-2">
              {parts.map((p) => <div key={p.ref} className="flex items-center gap-3 rounded-xl border border-white/[.07] bg-white/[.02] p-3">
                <div className="flex h-10 w-12 shrink-0 items-center justify-center rounded-lg border border-cyan-300/15 bg-cyan-300/[.06] font-mono text-[10px] text-cyan-200">{p.ref}</div>
                <div className="min-w-0 flex-1"><p className="text-sm font-medium">{p.name}</p><p className="mt-1 text-xs text-slate-500">{p.spec}</p></div>
                <span className="hidden rounded-md border border-white/10 px-2 py-1 font-mono text-[9px] text-slate-400 sm:block">{p.tag}</span>
              </div>)}
            </div>
            <div className="mt-4 rounded-xl border border-amber-200/15 bg-amber-200/[.035] p-3 text-xs leading-5 text-amber-100/80">Illustrative BOM structure only. Exact part numbers must be verified against current datasheets and the final engineering requirements.</div>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-300/15 bg-emerald-300/[.035] p-5">
          <div><p className="font-semibold text-emerald-100">Final deliverables</p><p className="mt-1 text-sm text-slate-400">Link-budget note · component shortlist · reference schematic · BOM · validation checklist</p></div>
          <a href="#pilot" className="rounded-full bg-cyan-200 px-5 py-2.5 text-sm font-semibold text-slate-950 hover:bg-cyan-100">Discuss a pilot ↗</a>
        </div>
      </div>
    </section>
  );
}
