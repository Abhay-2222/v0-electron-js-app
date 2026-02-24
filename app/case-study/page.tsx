"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#FAFAF8]/80 backdrop-blur-md border-b border-[#E8E5E0]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <Link href="/" className="text-[#6B6B6B] hover:text-[#1A1A1A] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="text-sm text-[#6B6B6B] font-sans">Case Study</span>
        </div>
      </nav>

      {/* Hero */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs tracking-widest uppercase text-[#6B6B6B] font-sans">Healthcare AI</span>
          <span className="text-[#D4D0C8]">/</span>
          <span className="text-xs tracking-widest uppercase text-[#6B6B6B] font-sans">Product Design</span>
          <span className="text-[#D4D0C8]">/</span>
          <span className="text-xs tracking-widest uppercase text-[#6B6B6B] font-sans">UX Research</span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans text-[#1A1A1A] leading-tight tracking-tight text-balance mb-6">
          CareSummarizer + CareLens
        </h1>
        <p className="text-xl md:text-2xl text-[#6B6B6B] font-sans leading-relaxed max-w-3xl text-pretty">
          A clinical decision-readiness platform that transforms raw EHR data into decision-ready cases by surfacing documentation gaps, policy risks, and explainable AI insights before clinical decisions are made.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-xs tracking-widest uppercase text-[#9A9A9A] mb-1 font-sans">Role</p>
            <p className="text-sm text-[#1A1A1A] font-sans">Product Designer, UX Researcher, Strategic Thinker</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#9A9A9A] mb-1 font-sans">Domain</p>
            <p className="text-sm text-[#1A1A1A] font-sans">Healthcare AI / Utilization Review</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#9A9A9A] mb-1 font-sans">Stack</p>
            <p className="text-sm text-[#1A1A1A] font-sans">React, Oracle Redwood, Claude 4 Sonnet, Vercel</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-[#9A9A9A] mb-1 font-sans">Status</p>
            <p className="text-sm text-[#1A1A1A] font-sans">In Progress -- Portfolio & Demo Ready</p>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6">
        <div className="h-px bg-[#E8E5E0]" />
      </div>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-24">

        {/* ── Section 1: The Problem ── */}
        <section>
          <SectionLabel number="01" title="The Problem" />
          <div className="mt-8 space-y-6">
            <p className="text-lg text-[#3A3A3A] font-sans leading-relaxed">
              Healthcare systems store data well but do not prepare decisions well. Utilization Review (UR) nurses spend 40-60 minutes per case hunting through fragmented EHR notes, PDF labs, and payer rules across 8+ separate tools -- only to discover documentation gaps after a denial has already occurred.
            </p>
            <div className="bg-[#F2F0EB] rounded-2xl p-8 space-y-4">
              <p className="text-sm tracking-widest uppercase text-[#9A9A9A] font-sans">The consequences</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard value="30-40%" label="Denial rate on prior authorization submissions" />
                <StatCard value="$2.5M" label="Annual revenue loss per hospital facility" />
                <StatCard value="40%" label="Nurse burnout driven by administrative burden" />
                <StatCard value="8+" label="Separate tools used per single case review" />
              </div>
            </div>
            <Callout>
              The core insight that shaped everything: the problem is not a lack of data. It is that data arrives in the wrong format, at the wrong time, to the wrong people.
            </Callout>
          </div>
        </section>

        {/* ── Section 2: Research & Discovery ── */}
        <section>
          <SectionLabel number="02" title="Research & Discovery" />
          <div className="mt-8 space-y-12">

            <div>
              <h3 className="text-lg text-[#1A1A1A] font-sans mb-4">Domain Research</h3>
              <p className="text-base text-[#3A3A3A] font-sans leading-relaxed mb-6">
                Deep investigation into the Utilization Review workflow revealed how fragmented the current process truly is. UR nurses review medical necessity for prior authorization submissions to insurance payers. Current workflows require manual cross-referencing between 8+ tools per case. Regulatory context from FDA/ONC mandates explainable AI in clinical settings. Payer criteria follow InterQual/MCG guidelines, Medicare coverage rules, and CMS regulations.
              </p>
            </div>

            <div>
              <h3 className="text-lg text-[#1A1A1A] font-sans mb-4">User Research</h3>
              <p className="text-base text-[#3A3A3A] font-sans leading-relaxed mb-6">
                Three distinct user groups were identified through synthesized research, each with fundamentally different relationships to the decision-making process.
              </p>

              <div className="space-y-4">
                <UserCard
                  role="Primary: UR Nurses"
                  volume="80% of case volume"
                  jtbd="Prepare defensible PA cases quickly, identify gaps before submission"
                  pain="70% of time spent on 'data archaeology' -- finding information scattered across systems"
                  quote="I went to nursing school to care for patients, not to be a data archaeologist."
                />
                <UserCard
                  role="Secondary: Physicians"
                  volume="Escalations only (less than 20%)"
                  jtbd="Make final approval decisions on escalated cases"
                  pain="Receiving incomplete information from nurses, forcing complete chart re-reads"
                  quote="I don't trust the prep, so I re-read everything -- which defeats the purpose."
                />
                <UserCard
                  role="Tertiary: Medical Directors"
                  volume="Oversight only (less than 5%)"
                  jtbd="Ensure team consistency, defend decisions to payers and regulators"
                  pain="No visibility into team performance, audit trails don't exist"
                />
              </div>

              <Callout>
                The critical research finding: The person who prepares the decision (nurse) is more important than the person who approves it (physician) -- because bad preparation guarantees bad outcomes.
              </Callout>
            </div>

            <div>
              <h3 className="text-lg text-[#1A1A1A] font-sans mb-4">Competitive Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="border-b border-[#E8E5E0]">
                      <th className="text-left py-3 pr-4 text-[#9A9A9A] text-xs tracking-widest uppercase">Competitor</th>
                      <th className="text-left py-3 pr-4 text-[#9A9A9A] text-xs tracking-widest uppercase">What They Do</th>
                      <th className="text-left py-3 text-[#9A9A9A] text-xs tracking-widest uppercase">Gap Identified</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#3A3A3A]">
                    <tr className="border-b border-[#F2F0EB]"><td className="py-3 pr-4">Epic / Cerner / Oracle</td><td className="py-3 pr-4">Store clinical data</td><td className="py-3">Do not prepare decisions</td></tr>
                    <tr className="border-b border-[#F2F0EB]"><td className="py-3 pr-4">Cohere Health</td><td className="py-3 pr-4">Automate PA workflows</td><td className="py-3">Black box AI, no explainability</td></tr>
                    <tr className="border-b border-[#F2F0EB]"><td className="py-3 pr-4">Infinitus / Rhyme</td><td className="py-3 pr-4">Voice bots for PA calls</td><td className="py-3">Automation-focused, not governance</td></tr>
                    <tr><td className="py-3 pr-4">Pure GPT Wrappers</td><td className="py-3 pr-4">Summarize notes</td><td className="py-3">No policy validation, no audit trails</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-[#6B6B6B] font-sans">
                The competitive wedge: Decision readiness + explainability + auditability. Others optimize for speed. This product optimizes for defensibility.
              </p>
            </div>
          </div>
        </section>

        {/* ── Section 3: Navigating Ambiguity ── */}
        <section>
          <SectionLabel number="03" title="Navigating Ambiguity" />
          <div className="mt-8 space-y-6">
            <p className="text-lg text-[#3A3A3A] font-sans leading-relaxed">
              The design journey was defined by four types of ambiguity that blocked progress and ultimately led to the project's most important breakthroughs. Rather than treating ambiguity as a blocker, I learned to treat it as a signal -- a sign that the product definition needed refinement.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AmbiguityCard
                number="1"
                title="Product Definition"
                question="What category does this product belong to?"
                insight="Without product identity, every design decision became arbitrary. It felt like building a house without knowing if it should be a cabin, mansion, or apartment building."
              />
              <AmbiguityCard
                number="2"
                title="Role & Responsibility"
                question="Who prepares decisions versus who makes them?"
                insight="User roles determine information hierarchy. If physicians were primary, it's clinical decision support. If nurses are primary, it's a decision preparation tool. Completely different products."
              />
              <AmbiguityCard
                number="3"
                title="Workflow Ownership"
                question="Where does this product start and end?"
                insight="Starting with 'Home' means building a dashboard. Starting with 'Work Queue' means building an action-first tool. The first screen is a product philosophy decision, not a UX decision."
              />
              <AmbiguityCard
                number="4"
                title="AI Trust & Scope"
                question="How much authority should AI have in regulated healthcare?"
                insight="In healthcare, trust requires transparency. Black box AI -- even if accurate -- will not be adopted. But over-explaining slows workflows. The balance defines usability and regulatory viability."
              />
            </div>
          </div>
        </section>

        {/* ── Section 4: Mistakes Made ── */}
        <section>
          <SectionLabel number="04" title="Mistakes Made & Lessons Learned" />
          <div className="mt-8 space-y-6">
            <p className="text-lg text-[#3A3A3A] font-sans leading-relaxed">
              Honest documentation of failures was essential to the design process. Each mistake led directly to a breakthrough that shaped the final product.
            </p>

            <div className="space-y-4">
              <MistakeCard
                number="1"
                title="Assumed Physicians Were the Primary User"
                what="Early wireframes centered on a 'Physician Dashboard' with clinical decision support features."
                why="Physicians only engage with 20% of cases. Nurses prepare 80% of the workflow volume and carry denial accountability. Weeks of design work were wasted on a physician-first flow."
                lesson="Always ask 'Who carries the accountability risk?' That person is the primary user."
              />
              <MistakeCard
                number="2"
                title="Started with Home and Patients Screens"
                what="Designed a traditional dashboard with Home screen metrics, patient list, and individual detail pages."
                why="This copied the EHR information architecture that nurses already dislike. The user flow felt like 'searching for a needle in a haystack' instead of 'here is your next task.'"
                lesson="Default UX patterns (Home, Browse, Detail) are not universal. Match the mental model of the work, not the data structure."
              />
              <MistakeCard
                number="3"
                title="Treated CareLens as Optional"
                what="Positioned CareLens as a 'nice-to-have' collapsible sidebar that users could ignore."
                why="Without it, the product is just a summarization tool -- commoditized and easily replicated. Explainability is not a feature; it is the governance layer that makes AI decisions defensible."
                lesson="The thing that feels 'advanced' or 'extra' is often the core value proposition. Do not bury the moat."
              />
              <MistakeCard
                number="4"
                title="Overpromised Automation"
                what="Early pitch included phrases like 'AI auto-approves cases' and 'eliminates manual review.'"
                why="Nurses rejected this -- it felt like job replacement. Regulatory environments require human-in-the-loop. Payers will not accept 'AI said so' as justification."
                lesson="In regulated domains, position AI as copilot, not autopilot. 'We prepare decisions. You make them.'"
              />
              <MistakeCard
                number="5"
                title="Underestimated SDOH Complexity"
                what="Treated social determinants of health as a checkbox item: 'housing instability flagged.'"
                why="SDOH barriers often block medically necessary care and are decision blockers requiring proactive resolution. Missing SDOH context leads to high denial risk."
                lesson="Social context is clinical context in value-based care. Surface it early and make it immediately actionable."
              />
              <MistakeCard
                number="6"
                title="Built Screens Before Defining the Product"
                what="Jumped into high-fidelity mockups of 10+ screens before clarifying product identity."
                why="Without clarity on 'what is this?', every screen was a guess. This led to weeks of rework and incoherent user flows."
                lesson="Resist the urge to 'make it look good' before knowing what 'it' is. Definition first. Design second. Always."
              />
            </div>
          </div>
        </section>

        {/* ── Section 5: Key Breakthroughs ── */}
        <section>
          <SectionLabel number="05" title="Key Revelations & Breakthroughs" />
          <div className="mt-8 space-y-8">

            <div className="bg-[#1A1A1A] rounded-2xl p-8 text-[#FAFAF8]">
              <p className="text-xs tracking-widest uppercase text-[#9A9A9A] mb-3 font-sans">The defining breakthrough</p>
              <p className="text-2xl font-sans leading-relaxed text-balance">
                &ldquo;The product sits between raw clinical data and a final clinical decision.&rdquo;
              </p>
              <p className="mt-4 text-sm text-[#9A9A9A] font-sans leading-relaxed">
                This single sentence resolved all four ambiguities simultaneously. It defined the product as a decision-readiness platform, identified nurses as primary users, established the Work Queue as the entry point, and scoped AI to prepare context while humans decide.
              </p>
            </div>

            <div className="space-y-4">
              <RevelationCard
                title="Decision Readiness Is Not Data Access"
                description="EHRs already provide data access. The unmet need is decision-ready context: structured, validated, and explained. This shifted the pitch from 'AI summarization' to 'clinical decision intelligence' -- a fundamentally different category."
              />
              <RevelationCard
                title="Nurses Are Decision Stewards"
                description="Reframing nurses from 'users who enter data' to 'clinical decision stewards who carry the accountability weight' changed every design decision. Nurses gained full edit access to AI summaries, gap resolution became nurse-owned, and the UI communicates 'you are the expert; AI assists.'"
              />
              <RevelationCard
                title="Explainability Is Governance"
                description="CareLens is not a feature -- it is the regulatory compliance layer that makes AI decisions defensible. FDA/ONC require explainable AI. Payers challenge decisions months later. Trust requires confidence scores and reasoning traces that are always visible."
              />
              <RevelationCard
                title="Handoffs Are Invisible Work"
                description="Nurse-physician collaboration was happening in hallways and Slack -- completely undocumented, unscalable, and indefensible. This led to a formal handoff workflow with status-driven routing, simplified physician approval, and an audit trail logging every handoff."
              />
              <RevelationCard
                title="The Entry Point Defines Product Philosophy"
                description="Choosing 'Work Queue' vs. 'Home' vs. 'Patients' is not a UX decision -- it is a product philosophy declaration. Work Queue means 'I am here to complete tasks.' This aligned with the nurse mental model and led to removing the Home screen entirely."
              />
            </div>
          </div>
        </section>

        {/* ── Section 6: Design Evolution ── */}
        <section>
          <SectionLabel number="06" title="Design Evolution" />
          <div className="mt-8 space-y-8">
            <p className="text-lg text-[#3A3A3A] font-sans leading-relaxed">
              The product went through four major design iterations, each driven by a deeper understanding of the problem space. The journey from a physician-centric dashboard to a stage-based nurse workflow captures the entire learning arc.
            </p>

            <div className="space-y-4">
              <EvolutionCard
                version="V1"
                title="Physician-Centric Dashboard"
                status="Rejected"
                description="Home screen with KPIs, patient list sorted by admit date, and clinical decision support tools."
                failure="Built for the wrong primary user (physicians handle 20% of cases, nurses handle 80%). Dashboard mindset focused on analytics, not action."
              />
              <EvolutionCard
                version="V2"
                title="Patient-Centered EHR Clone"
                status="Rejected"
                description="Left sidebar with searchable patient list, main area with tabbed patient chart, AI summary at the bottom."
                failure="Replicated Epic's information architecture, which nurses already dislike. Focused on data access instead of decision readiness. CareLens was buried."
              />
              <EvolutionCard
                version="V3"
                title="Work Queue + Case-Centered"
                status="Refined"
                description="Entry point: work queue auto-sorted by AI urgency. Split-screen case detail with persistent CareLens sidebar."
                failure="Aligned with nurse mental model but had too many tabs causing cognitive overload. CareLens still felt secondary. No formalized handoff mechanism."
              />
              <EvolutionCard
                version="V4"
                title="Stage-Based Workflow"
                status="Current"
                description="Linear 7-stage progression from Work Queue through Case Detail, Policy Validation, CareLens, Gap Resolution, Physician Approval, and Submission Status."
                failure=""
              />
            </div>

            <div className="bg-[#F2F0EB] rounded-2xl p-8">
              <p className="text-sm tracking-widest uppercase text-[#9A9A9A] font-sans mb-4">Final Architecture: 7-Stage Workflow</p>
              <div className="space-y-3">
                {[
                  { stage: "1", name: "Work Queue", user: "All", purpose: "Auto-prioritized case list" },
                  { stage: "2", name: "Case Detail", user: "Nurse", purpose: "Clinical narrative review" },
                  { stage: "3", name: "Policy Validation", user: "Nurse", purpose: "Gap detection pre-submission" },
                  { stage: "4", name: "CareLens Panel", user: "All (persistent)", purpose: "Explainable AI insights" },
                  { stage: "5", name: "Gap Resolution", user: "Nurse", purpose: "AI-assisted justification" },
                  { stage: "6", name: "Physician Approval", user: "Physician", purpose: "Final clinical sign-off" },
                  { stage: "7", name: "Submission Status", user: "All", purpose: "PA tracking and appeals" },
                ].map((item) => (
                  <div key={item.stage} className="flex items-center gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1A1A1A] text-[#FAFAF8] text-xs flex items-center justify-center font-sans">{item.stage}</span>
                    <div className="flex-1 flex items-center justify-between bg-white rounded-lg px-4 py-3">
                      <div>
                        <span className="text-sm text-[#1A1A1A] font-sans">{item.name}</span>
                        <span className="text-xs text-[#9A9A9A] ml-3 font-sans">{item.user}</span>
                      </div>
                      <span className="text-xs text-[#6B6B6B] font-sans hidden md:block">{item.purpose}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 7: Strategic Decisions ── */}
        <section>
          <SectionLabel number="07" title="Strategic Decisions" />
          <div className="mt-8 space-y-4">
            {[
              {
                decision: "Nurses Are Primary, Physicians Are Secondary",
                rationale: "80% of workflow volume is nurse-driven. The UI was optimized for nurse speed (8-12 minutes per case target). Physician view was simplified to summary plus approve button only.",
              },
              {
                decision: "Work Queue Over Home Dashboard",
                rationale: "Nurses are task-oriented, not analytics-driven. 'What is next?' matters more than 'How are we doing?' The Home screen was removed entirely. Metrics live in the Director view.",
              },
              {
                decision: "CareLens as Persistent Sidebar",
                rationale: "Explainability is the competitive moat. The right sidebar is permanently reserved for CareLens (25% of screen width). Confidence scores are visible at every stage. Reasoning traces are always one click away.",
              },
              {
                decision: "AI Suggests, Humans Decide",
                rationale: "No auto-approve at any confidence level. Accept/Dismiss buttons appear on every recommendation. Low confidence (below 80%) triggers mandatory physician escalation.",
              },
              {
                decision: "Proactive Gap Resolution",
                rationale: "90% of denials stem from documentation gaps that exist before submission. Policy validation checklist with red/yellow/green status is visible pre-submission. 'Ready for PA' is disabled until all critical gaps resolve.",
              },
              {
                decision: "Audit Trail as Infrastructure",
                rationale: "Every action is logged with timestamps, user attribution, and immutability. Append-only database structure. Export capability built in for CMS audits, payer challenges, and legal defense.",
              },
            ].map((item, i) => (
              <div key={i} className="border border-[#E8E5E0] rounded-xl p-6 hover:border-[#D4D0C8] transition-colors">
                <h4 className="text-base text-[#1A1A1A] font-sans mb-2">{item.decision}</h4>
                <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed">{item.rationale}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 8: HCI Framework ── */}
        <section>
          <SectionLabel number="08" title="HCI Framework Application" />
          <div className="mt-8 space-y-8">

            <div>
              <h3 className="text-lg text-[#1A1A1A] font-sans mb-4">Liberatory Design Triangle</h3>
              <p className="text-base text-[#3A3A3A] font-sans leading-relaxed mb-6">
                The project sits at the intersection of Equity, Economy, and Ecology -- three domains where healthcare simultaneously fails.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#FEF3E7] rounded-xl p-6">
                  <p className="text-xs tracking-widest uppercase text-[#B8860B] mb-2 font-sans">Equity</p>
                  <p className="text-sm text-[#3A3A3A] font-sans leading-relaxed">UR nurses experience 40% burnout from processes that treat them as data clerks. Design preserves agency through edit access, identity-affirming language, and professional identity shift to &ldquo;clinical decision steward.&rdquo;</p>
                </div>
                <div className="bg-[#E8F5E9] rounded-xl p-6">
                  <p className="text-xs tracking-widest uppercase text-[#2E7D32] mb-2 font-sans">Economy</p>
                  <p className="text-sm text-[#3A3A3A] font-sans leading-relaxed">Hospitals lose $2.5M/year from preventable denials per facility. Proactive gap detection targets reducing denial rate from 30-40% to 5-10%, delivering a 4:1 ROI.</p>
                </div>
                <div className="bg-[#E3F2FD] rounded-xl p-6">
                  <p className="text-xs tracking-widest uppercase text-[#1565C0] mb-2 font-sans">Ecology</p>
                  <p className="text-sm text-[#3A3A3A] font-sans leading-relaxed">Clinical expertise is wasted on administrative tasks. 75% case prep time reduction frees capacity for patient care, enabling nurses to complete 2x cases per shift.</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg text-[#1A1A1A] font-sans mb-4">Experience Transformation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F2F0EB] rounded-xl p-6">
                  <p className="text-xs tracking-widest uppercase text-[#9A9A9A] mb-3 font-sans">Current emotional arc</p>
                  <div className="flex flex-wrap gap-2">
                    {["Anxious", "Frustrated", "Overwhelmed", "Blocked", "Rushed", "Defeated"].map((e) => (
                      <span key={e} className="text-xs bg-[#E8E5E0] text-[#6B6B6B] rounded-full px-3 py-1 font-sans">{e}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-[#E8F5E9] rounded-xl p-6">
                  <p className="text-xs tracking-widest uppercase text-[#2E7D32] mb-3 font-sans">Future emotional arc</p>
                  <div className="flex flex-wrap gap-2">
                    {["Confident", "Relieved", "Empowered", "Trusting", "Collaborative", "Accomplished"].map((e) => (
                      <span key={e} className="text-xs bg-[#C8E6C9] text-[#2E7D32] rounded-full px-3 py-1 font-sans">{e}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 9: Impact ── */}
        <section>
          <SectionLabel number="09" title="Projected Impact" />
          <div className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ImpactCard value="-75%" metric="Case prep time" detail="40 min to 8-12 min" />
              <ImpactCard value="-75%" metric="Denial rate" detail="30-40% to 5-10%" />
              <ImpactCard value="+108%" metric="Throughput" detail="8-12 to 20-25 cases/shift" />
              <ImpactCard value="$2.5M" metric="Revenue protected" detail="Per hospital annually" />
              <ImpactCard value="4:1" metric="Return on investment" detail="Every $1 saves $4" />
              <ImpactCard value="-87%" metric="Tools consolidated" detail="8+ tools to 1" />
            </div>
          </div>
        </section>

        {/* ── Section 10: Lessons Learned ── */}
        <section>
          <SectionLabel number="10" title="Lessons Learned" />
          <div className="mt-8 space-y-8">

            <div>
              <h3 className="text-sm tracking-widest uppercase text-[#9A9A9A] font-sans mb-4">On Design Process</h3>
              <div className="space-y-3">
                <LessonCard title="Ambiguity is a signal, not a blocker" description="Do not rush to resolution. The discomfort of 'I don't know' always precedes the breakthrough. Structured inquiry produces better outcomes than premature wireframes." />
                <LessonCard title="Product definition comes before design" description="Screens are outputs, not inputs. 'What is this?' must be answered before 'What does it look like?' One clear positioning statement can collapse multiple ambiguities simultaneously." />
                <LessonCard title="Users are not always who you assume" description="Question 'Who is the primary user?' relentlessly. Accountability risk identifies the real user more reliably than job title." />
              </div>
            </div>

            <div>
              <h3 className="text-sm tracking-widest uppercase text-[#9A9A9A] font-sans mb-4">On Strategy</h3>
              <div className="space-y-3">
                <LessonCard title="Category matters more than features" description="'Decision intelligence' is a fundamentally different category from 'UR automation.' Features are commoditized; categories are defensible." />
                <LessonCard title="ROI must be immediate and visible" description="Healthcare is risk-averse. Pilots must show value in the first shift, not the first quarter. A 75% time savings is undeniable." />
                <LessonCard title="Compliance is a competitive feature" description="Regulatory requirements (audit trails, explainability, HIPAA) are not overhead -- they are differentiation that protects against fast-follower competitors." />
              </div>
            </div>

            <div>
              <h3 className="text-sm tracking-widest uppercase text-[#9A9A9A] font-sans mb-4">On HCI</h3>
              <div className="space-y-3">
                <LessonCard title="Systemic thinking over surface solutions" description="Root causes matter more than symptoms. Pattern identification beats feature request lists." />
                <LessonCard title="Journey transformation over UI polish" description="The emotional arc from 'anxious to accomplished' is more powerful than pixel-perfect UI. Identity shift drives adoption more than any feature." />
                <LessonCard title="The entry point is a philosophy" description="The first screen the user sees is a declaration of what the product believes work is." />
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 11: Core Lesson ── */}
        <section className="pb-16">
          <div className="bg-[#1A1A1A] rounded-2xl p-10 md:p-14 text-center">
            <p className="text-xs tracking-widest uppercase text-[#9A9A9A] mb-6 font-sans">The Core Lesson</p>
            <p className="text-xl md:text-2xl text-[#FAFAF8] font-sans leading-relaxed max-w-2xl mx-auto text-balance">
              &ldquo;Ambiguity is not a problem to avoid -- it is a signal to refine product definition. Strategic design thinking means asking &lsquo;What is this?&rsquo; before &lsquo;What does it look like?&rsquo; The discomfort of not knowing always precedes the clarity that creates new categories.&rdquo;
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E5E0] py-8">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-[#9A9A9A] font-sans">
          <span>CareSummarizer + CareLens Case Study</span>
          <span>In Progress -- Portfolio & Demo Ready</span>
        </div>
      </footer>
    </div>
  )
}

/* ── Reusable Components ── */

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs text-[#9A9A9A] font-sans tabular-nums">{number}</span>
      <div className="h-px flex-1 bg-[#E8E5E0]" />
      <h2 className="text-2xl text-[#1A1A1A] font-sans">{title}</h2>
    </div>
  )
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-white rounded-xl p-5">
      <p className="text-2xl text-[#1A1A1A] font-sans mb-1">{value}</p>
      <p className="text-xs text-[#6B6B6B] font-sans leading-relaxed">{label}</p>
    </div>
  )
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-[#1A1A1A] pl-6 py-2 mt-6">
      <p className="text-base text-[#3A3A3A] font-sans leading-relaxed italic">{children}</p>
    </div>
  )
}

function UserCard({ role, volume, jtbd, pain, quote }: { role: string; volume: string; jtbd: string; pain: string; quote?: string }) {
  return (
    <div className="border border-[#E8E5E0] rounded-xl p-6">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-base text-[#1A1A1A] font-sans">{role}</h4>
        <span className="text-xs text-[#9A9A9A] font-sans">{volume}</span>
      </div>
      <p className="text-sm text-[#6B6B6B] font-sans mb-1"><span className="text-[#9A9A9A]">JTBD:</span> {jtbd}</p>
      <p className="text-sm text-[#6B6B6B] font-sans mb-2"><span className="text-[#9A9A9A]">Pain:</span> {pain}</p>
      {quote && (
        <p className="text-sm text-[#3A3A3A] font-sans italic border-t border-[#F2F0EB] pt-3 mt-3">&ldquo;{quote}&rdquo;</p>
      )}
    </div>
  )
}

function AmbiguityCard({ number, title, question, insight }: { number: string; title: string; question: string; insight: string }) {
  return (
    <div className="bg-[#F2F0EB] rounded-xl p-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-[#FAFAF8] text-xs flex items-center justify-center font-sans">{number}</span>
        <h4 className="text-base text-[#1A1A1A] font-sans">{title}</h4>
      </div>
      <p className="text-sm text-[#3A3A3A] font-sans italic mb-3">&ldquo;{question}&rdquo;</p>
      <p className="text-xs text-[#6B6B6B] font-sans leading-relaxed">{insight}</p>
    </div>
  )
}

function MistakeCard({ number, title, what, why, lesson }: { number: string; title: string; what: string; why: string; lesson: string }) {
  return (
    <div className="border border-[#E8E5E0] rounded-xl p-6 space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-xs text-[#9A9A9A] font-sans tabular-nums">Mistake {number}</span>
        <h4 className="text-base text-[#1A1A1A] font-sans">{title}</h4>
      </div>
      <div className="space-y-2 text-sm font-sans">
        <p className="text-[#6B6B6B]"><span className="text-[#9A9A9A]">What I did:</span> {what}</p>
        <p className="text-[#6B6B6B]"><span className="text-[#9A9A9A]">Why it was wrong:</span> {why}</p>
        <div className="bg-[#F2F0EB] rounded-lg px-4 py-3 mt-2">
          <p className="text-[#3A3A3A] text-xs"><span className="text-[#9A9A9A]">Lesson:</span> {lesson}</p>
        </div>
      </div>
    </div>
  )
}

function RevelationCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-[#E8E5E0] rounded-xl p-6 hover:border-[#D4D0C8] transition-colors">
      <h4 className="text-base text-[#1A1A1A] font-sans mb-2">{title}</h4>
      <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed">{description}</p>
    </div>
  )
}

function EvolutionCard({ version, title, status, description, failure }: { version: string; title: string; status: string; description: string; failure: string }) {
  const statusColor = status === "Rejected" ? "bg-[#FEE2E2] text-[#B91C1C]" : status === "Refined" ? "bg-[#FEF3E7] text-[#B8860B]" : "bg-[#E8F5E9] text-[#2E7D32]"
  return (
    <div className="border border-[#E8E5E0] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-[#9A9A9A] font-sans">{version}</span>
        <h4 className="text-base text-[#1A1A1A] font-sans flex-1">{title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full font-sans ${statusColor}`}>{status}</span>
      </div>
      <p className="text-sm text-[#6B6B6B] font-sans leading-relaxed mb-2">{description}</p>
      {failure && <p className="text-xs text-[#9A9A9A] font-sans leading-relaxed">{failure}</p>}
    </div>
  )
}

function ImpactCard({ value, metric, detail }: { value: string; metric: string; detail: string }) {
  return (
    <div className="bg-[#F2F0EB] rounded-xl p-6 text-center">
      <p className="text-3xl text-[#1A1A1A] font-sans mb-1">{value}</p>
      <p className="text-sm text-[#3A3A3A] font-sans">{metric}</p>
      <p className="text-xs text-[#9A9A9A] font-sans mt-1">{detail}</p>
    </div>
  )
}

function LessonCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-[#F2F0EB] rounded-xl px-5 py-4">
      <p className="text-sm text-[#1A1A1A] font-sans mb-1">{title}</p>
      <p className="text-xs text-[#6B6B6B] font-sans leading-relaxed">{description}</p>
    </div>
  )
}
