"use client";



const modules = [
  { number: "01", status: "PILOT-READY", statusClass: "border-emerald-300/25 bg-emerald-300/[.06] text-emerald-200", title: "Component & Datasheet Research", body: "Search manufacturer datasheets and technical documentation to identify candidate replacements for obsolete, unavailable, or costly electronic components.", deliverable: "Source-linked component shortlist · datasheet comparison" },
  { number: "02", status: "PILOT-READY", statusClass: "border-emerald-300/25 bg-emerald-300/[.06] text-emerald-200", title: "Component Replacement Intelligence", body: "Compare candidate replacements against electrical parameters, package, pinout, operating limits, and availability. Flag mismatches and information that needs engineering review.", deliverable: "Alternative parts · compatibility matrix · datasheet links" },
  { number: "03", status: "SCOPED PILOT", statusClass: "border-cyan-300/25 bg-cyan-300/[.06] text-cyan-200", title: "Compatibility & Redesign Impact Assessment", body: "Assess potential impact of a component change on the existing design, identify parameter conflicts, and outline circuit changes for engineer review.", deliverable: "Compatibility findings · identified risks · review checklist" },
  { number: "04", status: "PROTOTYPE / INTEGRATION", statusClass: "border-violet-300/25 bg-violet-300/[.06] text-violet-200", title: "BOM Risk & Obsolescence Screening", body: "Screen a bill of materials for obsolete, at-risk, or hard-to-source parts and prioritize items for replacement research. Coverage depends on available supplier and lifecycle data.", deliverable: "Prioritized BOM risk report · research queue" },
  { number: "05", status: "IN DEVELOPMENT", statusClass: "border-amber-300/25 bg-amber-300/[.06] text-amber-200", title: "Board Redesign Support", body: "Long-term direction: connect component research with design-file analysis, circuit simulation, and engineering validation. Full board redesign is a roadmap goal, not a current finished capability.", deliverable: "Roadmap objective — requires engineering validation" },
];

const workflow = [
  ["01", "Import the component list", "Start with a BOM, target component, or an obsolete-part notice and define constraints such as package, voltage, current, temperature, and cost."],
  ["02", "Research replacement candidates", "Collect manufacturer datasheets, lifecycle information, and supplier evidence with traceable source links."],
  ["03", "Compare technical compatibility", "Compare key electrical and mechanical parameters, pinout, package, and operating limits; clearly flag unknowns."],
  ["04", "Prepare an engineer-review report", "Deliver ranked alternatives, risks, possible circuit changes, and checks for an engineer to validate before adoption."],
];

