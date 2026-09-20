import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Code2,
  Layers,
  Mic,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  ListFilter,
  Bot,
  Zap,
  ShieldCheck,
  Cpu,
  Server,
  PlayCircle,
} from "lucide-react"
import { usePageSeo } from "@/hooks/usePageSeo"
import { COMPANY_CONFIG } from "@/config/company"
import { decorateUrlWithUtms, trackEvent } from "@/lib/analytics"

interface RoadmapPageProps {
  onOpenWaitlist?: () => void
}

type RoleId = "backend" | "frontend" | "fullstack" | "architect"
type AppViewMode = "timeline" | "syllabus" | "tasks"

interface RoleOption {
  id: RoleId
  name: string
  icon: typeof Server
  badge: string
  focusDescription: string
}

const TARGET_ROLES: RoleOption[] = [
  {
    id: "backend",
    name: "Backend Engineer",
    icon: Server,
    badge: "Java / Go / Python",
    focusDescription: "Concurrency, distributed databases, caching, and resilient APIs",
  },
  {
    id: "frontend",
    name: "Frontend Engineer",
    icon: Code2,
    badge: "React / TS / Web",
    focusDescription: "DOM rendering, state management, web vitals, and asset caching",
  },
  {
    id: "fullstack",
    name: "Full Stack Engineer",
    icon: Layers,
    badge: "Next.js / Node / SQL",
    focusDescription: "End-to-end features, DB indexing, REST/GraphQL APIs, and auth",
  },
  {
    id: "architect",
    name: "System Architect / Staff",
    icon: Cpu,
    badge: "Staff / L6+ Distributed",
    focusDescription: "Cross-region active-active, consensus protocols, SPOF resilience, and team leadership",
  },
]

