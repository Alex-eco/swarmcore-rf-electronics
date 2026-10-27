"use client";

import RFWorkflowDemo from "./components/RFWorkflowDemo";

const modules = [
  { number: "01", status: "PILOT-READY", statusClass: "border-emerald-300/25 bg-emerald-300/[.06] text-emerald-200", title: "Scientific Research & Technical Intelligence", body: "Find and synthesize relevant research papers, patents, and technical documentation. Extract methods, equations, assumptions, and conclusions with traceable links to original sources.", deliverable: "Annotated literature review · bibliography · comparison matrix" },
  { number: "02", status: "PILOT-READY", statusClass: "border-emerald-300/25 bg-emerald-300/[.06] text-emerald-200", title: "Electronic Component Intelligence", body: "Identify and compare components against electrical, RF, frequency, power, noise, and availability requirements. Review datasheets, constraints, models, and possible alternatives.", deliverable: "Component shortlist · parameter matrix · datasheet links" },
  { number: "03", status: "SCOPED PILOT", statusClass: "border-cyan-300/25 bg-cyan-300/[.06] text-cyan-200", title: "Engineering Calculations & Design Options", body: "Prepare preliminary calculations, compare circuit and system-level options, and turn assumptions into testable engineering hypotheses.", deliverable: "Calculation note · input assumptions · validation plan" },
  { number: "04", status: "PROTOTYPE / INTEGRATION", statusClass: "border-violet-300/25 bg-violet-300/[.06] text-violet-200", title: "Engineering CAD / EDA Workflow Automation", body: "Develop scripts and agent workflows for repeatable operations in a selected engineering environment: model setup, simulation runs, and results collection, subject to supported APIs and available licenses.", deliverable: "Agreed workflow · automation script · test report" },
  { number: "05", status: "IN DEVELOPMENT", statusClass: "border-amber-300/25 bg-amber-300/[.06] text-amber-200", title: "End-to-End Microwave Device Development", body: "Long-term vision: an agent-assisted engineering loop from requirements and component selection through modelling, optimization, and engineering documentation. Device readiness must be demonstrated through appropriate simulation, engineering review, and measurement.", deliverable: "Roadmap objective — not represented as an available finished capability" },
];

const workflow = [
  ["01", "Define the engineering task", "Agree on requirements, constraints, available tools, and measurable acceptance criteria."],
  ["02", "Gather traceable evidence", "Agents organize research, component data, and input parameters with source links."],
  ["03", "Generate options and artifacts", "Prepare comparable approaches, calculations, and scripts with explicit assumptions."],
  ["04", "Engineer-led validation", "A qualified engineer reviews critical decisions; simulation and measurement are not replaced by an AI answer."],
];

const examples = [
  "Find component alternatives by frequency, power, noise, and availability.",
  "Review literature for a specified antenna, filter, or RF architecture.",
  "Prepare a preliminary calculation and validation plan for an RF subsystem.",
  "Automate a repeatable step in an existing engineering CAD / EDA workflow.",
];