const examples = [
  "Find replacement candidates for obsolete or unavailable components and compare their datasheets.",
  "Check package, pinout, voltage, current, temperature range, and key electrical parameters.",
  "Identify datasheet mismatches and missing information before a replacement is approved.",
  "Generate a prioritized component-risk report from a bill of materials.",
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
          <span className="rounded-full border border-cyan-300/30 bg-cyan-300/5 px-3 py-1 text-[10px] font-semibold tracking-[.12em] text-cyan-200">ELECTRONICS COMPONENT INTELLIGENCE</span>
        </div>
      </nav>

      <section className="grid-bg relative overflow-hidden px-6 pb-24 pt-36 sm:pt-44">
        <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="mb-5 font-mono text-xs tracking-[.16em] text-cyan-300">SWARMCORE · COMPONENT REPLACEMENT INTELLIGENCE</p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-.04em] sm:text-7xl">
              AI Agents for <span className="text-cyan-200">Electronic Component Replacement</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-400">
              SwarmCore helps electronics engineering teams research replacement components, compare datasheets, assess compatibility risks, and understand the potential impact of part changes on existing designs.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#rf-demo" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-cyan-100">See how it works <span aria-hidden="true">↗</span></a>
              <a href="#pilot" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/30">Discuss a pilot</a>
              <a href="#modules" className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-white/30">Explore capabilities</a>
              <a href="/design" className="rounded-full border border-cyan-200/40 bg-cyan-200/10 px-5 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-200/20">Start design ↗</a>
            </div>
            <p className="mt-6 text-xs leading-5 text-slate-500">Engineering recommendations are evidence-led and designed for engineer review. Final component selection and design approval remain with qualified engineers.</p>
          </div>

          <div className="glow relative h-[390px] overflow-hidden rounded-3xl border border-white/10 bg-[#080c13]/80 sm:h-[430px]">
            <div className="grid-bg absolute inset-0 opacity-40" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.09),transparent_48%)]" />
            <div className="relative h-full w-full">
              <div className="absolute left-1/2 top-1/2 z-10 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-200/40 bg-[#08121d]/90 shadow-[0_0_70px_rgba(125,211,252,.18)]">
                <div className="text-center font-mono text-[10px] leading-5 tracking-[.22em] text-cyan-100">SWARM<br/>CORE<br/><span className="text-[8px] tracking-[.12em]">BOM / EDA</span></div>
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
                <span className="flex items-center gap-2"><span className="live-indicator" /> COMPONENT RESEARCH WORKFLOW</span>
                <span>FIND / COMPARE / REVIEW</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
          {[
            ["Research", "Traceable sources and technical evidence"],
            ["Compatibility", "Pinout, package and parameter checks"],
            ["Verification", "Explicit assumptions and engineer review"],
          ].map(([title, body]) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><p className="text-sm font-semibold text-cyan-200">{title}</p><p className="mt-2 text-sm text-slate-400">{body}</p></div>)}
        </div>
      </section>

      <section id="rf-demo" className="border-t border-white/10 px-6 py-16"><div className="mx-auto max-w-6xl"><p className="font-mono text-xs tracking-[.22em] text-cyan-300">REPLACEMENT WORKFLOW</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">From an unavailable part to a reviewable shortlist.</h2><div className="mt-8 grid gap-3 sm:grid-cols-4">{[["01","Identify","Start with an obsolete part or BOM entry."],["02","Research","Gather datasheets and lifecycle evidence."],["03","Compare","Check package, pinout, ratings, and limits."],["04","Review","Flag risks and prepare engineer-review notes."]].map(([n,t,b])=><div key={n} className="rounded-2xl border border-white/10 bg-white/[.025] p-5"><span className="font-mono text-xs text-cyan-300">{n}</span><h3 className="mt-3 font-semibold">{t}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{b}</p></div>)}</div><p className="mt-5 text-xs leading-5 text-slate-500">This describes the target workflow; actual coverage and compatibility depend on available component data and engineering review.</p></div></section>

      <section id="modules" className="border-t border-white/10 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs tracking-[.22em] text-cyan-300">CAPABILITIES & ROADMAP</p>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">From component research to replacement decisions.</h2>
          <p className="mt-5 max-w-2xl leading-7 text-slate-400">Start with traceable component research and compatibility reports. Deeper design-file analysis and simulation-based validation can be added as the workflow matures.</p>
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
              <p className="mt-4 max-w-xl leading-7 text-slate-400">Bring a bill of materials or a real obsolete-component case. We’ll agree on constraints, evidence sources, review criteria, and a measurable pilot deliverable.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#05070b]/50 p-6">
              <p className="text-sm font-semibold">Good candidates for a first pilot</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
                <li>• BOM screening and replacement research</li>
                <li>• Datasheet comparison and compatibility assessment</li>
                <li>• Risk assessment and redesign-impact report</li>
                <li>• Engineer-reviewed recommendations for component substitution</li>
              </ul>
              <a href="mailto:aiagentquantum@gmail.com?subject=SwarmCore%20Component%20Replacement%20Pilot" className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-black hover:bg-cyan-100">Discuss a use case</a>
              <p className="mt-4 text-xs leading-5 text-slate-500">aiagentquantum@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 px-6 py-16">
        <div className="mx-auto max-w-6xl flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div><p className="font-mono text-xs tracking-[.22em] text-cyan-300">SWARMCORE COMPONENT INTELLIGENCE</p><p className="mt-2 text-sm text-slate-400">AI-assisted component replacement research and compatibility assessment.</p></div>
          <a href="mailto:aiagentquantum@gmail.com" className="text-sm text-cyan-200 hover:text-white">aiagentquantum@gmail.com ↗</a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 text-xs text-slate-600 sm:flex-row">
          <span>© 2026 SwarmCore</span>
          <span>Electronic Component Intelligence · Engineering research initiative</span>
        </div>
        <p className="mx-auto mt-4 max-w-6xl text-[11px] leading-5 text-slate-600">Capability labels describe pilot availability and the current roadmap; they do not certify engineering outcomes. AI-generated outputs require review by a qualified specialist. Electromagnetic performance must be validated using appropriate engineering simulation and, where necessary, physical measurements.</p>
      </footer>
    </main>
  );
}
