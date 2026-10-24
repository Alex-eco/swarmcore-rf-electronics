"use client";

import { useMemo, useState } from "react";

type Result = { title: string; requirements: string[]; agents: { name: string; task: string; output: string }[]; calculations: string[]; netlist: string[]; checks: string[]; };
export default function DesignWorkbench() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [task, setTask] = useState("Design a 5 V LED indicator circuit. Use a red LED with a forward voltage of about 2.0 V and target current around 10 mA. Provide calculations and a readable schematic.");
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const report = useMemo(() => result ? JSON.stringify({ task, ...result }, null, 2) : "", [result, task]);
  async function runDesign() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/design", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password, task }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Design request failed");
      setAuthenticated(true); setResult(data.result);
    } catch (e) { setError(e instanceof Error ? e.message : "Request failed"); }
    finally { setBusy(false); }
  }
  function download() {
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "swarmcore-design-report.txt"; a.click(); URL.revokeObjectURL(url);
  }
  return <main className="min-h-screen bg-[#05070b] px-5 py-10 text-white sm:px-8">
    <div className="mx-auto max-w-5xl">
      <a href="/" className="text-sm text-cyan-200 hover:text-white">← SwarmCore RF & Electronics</a>
      <div className="mt-8 flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-xs tracking-[.2em] text-cyan-300">SWARMCORE · DESIGN WORKBENCH</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Start design</h1><p className="mt-3 max-w-2xl leading-7 text-slate-400">A first end-to-end educational task: requirements → calculations → circuit proposal → critic review → engineering report.</p></div><span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs text-amber-100">Prototype · deterministic baseline</span></div>
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/[.025] p-5 sm:p-7">
        {!authenticated && <div className="mb-5"><label className="mb-2 block text-sm text-slate-300" htmlFor="password">Access password</label><input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full max-w-sm rounded-xl border border-white/15 bg-black/30 px-4 py-3 outline-none focus:border-cyan-200" placeholder="Enter workbench password" autoComplete="current-password" /></div>}
        <label className="mb-2 block text-sm text-slate-300" htmlFor="task">Describe the electronics task</label>
        <textarea id="task" value={task} onChange={e=>setTask(e.target.value)} rows={4} className="w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3 leading-6 outline-none focus:border-cyan-200" />
        <div className="mt-4 flex flex-wrap items-center gap-3"><button disabled={busy || !password.trim() || !task.trim()} onClick={runDesign} className="rounded-full bg-cyan-200 px-6 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-50">{busy ? "Orchestrator running…" : "Run agent workflow →"}</button><button onClick={()=>{setTask("Design a 5 V LED indicator circuit. Use a red LED with a forward voltage of about 2.0 V and target current around 10 mA. Provide calculations and a readable schematic.");setResult(null);setError("");}} className="rounded-full border border-white/15 px-5 py-3 text-sm text-slate-300 hover:border-white/30">Load reference task</button></div>
        {error && <p role="alert" className="mt-4 rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-200">{error}</p>}
      </section>
      {result && <div className="mt-8 space-y-5">
        <section className="rounded-2xl border border-cyan-200/20 bg-cyan-200/[.035] p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-2xl font-semibold">{result.title}</h2><button onClick={download} className="rounded-full border border-cyan-200/30 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-200/10">Download report (.txt)</button></div>
          <h3 className="mt-6 font-semibold">Orchestrator · task decomposition</h3><p className="mt-2 text-sm leading-6 text-slate-400">The orchestrator converts the brief into bounded subtasks, passes each to a specialist agent, then assembles and checks their outputs. This baseline uses deterministic rules, not a live Gemini model.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">{result.agents.map((a,i)=><article key={a.name} className="rounded-xl border border-white/10 bg-black/20 p-4"><p className="font-mono text-xs text-cyan-200">AGENT {String(i+1).padStart(2,"0")}</p><h4 className="mt-2 font-semibold">{a.name}</h4><p className="mt-2 text-sm text-slate-400">{a.task}</p><p className="mt-3 border-t border-white/10 pt-3 text-sm text-slate-200">Output: {a.output}</p></article>)}</div>
        </section>
        <section className="grid gap-5 lg:grid-cols-2"><article className="rounded-2xl border border-white/10 p-5"><h3 className="text-lg font-semibold">Engineering calculations</h3><ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">{result.calculations.map(x=><li key={x}>• {x}</li>)}</ul></article>
        <article className="rounded-2xl border border-white/10 p-5"><h3 className="text-lg font-semibold">Reference schematic</h3><div className="mt-4 rounded-xl bg-[#080d17] p-3"><svg viewBox="0 0 600 170" role="img" aria-label="5 volt source connected in series to 330 ohm resistor and red LED to ground" className="w-full"><g fill="none" stroke="#67e8f9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M45 80 H130 M205 80 H285 M345 80 H470 V130 H45 V80"/><rect x="130" y="65" width="75" height="30" rx="2"/><path d="M285 80 L320 55 L320 105 Z M320 55 L345 80 L320 105"/><path d="M327 48 l13 -13 m-8 1 l8 -1 l-1 8 M340 62 l13 -13 m-8 1 l8 -1 l-1 8"/></g><g fill="#e2e8f0" fontSize="15"><text x="28" y="62">+5 V</text><text x="140" y="55">R1 330 Ω</text><text x="280" y="130">D1 red LED</text><text x="455" y="153">0 V / GND</text></g><circle cx="45" cy="80" r="5" fill="#67e8f9"/></svg></div><p className="mt-3 text-xs leading-5 text-slate-500">Conceptual schematic, not a PCB layout. Confirm LED polarity and resistor power rating before assembly.</p></article></section>
        <section className="rounded-2xl border border-white/10 p-5"><h3 className="text-lg font-semibold">Critic / verification agent</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{result.checks.map(x=><li key={x}>✓ {x}</li>)}</ul><h3 className="mt-6 font-semibold">Text netlist</h3><pre className="mt-3 overflow-x-auto rounded-xl bg-black/30 p-4 text-sm text-cyan-100">{result.netlist.join("\n")}</pre></section>
      </div>}
      <p className="mt-8 text-xs leading-5 text-slate-600">Prototype status: the reference circuit is intentionally simple and has a hand-checkable answer. AI-generated or calculated outputs are not a substitute for qualified engineering review.</p>
    </div>
  </main>;
}