export const RoadmapPage: React.FC<RoadmapPageProps> = () => {
  usePageSeo({
    title: "Time-Aware Tech Interview Roadmap & Daily Pacing | PrepVisor",
    description: "Calibrate your technical interview study schedule around your exact deadline, target role, and daily hours. Adaptive curriculum across DSA, System Design, and STAR behavioral mocks with 1-click schedule rebalancing.",
    canonicalUrl: "https://prepvisor.in/roadmap",
    keywords: "tech interview roadmap, daily pacing schedule, interview study planner, system design preparation timeline, leetcode study plan 30 days, java interview roadmap",
  })

  // State for interactive pacing calculator
  const [selectedRole, setSelectedRole] = useState<RoleId>("backend")
  const [selectedDays, setSelectedDays] = useState<number>(30)
  const [selectedHours, setSelectedHours] = useState<number>(2)
  const [activeAppView, setActiveAppView] = useState<AppViewMode>("timeline")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Interactive Rebalance Simulator State
  const [isRebalanced, setIsRebalanced] = useState(false)
  const [isRebalancing, setIsRebalancing] = useState(false)

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx)
  }

  const handleSimulateRebalance = () => {
    if (isRebalanced) {
      setIsRebalanced(false)
      return
    }
    setIsRebalancing(true)
    setTimeout(() => {
      setIsRebalancing(false)
      setIsRebalanced(true)
    }, 450)
  }

  // Calculated metrics
  const totalHours = selectedDays * selectedHours
  const estimatedTasksCount = Math.min(35, Math.max(7, Math.round(selectedDays * 0.8)))

  // Dynamically generate phased progression based on selectedDays and selectedRole
  const getPhases = (days: number, role: RoleId) => {
    if (days === 7) {
      return [
        {
          day: "Day 1",
          phase: "Baseline Diagnostic",
          tasks: [
            "45-minute multi-skill technical diagnostic evaluation",
            role === "frontend"
              ? "Benchmark React Fiber, Virtual DOM & CSS layout gaps"
              : role === "architect"
              ? "Benchmark distributed consistency & SPOF evaluation gaps"
              : "Identify core weakness gaps in Data Structures & Concurrency",
            "Generate calibrated knowledge competency graph",
          ],
          type: "diagnostic",
        },
        {
          day: "Days 2–3",
          phase: "High-Yield Core Drills",
          tasks: [
            role === "frontend"
              ? "Implement custom Promise.all, Debounce & Deep Clone in Cloud IDE"
              : role === "architect"
              ? "High-throughput messaging & ring buffer concurrency drills"
              : "Two Pointers, HashMaps & Sliding Window core pattern drills",
            "Real-time stdout debugging via Live Terminal Console",
            "Algorithmic Big-O time and space complexity scoring",
          ],
          type: "coding",
        },
        {
          day: "Days 4–5",
          phase: "Architecture Blueprint",
          tasks: [
            role === "frontend"
              ? "System Design: Virtualized Infinite Feed with image caching"
              : role === "architect"
              ? "System Design: Global Multi-Region Active-Active Sharding"
              : "System Design Whiteboard: Design a URL Shortener (TinyURL)",
            "Back-of-the-envelope capacity calculations (QPS & Storage)",
            "AI Principal Architect evaluation of SPOFs & bottleneck trade-offs",
          ],
          type: "design",
        },
        {
          day: "Day 6",
          phase: "AI Voice Mock Interview",
          tasks: [
            "45-minute spoken voice mock interview loop",
            "Real-time Speech-to-Text with STAR framework scoring",
            "Leadership ownership metric analysis ('I' vs 'We' ratio)",
          ],
          type: "mock",
        },
        {
          day: "Day 7",
          phase: "Sprint Polish & Readiness",
          tasks: [
            "Rapid review of high-yield algorithmic edge cases",
            "Company-specific interview cheat-sheet synthesis",
            "Final readiness verdict & confidence calibration",
          ],
          type: "final",
        },
      ]
    }

    if (days === 14) {
      return [
        {
          day: "Days 1–2",
          phase: "Diagnostic Benchmark",
          tasks: [
            "45-minute multi-skill technical diagnostic evaluation",
            role === "frontend"
              ? "Evaluate DOM API lifecycle, bundle optimization & React internals"
              : role === "architect"
              ? "Evaluate distributed consensus (Raft/Paxos) & caching strategies"
              : "Benchmark algorithms, memory model & multithreading fundamentals",
            "Synthesize individualized weakness roadmap for upcoming 12 days",
          ],
          type: "diagnostic",
        },
        {
          day: "Days 3–6",
          phase: "Core Algorithm Patterns",
          tasks: [
            role === "frontend"
              ? "Tree/DOM Traversals, Event Delegation & Async Generators"
              : "Binary Search, Heaps, Priority Queues & Graph Traversals (BFS/DFS)",
            "Practice in Java, Python, C++, or TypeScript Cloud IDE",
            "Terminal console stdout analysis for automated test suite feedback",
          ],
          type: "coding",
        },
        {
          day: "Days 7–9",
          phase: "Distributed Architecture",
          tasks: [
            role === "frontend"
              ? "System Design: Micro-frontends & Offline-First Data Sync"
              : role === "architect"
              ? "System Design: Distributed Lock Manager & Event-Driven Saga"
              : "System Design Whiteboard: Rate Limiter (Token Bucket vs Leaky Bucket)",
            "5-year persistent storage sizing & network bandwidth modeling",
            "Automated SPOF detection & latency budget calculations",
          ],
          type: "design",
        },
        {
          day: "Days 10–12",
          phase: "Voice Mock Interview Loops",
          tasks: [
            "Voice Mock Interview #1: Past Technical Project Deep Dive",
            "Voice Mock Interview #2: System Design & Failure Modes Walkthrough",
            "Quantifiable metric density and STAR framework coaching",
          ],
          type: "mock",
        },
        {
          day: "Days 13–14",
          phase: "Final Review & Hardening",
          tasks: [
            "Dynamic Programming memoization & recursive edge case polish",
            "Behavioral conflict resolution & technical disagreement framing",
            "Simulated full-loop technical interview with verdict rubric",
          ],
          type: "final",
        },
      ]
    }

    if (days === 60) {
      return [
        {
          day: "Days 1–5",
          phase: "Comprehensive Baseline",
          tasks: [
            "Full diagnostic evaluation across algorithms, architecture & behavioral",
            "Longitudinal competency baseline calibration across 10 dimensions",
            "Custom target company curriculum sequencing (FAANG / Unicorn tracks)",
          ],
          type: "diagnostic",
        },
        {
          day: "Days 6–20",
          phase: "Deep Algorithm Mastery",
          tasks: [
            role === "frontend"
              ? "Deep dive: React Fiber Reconciler, Canvas rendering & Web Workers"
              : role === "architect"
              ? "Lock-free algorithms, custom memory allocators & thread pools"
              : "Graphs (Dijkstra, Tarjan), Hard Dynamic Programming & Segment Trees",
            "Live stdout terminal debugging with custom test case builders",
            "Big-O algorithmic runtime profiling across high-input bounds",
          ],
          type: "coding",
        },
        {
          day: "Days 21–35",
          phase: "Large-Scale Architecture",
          tasks: [
            role === "frontend"
              ? "Design Figma-like real-time collaborative canvas (CRDTs/OT)"
              : "Design distributed log-structured storage engines (Kafka / LSM-Trees)",
            "Multi-datacenter replication lag mitigation & failover protocols",
            "Interactive whiteboard canvas with live cloud infrastructure math",
          ],
          type: "design",
        },
        {
          day: "Days 36–48",
          phase: "Longitudinal Mock Loops",
          tasks: [
            "4 complete multi-turn spoken voice mock interview sessions",
            "STAR leadership evaluation with quantifiable metric tracking",
            "Longitudinal progress curve tracking across verbal articulation",
          ],
          type: "mock",
        },
        {
          day: "Days 49–60",
          phase: "Staff-Level Readiness",
          tasks: [
            "Principal-level architectural tradeoffs (Cost vs Latency vs Durability)",
            "High-stakes behavioral simulations (Cross-functional conflict, executive presence)",
            "Full-loop dress rehearsal matching target company interview panel",
          ],
          type: "final",
        },
      ]
    }

    // Default 30-Day Pro
    return [
      {
        day: "Days 1–3",
        phase: "Baseline Diagnostic",
        tasks: [
          "45-minute multi-topic diagnostic assessment",
          role === "frontend"
            ? "Identify gaps in React Rendering, State Machine architecture & Web APIs"
            : role === "architect"
            ? "Identify gaps in Distributed Consensus, CAP Tradeoffs & Availability"
            : "Identify core weakness gaps in Data Structures & Concurrency",
          "Generate calibrated knowledge competency radar graph",
        ],
        type: "diagnostic",
      },
      {
        day: "Days 4–10",
        phase: "High-Frequency Algorithms",
        tasks: [
          role === "frontend"
            ? "Virtual DOM Diffing, Debounce/Throttle & LRU Cache in Cloud IDE"
            : role === "architect"
            ? "Ring buffers, thread pool executor sizing & JVM memory internals"
            : "Two Pointers, Sliding Window, Monotonic Stacks & Binary Search",
          "Console output debugging via live terminal stdout console",
          "Big-O algorithmic analysis and automated test case verdicts",
        ],
        type: "coding",
      },
      {
        day: "Days 11–18",
        phase: "Distributed Architecture",
        tasks: [
          role === "frontend"
            ? "System Design: Scalable Autocomplete & Real-Time Notification Feed"
            : role === "architect"
            ? "System Design: Distributed Database Partitioning & Raft Consensus"
            : "System Design Whiteboard: Design TinyURL & API Rate Limiter",
          "Back-of-the-envelope capacity calculations (Read/Write QPS, 5-Yr Storage)",
          "AI Principal Architect evaluation of SPOFs & bottleneck trade-offs",
        ],
        type: "design",
      },
      {
        day: "Days 19–25",
        phase: "STAR Voice Mocks",
        tasks: [
          "Voice Mock Interview #1: Past Project Architecture Deep Dive",
          "Voice Mock Interview #2: System Design Failure Scenarios & Edge Cases",
          "STAR framework evaluation (Situation, Task, Action, Result)",
          "Leadership ownership ratio analysis ('I' vs 'we' statements)",
        ],
        type: "mock",
      },
      {
        day: "Days 26–30",
        phase: "Final Readiness & Polishing",
        tasks: [
          "Dynamic Programming & Graph Traversals (BFS/DFS) edge cases",
          "Database replication lag, cache thundering herds & fallback strategies",
          "Full 60-minute simulated behavioral & technical loop",
        ],
        type: "final",
      },
    ]
  }

  const currentPhases = getPhases(selectedDays, selectedRole)
  const activeRoleObj = TARGET_ROLES.find((r) => r.id === selectedRole) || TARGET_ROLES[0]
  const remainingDays = Math.max(1, selectedDays - 6)

  const faqs = [
    {
      q: "How does PrepVisor determine what I should study each day?",
      a: "When you generate a preparation track in the app, PrepVisor takes your target role (Backend, Frontend, Full Stack, SDE-2/3, Staff Architect), your interview date, and your daily available hours. It sequences topics by foundational dependencies and algorithmic frequency, preventing you from wasting hours on low-yield puzzles.",
    },
    {
      q: "How does the 1-click Schedule Rebalancing engine work?",
      a: "Unlike static spreadsheets or rigid bootcamps, PrepVisor includes a 1-click Schedule Rebalance button available on all paid preparation passes. If you miss Day 6 due to production incidents or personal commitments, clicking Rebalance recalculates your remaining calendar days and evenly redistributes your incomplete tasks into future sessions—keeping your pacing realistic without cognitive guilt.",
    },
    {
      q: "What is included in the Free Forever tier vs Paid Preparation Passes?",
      a: "Our Free Forever tier includes 1 active personalized roadmap with a structured day-by-day task sequence, 3 full AI voice mock interviews, 1 technical diagnostic assessment, and foundational pacing with zero credit card required. Paid Preparation Passes (from ₹199) unlock dynamic 1-click schedule rebalancing, multiple simultaneous target role tracks, our interactive Cloud IDE stdout runner in 9 languages, the System Design whiteboard canvas, and up to 15+ voice mock interviews.",
    },
    {
      q: "Can I prepare on an intensive short timeline (7 to 14 days)?",
      a: "Yes. Our 7-Day Sprint and 14-Day Grind tracks dynamically compress the curriculum to focus strictly on highest-frequency tier-1 patterns, critical architecture blueprints (like Rate Limiter and TinyURL), and high-yield voice mock interviews to maximize interview readiness in high-pressure crunch periods.",
    },
    {
      q: "Does the curriculum adapt between Junior, Senior, and Staff roles?",
      a: "Yes. Early-career roles receive more DSA problem sets and syntax drills, while senior and staff roles emphasize distributed architecture blueprints, capacity estimation math, SPOF bottleneck detection, and STAR leadership ownership ratios.",
    },
  ]

  return (
    <div className="py-16 sm:py-24 bg-[#fafbfc] min-h-screen text-slate-900 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Ambient Hero Backdrop (Seamless Masked Dot Grid + Glow) */}
      <div className="absolute inset-x-0 top-0 h-[520px] bg-dot-grid hero-mask pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[520px] glow-blue pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Dynamic Daily Pacing Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.12]">
            Calibrated for your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
              interview date.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Stop grinding LeetCode blind. PrepVisor creates a personalized daily preparation curriculum tailored to your target date, available daily hours, and exact seniority level.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=roadmap_hero`)}
              onClick={() => trackEvent("roadmap_cta_clicked", { cta: "hero_start_free", location: "hero" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] w-full sm:w-auto"
            >
              <span>Get Your Free Interview Roadmap →</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition w-full sm:w-auto shadow-xs"
            >
              <span>View Passes (From ₹199)</span>
            </Link>
          </div>
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span>✓ No credit card required</span>
            <span>•</span>
            <span>✓ Free tier: 3 mock interviews</span>
            <span>•</span>
            <span>✓ Instant access</span>
          </div>
        </div>

        {/* Interactive Pacing Calculator Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg space-y-8">
          <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">Interactive Calibrator</span>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
                Simulate Your Study Curriculum
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Choose your target track, timeline, and daily commitment to preview your customized preparation sequence.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Real-Time Adaptation</span>
            </div>
          </div>

          {/* 1. Target Role Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
              <span className="flex items-center gap-1.5 uppercase font-mono tracking-wider text-slate-500">
                1. Select Target Track
              </span>
              <span className="text-blue-600 font-medium">{activeRoleObj.focusDescription}</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {TARGET_ROLES.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role.id)
                      trackEvent("roadmap_role_selected", { role: role.id })
                    }}
                    className={`p-3.5 rounded-xl text-left border transition flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                        {role.badge}
                      </span>
                    </div>
                    <div>
                      <p className={`text-xs font-bold leading-snug ${isSelected ? "text-blue-950" : "text-slate-900"}`}>
                        {role.name}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 2. Timeline & Commitment Selectors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-2">
            {/* Control Sliders & Pills */}
            <div className="space-y-6">
              {/* Timeline Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Interview Timeline
                  </span>
                  <span className="text-blue-600 font-mono font-bold">{selectedDays} Days</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { days: 7, label: "7 Days", sub: "Sprint" },
                    { days: 14, label: "14 Days", sub: "Grind" },
                    { days: 30, label: "30 Days", sub: "Pro" },
                    { days: 60, label: "60 Days", sub: "Mastery" },
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => {
                        setSelectedDays(item.days)
                        setIsRebalanced(false)
                        trackEvent("roadmap_days_selected", { days: item.days })
                      }}
                      className={`py-2.5 px-3 rounded-xl text-center border transition ${
                        selectedDays === item.days
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs ring-2 ring-blue-600/15"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs font-bold">{item.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Hours Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    Daily Commitment
                  </span>
                  <span className="text-indigo-600 font-mono font-bold">{selectedHours} hrs/day</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => {
                        setSelectedHours(hours)
                        trackEvent("roadmap_hours_selected", { hours })
                      }}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        selectedHours === hours
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs ring-2 ring-indigo-600/15"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {hours} {hours === 1 ? "hr" : "hrs"} / day
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Authentic Plan Generation Breakdown */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">Planned Capacity</span>
                  <p className="text-xl font-bold text-slate-900 mt-0.5">
                    {totalHours} Total Hours Budget
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full font-bold">
                    ~{estimatedTasksCount} Daily Milestones
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedDays} days × {selectedHours} hrs/day</p>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  What Your Generated Plan Includes:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Code2 className="h-4 w-4 text-blue-600" />
                      <span>Coding Practice Studio</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Topic-matched DSA challenges with starter boilerplate, test cases, and cloud terminal stdout.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Layers className="h-4 w-4 text-sky-600" />
                      <span>System Design Studio</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Distributed architecture case studies with scale math calculations and SPOF evaluation.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <BookOpen className="h-4 w-4 text-amber-600" />
                      <span>Core Topic Reviews</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Curated deep dives into high-yield fundamentals, concurrency patterns, and STAR storytelling.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-200 bg-white shadow-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                      <Mic className="h-4 w-4 text-purple-600" />
                      <span>AI Mock Interviews</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Realistic timed conversational mock rounds with live follow-up questions and audio scoring.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transparent Tier Note */}
          <div className="flex items-center gap-2 p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 text-xs text-slate-700">
            <Zap className="h-4 w-4 text-blue-600 shrink-0" />
            <span>
              <strong>Curriculum Tier Clarity:</strong> PrepVisor’s Free Tier provides 1 active roadmap with full daily task pacing, 3 voice mock interviews, and 1 diagnostic assessment. Prepaid passes (from ₹199) unlock extended mock interview quotas, unlimited cloud stdout execution, and 1-click dynamic schedule rebalancing.
            </span>
          </div>

          {/* Adaptive Phased Progression Breakdown */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Curated {selectedDays}-Day Progression: {activeRoleObj.name}
                </h3>
                <p className="text-xs text-slate-600">
                  Sequenced from foundational diagnostic benchmarks through multi-turn mock interviews.
                </p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 self-start sm:self-auto">
                {selectedDays} Days · {selectedHours} hrs/day · {totalHours}h Total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {currentPhases.map((item) => (
                <div
                  key={item.day}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-600">{item.day}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold truncate max-w-[110px]">
                        {item.phase}
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                      {item.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold shrink-0">•</span>
                          <span className="leading-snug">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-emerald-600 font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Auto-tracked</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">{item.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1-Click Rebalance Deep Dive (Interactive Simulator) */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white p-8 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-100/60 px-3 py-1 text-xs font-semibold text-blue-800">
              <RefreshCw className="h-3.5 w-3.5 text-blue-700" />
              <span>Zero-Guilt Adaptability</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Life happens. 1-Click Rebalancing keeps you on track.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When production incidents, work overtime, or family emergencies interrupt your schedule, rigid study plans crumble into guilt. On PrepVisor’s paid passes, simply tap <strong>Rebalance Schedule</strong>. Our algorithm recalculates your remaining calendar days and smoothly spreads incomplete tasks across upcoming sessions—ensuring you stay confident right until interview day.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Included on all paid preparation passes (7-Day Sprint, 14-Day Grind, 30-Day Pro).</span>
            </div>
          </div>

          {/* Interactive Rebalancing Simulation Card */}
          <div className="w-full lg:w-88 p-5 rounded-xl border border-slate-200 bg-white shadow-md space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-100 pb-2">
              <span className="text-slate-500">Simulation Widget</span>
              {isRebalanced ? (
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  On Track
                </span>
              ) : (
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-bold">
                  2 Tasks Overdue
                </span>
              )}
            </div>

            <div className="space-y-2 text-xs">
              {isRebalanced ? (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Redistribution Applied:</p>
                  <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span>• LRU Cache Implementation</span>
                      <span className="font-bold text-emerald-700">→ Day 7</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>• Token Bucket Review</span>
                      <span className="font-bold text-emerald-700">→ Day 8</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-semibold text-slate-800">Missed Day 6 Tasks:</p>
                  <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-1 font-mono text-[11px]">
                    <div>• LRU Cache Implementation</div>
                    <div>• Token Bucket Algorithm Review</div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleSimulateRebalance}
              disabled={isRebalancing}
              className={`w-full py-2.5 px-4 rounded-xl text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-[0.99] ${
                isRebalanced
                  ? "bg-slate-800 hover:bg-slate-900"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isRebalancing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Recalculating Schedule...</span>
                </>
              ) : isRebalanced ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Simulation</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Rebalance Remaining Days</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-center text-slate-500 leading-tight">
              {isRebalanced
                ? `Smoothly spread across your remaining ${remainingDays} days without increasing your daily commitment.`
                : `Click above to test redistributing tasks evenly across your remaining ${remainingDays} days.`}
            </p>
          </div>
        </div>

        {/* Real App Roadmap Interface Showcase */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
                <Layers className="h-3.5 w-3.5" />
                <span>In-App Workbench Experience</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 mt-1">
                Explore the 3 Core Views in PrepVisor
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Switch tabs below to preview how your roadmap presents in the actual preparation app.
              </p>
            </div>

            {/* App View Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveAppView("timeline")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 ${
                  activeAppView === "timeline"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                Day-by-Day Timeline
              </button>
              <button
                type="button"
                onClick={() => setActiveAppView("syllabus")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 ${
                  activeAppView === "syllabus"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                Topic Syllabus
              </button>
              <button
                type="button"
                onClick={() => setActiveAppView("tasks")}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition inline-flex items-center gap-1.5 ${
                  activeAppView === "tasks"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <ListFilter className="h-3.5 w-3.5" />
                Action Tasks
              </button>
            </div>
          </div>

          {/* Tab 1: Day-by-Day Timeline Showcase */}
          {activeAppView === "timeline" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Chronological Day Schedule ({selectedDays} Days)</span>
                <span className="font-mono text-blue-600 font-bold">Current: Day 2</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-700">Day 1</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      Completed
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Baseline Diagnostic Assessment</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    45-minute multi-topic evaluation. Evaluated baseline proficiency across DSA and Concurrency.
                  </p>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Score: 82%</span>
                    <span className="text-blue-600 font-semibold">View Rubric →</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-2 border-blue-600 bg-white shadow-md shadow-blue-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-600">Day 2 (Today)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold animate-pulse">
                      In Progress
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">LRU Cache Implementation</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Master Doubly Linked List + HashMap sentinel nodes with real-time stdout console in Java / Python.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Cloud IDE</span>
                    <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                      <PlayCircle className="h-3.5 w-3.5" />
                      Open Stdout Runner
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">Day 3 (Upcoming)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                      Scheduled
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">System Design: TinyURL Service</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Drag-and-drop architecture canvas, Base62 hashing, and 3.6TB persistent storage calculations.
                  </p>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Architecture Studio</span>
                    <span className="text-slate-700 font-medium">Launch Canvas</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Full Topic Syllabus Showcase */}
          {activeAppView === "syllabus" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-semibold text-slate-900">Curriculum Competency Breakdown</span>
                <span className="font-mono text-slate-500">4 Competencies · 28 Topics</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Code2 className="h-4 w-4" />
                    <span>Data Structures & Algorithms</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 font-mono text-[11px]">
                    <li className="flex items-center justify-between">• Sliding Window (Fixed & Dynamic) <span className="text-emerald-600">Done</span></li>
                    <li className="flex items-center justify-between">• Monotonic Stack & Queue <span className="text-blue-600">Today</span></li>
                    <li className="flex items-center justify-between">• Graph Traversals (BFS / DFS) <span className="text-slate-400">Day 8</span></li>
                  </ul>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-blue-600 font-semibold flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    <span>Ask AI Coach about Topics</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
                    <Layers className="h-4 w-4" />
                    <span>System Architecture & Scale</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 font-mono text-[11px]">
                    <li className="flex items-center justify-between">• Capacity Estimation Math <span className="text-slate-400">Day 4</span></li>
                    <li className="flex items-center justify-between">• Token Bucket Rate Limiter <span className="text-slate-400">Day 10</span></li>
                    <li className="flex items-center justify-between">• Kafka Event Streaming <span className="text-slate-400">Day 16</span></li>
                  </ul>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-sky-600 font-semibold flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    <span>Explore Whiteboard Blueprints</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700">
                    <Mic className="h-4 w-4" />
                    <span>STAR Behavioral & Leadership</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 font-mono text-[11px]">
                    <li className="flex items-center justify-between">• Technical Disagreement Framing <span className="text-slate-400">Day 6</span></li>
                    <li className="flex items-center justify-between">• Ambiguity & Trade-off Ownership <span className="text-slate-400">Day 12</span></li>
                    <li className="flex items-center justify-between">• Quantifiable Impact Articulation <span className="text-slate-400">Day 20</span></li>
                  </ul>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-purple-600 font-semibold flex items-center gap-1">
                    <Bot className="h-3 w-3" />
                    <span>Practice Spoken Voice Mocks</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Action Tasks & Filters Showcase */}
          {activeAppView === "tasks" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 p-0.5 rounded-lg border border-slate-200 bg-slate-50">
                  <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-semibold shadow-2xs">Pending (8)</span>
                  <span className="px-2.5 py-1 text-slate-600 font-medium">Completed (4)</span>
                  <span className="px-2.5 py-1 text-slate-600 font-medium">All (12)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span>Filtered: All Categories</span>
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { title: "Implement LRU Cache with Sentinel Nodes", type: "Coding Practice", time: "45 mins", day: "Day 2" },
                  { title: "Review Token Bucket vs Leaky Bucket Rate Limiting", type: "Topic Review", time: "30 mins", day: "Day 3" },
                  { title: "Whiteboard TinyURL Distributed URL Shortener", type: "System Design", time: "60 mins", day: "Day 4" },
                ].map((task, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between hover:border-slate-300 transition">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-blue-600">{task.day}</span>
                        <span className="text-xs font-semibold text-slate-900">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{task.type}</span>
                        <span>•</span>
                        <span>Est. {task.time}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                      <span>Start Task</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3 Studio Pillars Integration */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Unified Practice Studios Inside Your Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each daily task links directly into dedicated interactive environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">Coding Arena & Stdout</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Java, Python, and C++ Cloud IDE with live terminal stdout console and Big-O algorithmic complexity analysis.
              </p>
              <Link to="/coding-practice" className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline pt-1">
                Explore Coding Studio <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 border border-sky-200 text-sky-600">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">System Design Canvas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Infinite cloud whiteboard with drag-and-drop components, live QPS capacity math, storage sizing, and SPOF analysis.
              </p>
              <Link to="/system-design" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:underline pt-1">
                Explore System Design <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs hover:border-slate-300 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">AI Voice Mock Interview</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Spoken audio with real-time Speech-to-Text, STAR framework scoring, leadership ownership metrics, and adaptive follow-ups.
              </p>
              <Link to="/mock-interview" className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:underline pt-1">
                Explore Voice Mocks <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>Roadmap FAQs</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div key={index} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-medium text-slate-900 hover:bg-slate-50 gap-4"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3 bg-slate-50/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-blue-50 p-8 sm:p-12 text-center text-slate-900 space-y-5 shadow-xs relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-slate-900">
            Ready to calibrate your daily preparation?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Generate your personalized interview roadmap in 60 seconds with our Free Forever tier. Zero credit card required.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=roadmap_bottom`)}
              onClick={() => trackEvent("roadmap_cta_clicked", { cta: "bottom_start_free", location: "bottom_cta" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition active:scale-[0.99] w-full sm:w-auto"
            >
              <span>Start Free Preparation</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-7 py-3.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 transition w-full sm:w-auto shadow-xs"
            >
              <span>View Prep Passes (From ₹199)</span>
            </Link>
          </div>
          <p className="text-xs text-slate-500 font-mono">
            No auto-renewals · One-time prepaid passes · Instant access
          </p>
        </div>
      </div>
    </div>
  )
}

export default RoadmapPage