export default function Home() {
  const agents = [
    { name: "Research", x: 15, y: 24, task: "Evidence" },
    { name: "Components", x: 26, y: 74, task: "Parts data" },
    { name: "Design", x: 74, y: 24, task: "Calculations" },
    { name: "Verify", x: 85, y: 74, task: "Review" },
  ];

  return (
    <main>
      <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-[#05070b]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="font-mono text-sm font-bold tracking-[.28em]">SWARMCORE</a>
          <div className="hidden gap-7 text-sm text-slate-400 md:flex">
            <a href="#rf-demo" className="hover:text-white">Product demo</a>
            <a href="#modules" className="hover:text-white">Capabilities</a>
            <a href="#workflow" className="hover:text-white">How it works</a>
            <a href="#pilot" className="hover:text-white">Pilot projects</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/5 px-3 py-1 text-[10px] font-semibold tracking-[.12em] text-cyan-200">RF · ELECTRONICS AI</span>
        </div>
      </nav>

      <section className="grid-bg relative overflow-hidden px-6 pb-24 pt-36 sm:pt-44">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-5 font-mono text-xs tracking-[.16em] text-cyan-300">SWARMCORE RF & ELECTRONICS · MULTI-AGENT ENGINEERING</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.04em] sm:text-7xl">
              AI-Powered <span className="text-cyan-200">Resilient Wireless Link Design</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              SwarmCore is an AI-powered engineering platform that autonomously designs and optimizes resilient wireless communication links to maintain reliable connectivity under challenging propagation conditions and interference.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#rf-demo" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-100">Watch product demo <span aria-hidden="true">↗</span></a>
              <a href="#pilot" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/30">Discuss a pilot</a>
              <a href="#modules" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/30">Explore capabilities</a>
              <a href="/design" className="rounded-full border border-cyan-200/40 bg-cyan-200/10 px-5 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-200/20">Start design ↗</a>
            </div>
            <p className="mt-6 text-xs leading-5 text-slate-500">Evidence-led engineering automation with a human in the loop. Pilot scope and acceptance criteria are agreed for each use case.</p>
          </div>

          <div className="glow relative h-[390px] overflow-hidden rounded-3xl border border-white/10 bg-[#080c13]/80 sm:h-[430px]">
            <div className="grid-bg absolute inset-0 opacity-40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.09),transparent_48%)]" />
            <div className="relative h-full w-full">
              <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/40 bg-[#08121d]/90 shadow-[0_0_70px_rgba(125,211,252,.18)]">
                <div className="text-center font-mono text-[10px] leading-5 tracking-[.22em] text-cyan-100">SWARM<br/>CORE<br/><span className="text-[8px] tracking-[.12em]">RF / EE</span></div>
              </div>
              <div className="network-orbit network-orbit-one" />
              <div className="network-orbit network-orbit-two" />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <defs><linearGradient id="linkGlow"><stop offset="0%" stopColor="#64748b" stopOpacity=".18"/><stop offset="50%" stopColor="#67e8f9" stopOpacity=".85"/><stop offset="100%" stopColor="#64748b" stopOpacity=".18"/></linearGradient></defs>
                <line x1="15" y1="24" x2="50" y2="50" className="network-link network-link-a" />
                <line x1="26" y1="74" x2="50" y2="50" className="network-link network-link-b" />
                <line x1="74" y1="24" x2="50" y2="50" className="network-link network-link-c" />
                <line x1="85" y1="74" x2="50" y2="50" className="network-link network-link-d" />
                <circle cx="50" cy="50" r="21" className="network-ring" />
                <circle cx="50" cy="50" r="30" className="network-ring network-ring-slow" />
              </svg>
              {agents.map((agent, i) => (
                <div key={agent.name} className={`agent-node agent-node-${i + 1}`} style={{ left: `${agent.x}%`, top: `${agent.y}%` }}>
                  <span className="agent-dot" />
                  <span className="mt-3 block whitespace-nowrap text-[10px] uppercase tracking-[.12em] text-slate-400">{agent.name}</span>
                  <span className="agent-task">{agent.task} → swarm</span>
                </div>
              ))}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[9px] tracking-[.1em] text-slate-500">
                <span className="flex items-center gap-2"><span className="live-indicator" /> MULTI-AGENT WORKFLOW</span>
                <span>RESEARCH / DESIGN / VALIDATE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {[
            ["Research", "Traceable sources and technical evidence"],
            ["Engineering", "Calculations and workflow automation"],
            ["Verification", "Explicit assumptions and engineer review"],
          ].map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><p className="text-sm font-semibold text-cyan-200">{title}</p><p className="mt-2 text-sm text-slate-400">{body}</p></div>)}
        </div>
      </section>

      <RFWorkflowDemo />

      <section id="modules" className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs tracking-[.22em] text-cyan-300">CAPABILITIES & ROADMAP</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">From engineering intelligence to automated design.</h2>
          <p className="mt-5 max-w-2xl leading-7 text-slate-400">We start with tasks that can produce a reviewable result quickly. Deeper CAD integration and end-to-end development are being explored in stages.</p>
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {modules.map((module) => (
              <article key={module.number} className={`flex flex-col rounded-2xl border p-6 transition hover:-translate-y-1 hover:border-cyan-200/25 ${module.number === "05" ? "border-amber-300/20 bg-amber-300/[.025] lg:col-span-2" : "border-white/10 bg-white/[.025]"}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-xs text-cyan-300">{module.number} / MODULE</span>
                  <span className={`rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[.08em] ${module.statusClass}`}>{module.status}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">{module.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">{module.body}</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-xs uppercase tracking-[.12em] text-slate-500">Potential deliverable</p>
                  <p className="mt-2 text-sm text-slate-300">{module.deliverable}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-t border-white/10 bg-[#070a10] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs tracking-[.22em] text-cyan-300">HOW A PILOT WORKS</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
            <div>
              <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">A defined task. A measurable outcome.</h2>
              <p className="mt-5 leading-7 text-slate-400">The workflow is tailored to your team's process, available documentation, and engineering tools. The output is an artifact an engineer can inspect and validate.</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-300">
                {examples.map((example) => <li key={example} className="flex gap-3"><span className="text-cyan-300">↗</span><span>{example}</span></li>)}
              </ul>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {workflow.map(([number, title, body]) => (
                <div key={number} className="rounded-xl border border-white/10 bg-white/[.02] p-5">
                  <span className="font-mono text-xs text-cyan-300">{number}</span>
                  <h3 className="mt-3 font-medium">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="pilot" className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/[.07] to-violet-400/[.05] p-8 sm:p-12 lg:grid-cols-[1fr_.8fr]">
            <div>
              <p className="font-mono text-xs tracking-[.22em] text-cyan-300">ENGINEERING PILOTS</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight">Let's test it on a real task.</h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-400">Bring a repeatable task from electronics or RF development. We'll define the inputs, quality criteria, automation boundaries, and deliverable together.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#05070b]/50 p-6">
              <p className="text-sm font-semibold">Good candidates for a first pilot</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                <li>• Component research and comparison</li>
                <li>• Literature review for an engineering topic</li>
                <li>• Preliminary calculations and scripts</li>
                <li>• Automation of one step in a CAD / EDA tool</li>
              </ul>
              <a href="mailto:aiagentquantum@gmail.com?subject=SwarmCore%20RF%20%26%20Electronics%20Pilot" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-cyan-100">Discuss a use case</a>
              <p className="mt-4 text-xs leading-5 text-slate-500">aiagentquantum@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-6xl flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p className="font-mono text-xs tracking-[.22em] text-cyan-300">SWARMCORE RF & ELECTRONICS</p><p className="mt-2 text-sm text-slate-400">AI agents for engineering research and development automation.</p></div>
          <a href="mailto:aiagentquantum@gmail.com" className="text-sm text-cyan-200 hover:text-white">aiagentquantum@gmail.com ↗</a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-xs text-slate-600 sm:flex-row">
          <span>© 2026 SwarmCore</span>
          <span>RF & Electronics AI · Research initiative</span>
        </div>
        <p className="mx-auto mt-4 max-w-6xl text-[11px] leading-5 text-slate-600">Capability labels describe pilot availability and the current roadmap; they do not certify engineering outcomes. AI-generated outputs require review by a qualified specialist. Electromagnetic performance must be validated using appropriate engineering simulation and, where necessary, physical measurements.</p>
      </footer>
    </main>
  );
}
