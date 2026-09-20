import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Calendar,
  Terminal,
  Layers,
  Mic,
  Zap,
  RefreshCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
  Play,
  Star,
  Sparkles,
  Timer,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { decorateUrlWithUtms, trackEvent } from "../lib/analytics"
import { usePageSeo } from "@/hooks/usePageSeo"

interface HomePageProps {
  onOpenWaitlist?: () => void
}

type StudioTab = "pacing" | "dsa" | "system-design" | "behavioral"

export const HomePage: React.FC<HomePageProps> = () => {
  usePageSeo({
    title: "PrepVisor | AI Tech Interview Coach, System Design Simulator & DSA Arena",
    description: "Master tech interviews with dynamic AI pacing (7–60 days). Practice DSA with live terminal stdout, design architectures on an interactive whiteboard with scale math, and ace voice mock interviews with STAR scoring.",
    canonicalUrl: "https://prepvisor.in/",
    keywords: "AI tech interview coach, system design interview simulator, DSA coding practice terminal stdout, voice mock interview STAR method, tech interview study roadmap, Java interview prep, software engineer mock interview, PrepVisor",
  })

  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>("pacing")
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const scrollToWorkbench = () => {
    const el = document.getElementById("workbench")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  const faqs = [
    {
      q: "How does PrepVisor differ from grinding LeetCode?",
      a: "LeetCode provides an unorganized catalog of 3,000+ isolated algorithm puzzles with zero time calibration, no system design whiteboard, and no voice behavioral coaching. PrepVisor is a structured workbench: it calibrates a daily preparation plan according to your exact target interview date (7 to 60+ days), provides an infinite architecture canvas with real-time scale math, runs your code with a live terminal stdout console in 9 languages, and conducts voice mock interviews evaluated against the STAR method.",
    },
    {
      q: "Can I write and test code in Java and other modern stacks?",
      a: "Yes. PrepVisor supports Java as a primary first-class default (with modern Records, Virtual Threads, and Stream APIs), alongside Python 3.12, C++ 20, TypeScript, Go, and Rust. Every problem is evaluated by an intelligent execution runner with a dedicated Live Terminal Console that prints your stdout statements (System.out.println, print(), console.log()) in real time alongside automated test case verdicts and Big-O algorithmic complexity scoring.",
    },
    {
      q: "What happens if I miss a day or fall behind my preparation schedule?",
      a: "PrepVisor includes a 1-click 'Rebalance Schedule' engine. When life gets busy, the scheduler recalculates your remaining days and smoothly redistributes overdue tasks across future sessions—ensuring you stay on track without burning out or feeling overwhelmed.",
    },
    {
      q: "How does the System Design Whiteboard evaluate candidate architectures?",
      a: "The studio features an infinite drag-and-drop cloud canvas. Candidates place and connect microservices, load balancers, databases, caches, and event streams using protocols like gRPC, REST, and TCP. An integrated calculator computes Read/Write QPS and 5-year persistent storage in real time, and on submission, an AI Principal Architect highlights single points of failure (SPOFs) and bottleneck trade-offs.",
    },
    {
      q: "How does the AI evaluate voice behavioral answers?",
      a: "PrepVisor evaluates responses using the proven STAR framework (Situation, Task, Action, Result). Built-in Speech-to-Text captures your verbal articulation naturally. The AI analyzes leadership ownership ratio ('I' vs 'we' statements), quantifiable metric density, technical depth, and tracks improvement across 10 longitudinal competency dimensions.",
    },
    {
      q: "Can I prepare for senior roles (SDE-2, SDE-3, Tech Lead)?",
      a: "Yes. PrepVisor adapts curriculum depth based on your target seniority. Senior tracks focus heavily on distributed systems trade-offs (Saga pattern, consensus, replication lag, SPOF mitigation), staff-level behavioral leadership, and cross-functional dispute resolution.",
    },
    {
      q: "How does the Timed Technical Assessment & AI Evaluation work?",
      a: "PrepVisor provides timed technical assessments simulating real company online assessments (OAs). You solve coding and system architecture challenges under a live countdown timer with anti-cheat integrity monitoring. Upon submission, our AI engine immediately generates an in-depth evaluation report with an overall readiness score (0–100), skill-by-skill proficiency bars, identified strengths, and prioritized weak spots to incorporate directly into your roadmap.",
    },
    {
      q: "Can I try PrepVisor for free before purchasing a pass?",
      a: "Yes. The Free Forever plan gives you immediate access to generate your preparation roadmap, complete 1 technical diagnostic assessment, conduct 3 multi-turn AI mock interviews, and solve curated free sample challenges (Two Sum in the DSA studio and Design TinyURL on the system design whiteboard) with zero credit card required.",
    },
    {
      q: "Are the paid plans recurring subscriptions or one-time prepaid passes?",
      a: "All PrepVisor paid plans are 100% prepaid, one-time digital access passes for the specific duration selected (7, 14, 30, or 90 days). There are zero automatic renewals, zero recurring debits, and zero hidden charges.",
    },
  ]

  return (
    <div className="flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-32 text-center bg-dot-grid">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] glow-blue pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <span>The Technical Interview Workbench</span>
          </div>

          {/* Main Title */}
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.08]">
            Engineered for the{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              final round.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-slate-600 font-normal">
            PrepVisor organizes your preparation around your target role and interview date. Practice DSA with a live terminal stdout console, design distributed systems with real-time scale math, and master behavioral rounds with voice AI.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row items-center pt-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "hero_get_roadmap", location: "hero" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] w-full sm:w-auto"
            >
              <span>Get Your Free Interview Roadmap →</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={scrollToWorkbench}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 w-full sm:w-auto shadow-xs"
            >
              <span>Watch It Work ↓</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Trust Micro-Copy */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <span>✓ No credit card required</span>
            <span className="text-slate-300">•</span>
            <span>✓ Free tier: 3 mock interviews</span>
            <span className="text-slate-300">•</span>
            <span>✓ Instant electronic access</span>
          </div>

          {/* Micro Telemetry Bar */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-slate-500">
            <span>Java · Python · C++</span>
            <span className="text-slate-300">•</span>
            <span>Cloud Architecture Canvas</span>
            <span className="text-slate-300">•</span>
            <span>STAR Speech Engine</span>
            <span className="text-slate-300">•</span>
            <span>Adaptive 7–60d Pacing</span>
          </div>
        </div>

        {/* 2. HERO INTERACTIVE PRODUCT WORKBENCH (THE CENTERPIECE) */}
        <div id="workbench" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-14 relative z-10">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5 overflow-hidden">
            {/* Workbench Window Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-xs font-mono text-slate-600 ml-2 font-medium">prepvisor-workbench v2.4.0</span>
              </div>

              {/* Segmented Studio Switcher */}
              <div className="flex items-center gap-1 rounded-xl bg-slate-200/60 p-1 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveStudioTab("pacing")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeStudioTab === "pacing"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Daily Pacing
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStudioTab("dsa")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeStudioTab === "dsa"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Terminal className="h-3.5 w-3.5" />
                  DSA Arena
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStudioTab("system-design")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeStudioTab === "system-design"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  System Design
                </button>

                <button
                  type="button"
                  onClick={() => setActiveStudioTab("behavioral")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeStudioTab === "behavioral"
                      ? "bg-white text-slate-900 shadow-xs font-semibold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Mic className="h-3.5 w-3.5" />
                  Voice Mock
                </button>
              </div>
            </div>

            {/* Workbench Surface 1: Daily Mission Control */}
            {activeStudioTab === "pacing" && (
              <div className="p-6 sm:p-8 space-y-6 text-left bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-semibold">Mission Control Schedule</span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-0.5">Day 4 of 14 · Sprint Preparation Track</h3>
                    <p className="text-xs text-slate-600">Target Role: Senior Backend Engineer (Java / Distributed Systems) · 2.0 hrs/day</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-mono text-emerald-700 border border-emerald-200 font-medium">
                      28% Syllabus Mastered
                    </span>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition shadow-xs"
                    >
                      <RefreshCw className="h-3.5 w-3.5 text-blue-600" />
                      Rebalance Schedule
                    </button>
                  </div>
                </div>

                {/* Day Tasks List */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: "Two Sum & Two-Pointer Patterns",
                      type: "DSA Coding Studio",
                      duration: "45 mins",
                      status: "Completed",
                      badgeColor: "text-emerald-700 bg-emerald-50 border-emerald-200",
                    },
                    {
                      title: "API Rate Limiter (Token Bucket)",
                      type: "System Design Canvas",
                      duration: "45 mins",
                      status: "In Progress",
                      badgeColor: "text-blue-700 bg-blue-50 border-blue-200",
                    },
                    {
                      title: "Explain High Latency Incident",
                      type: "Voice STAR Mock",
                      duration: "20 mins",
                      status: "Pending",
                      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
                    },
                    {
                      title: "Java Virtual Threads Internals",
                      type: "Concept Deep-Dive",
                      duration: "10 mins",
                      status: "Pending",
                      badgeColor: "text-slate-700 bg-slate-100 border-slate-200",
                    },
                  ].map((task) => (
                    <div key={task.title} className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2 hover:border-slate-300 transition">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-medium ${task.badgeColor}`}>
                          {task.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">{task.duration}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 leading-snug">{task.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">{task.type}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between rounded-xl bg-blue-50/60 p-4 border border-blue-200/60 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>
                      <strong className="text-slate-900">Dynamic Schedule Rebalance:</strong> Missed a day? 1 click redistributes pending tasks across your remaining days without cognitive overload.
                    </span>
                  </div>
                  <a
                    href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)}
                    className="font-semibold text-blue-600 hover:text-blue-700 shrink-0 ml-4 flex items-center gap-1"
                  >
                    Generate Your Roadmap <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Workbench Surface 2: DSA Coding Arena */}
            {activeStudioTab === "dsa" && (
              <div className="p-6 text-left space-y-4 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                    <span>src</span>
                    <span>/</span>
                    <span>solutions</span>
                    <span>/</span>
                    <span className="text-slate-900 font-semibold">LRUCache.java</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-mono text-emerald-700 border border-emerald-200 font-medium">
                      Time: O(1) · Aux Space: O(Capacity)
                    </span>
                    <span className="rounded bg-blue-600 px-3 py-1 text-xs font-semibold text-white flex items-center gap-1 shadow-xs">
                      <Play className="h-3 w-3 fill-white" /> Run Tests
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-12 font-mono text-xs">
                  {/* Cloud IDE Studio Mockup (Gold-standard dark IDE inside light window) */}
                  <div className="lg:col-span-7 bg-[#0b0f19] p-4 rounded-xl space-y-1 text-slate-200 border border-slate-800 overflow-x-auto shadow-inner">
                    <p className="text-slate-500">// LRU Cache with Sentinel Nodes and Live Print Debugging</p>
                    <p><span className="text-purple-400">public class</span> <span className="text-sky-300">LRUCache</span> {"{"}</p>
                    <p className="pl-4"><span className="text-purple-400">private final</span> Map&lt;Integer, Node&gt; cache = <span className="text-purple-400">new</span> HashMap&lt;&gt;();</p>
                    <p className="pl-4"><span className="text-purple-400">private final</span> Node head, tail;</p>
                    <p className="pl-4"><span className="text-purple-400">private final int</span> capacity;</p>
                    <p className="pl-4 mt-1"><span className="text-purple-400">public int</span> <span className="text-sky-300">get</span>(<span className="text-purple-400">int</span> key) {"{"}</p>
                    <p className="pl-8"><span className="text-purple-400">if</span> (!cache.containsKey(key)) <span className="text-purple-400">return</span> -1;</p>
                    <p className="pl-8">Node node = cache.get(key);</p>
                    <p className="pl-8 text-emerald-400">System.out.printf(<span className="text-amber-200">"[stdout] Cache HIT for key=%d, promoting to head%n"</span>, key);</p>
                    <p className="pl-8">moveToHead(node);</p>
                    <p className="pl-8"><span className="text-purple-400">return</span> node.value;</p>
                    <p className="pl-4">{"}"}</p>
                    <p>{"}"}</p>
                  </div>

                  {/* Terminal Console Output & Test Results */}
                  <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                    <div className="bg-[#0b0f19] p-4 rounded-xl space-y-2 border border-slate-800 shadow-inner">
                      <div className="flex items-center justify-between text-slate-300 border-b border-slate-800 pb-1.5">
                        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                          <Terminal className="h-3.5 w-3.5 text-emerald-400" /> Live Terminal Output (stdout)
                        </span>
                        <span className="text-[11px] text-emerald-400 font-bold">3/3 Passed (14ms)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-1 font-mono">
                        <p className="text-slate-500">[stdout] Cache HIT for key=1, promoting to head</p>
                        <p className="text-slate-500">[stdout] Evicted LRU tail node key=2 (capacity reached)</p>
                        <p className="text-emerald-400">✓ Test Case 1: put(1,1), put(2,2), get(1) → Expected: 1, Got: 1</p>
                        <p className="text-emerald-400">✓ Test Case 2: put(3,3), get(2) → Expected: -1, Got: -1</p>
                        <p className="text-emerald-400">✓ Test Case 3: get(3) → Expected: 3, Got: 3</p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-900">
                      <p className="font-semibold text-slate-900">Big-O Complexity Analysis:</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        Doubly Linked List with dummy head/tail sentinels guarantees strict <strong>O(1) Get and Put</strong> operations. Memory allocation: O(Capacity).
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Workbench Surface 3: System Design Canvas */}
            {activeStudioTab === "system-design" && (
              <div className="p-6 text-left space-y-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-blue-600 font-semibold">Architecture Topology Canvas</span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-0.5">Distributed API Rate Limiter Blueprint</h3>
                    <p className="text-xs text-slate-600">Multi-tier edge throttling with atomic Redis token bucket Lua scripts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-50 px-2.5 py-1 text-xs font-mono text-emerald-700 border border-emerald-200 font-medium">
                      SPOF Vulnerability: 0
                    </span>
                    <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-mono text-blue-700 border border-blue-200 font-medium">
                      Target: 100K QPS
                    </span>
                  </div>
                </div>

                {/* Topology Visualization */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-dot-grid-subtle">
                  <div className="rounded-xl bg-white border border-slate-200 p-3.5 text-center shadow-xs w-36">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Traffic Ingress</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">Cloudflare CDN</p>
                    <span className="text-[10px] text-emerald-600 font-mono font-medium">100K Ingress QPS</span>
                  </div>

                  <span className="text-slate-400 font-mono text-xs font-semibold">── HTTPS ──▶</span>

                  <div className="rounded-xl bg-white border border-blue-300 p-3.5 text-center shadow-xs w-36">
                    <span className="text-[10px] font-mono text-blue-600 uppercase font-semibold">Edge Gateway</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">Envoy Proxy</p>
                    <span className="text-[10px] text-blue-600 font-mono">Token Bucket Lua</span>
                  </div>

                  <span className="text-slate-400 font-mono text-xs font-semibold">── gRPC ──▶</span>

                  <div className="rounded-xl bg-white border border-rose-300 p-3.5 text-center shadow-xs w-36">
                    <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold">In-Memory Cache</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">Redis Cluster</p>
                    <span className="text-[10px] text-rose-600 font-mono">3 Replicas HA</span>
                  </div>

                  <span className="text-slate-400 font-mono text-xs font-semibold">── TCP ──▶</span>

                  <div className="rounded-xl bg-white border border-purple-300 p-3.5 text-center shadow-xs w-36">
                    <span className="text-[10px] font-mono text-purple-600 uppercase font-semibold">Primary Database</span>
                    <p className="text-xs font-bold text-slate-900 mt-0.5">PostgreSQL HA</p>
                    <span className="text-[10px] text-purple-600 font-mono">Read Replicas: 3</span>
                  </div>
                </div>

                {/* Scale HUD Metrics */}
                <div className="grid gap-3 sm:grid-cols-4 pt-1">
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                    <span className="text-[11px] font-mono text-slate-500 font-medium">Peak Read QPS</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">100,000 / sec</p>
                    <p className="text-[10px] text-slate-500">&lt; 15ms latency SLA</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                    <span className="text-[11px] font-mono text-slate-500 font-medium">5-Year Storage</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">14.6 Terabytes</p>
                    <p className="text-[10px] text-slate-500">Metadata + index overhead</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                    <span className="text-[11px] font-mono text-slate-500 font-medium">Redis RAM Cache</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">32 Gigabytes</p>
                    <p className="text-[10px] text-slate-500">80/20 Pareto distribution</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
                    <span className="text-[11px] font-mono text-slate-500 font-medium">Bandwidth Load</span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">1.2 Gbps</p>
                    <p className="text-[10px] text-slate-500">Multiplexed HTTP/2</p>
                  </div>
                </div>
              </div>
            )}

            {/* Workbench Surface 4: Voice Mock & STAR Coach */}
            {activeStudioTab === "behavioral" && (
              <div className="p-6 text-left space-y-6 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-wider text-purple-600 font-semibold">Voice AI Interviewer</span>
                    <h3 className="text-lg font-semibold text-slate-900 mt-0.5">STAR Behavioral Response Breakdown</h3>
                    <p className="text-xs text-slate-600">Scenario: "Describe a production outage where you led the remediation."</p>
                  </div>
                  <span className="rounded bg-purple-50 px-2.5 py-1 text-xs font-mono text-purple-700 border border-purple-200 font-semibold">
                    STAR Score: 92 / 100
                  </span>
                </div>

                <div className="grid gap-6 lg:grid-cols-12">
                  <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                      <Mic className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
                      <span className="font-mono text-[11px] text-slate-600">Candidate Spoken Transcript (Speech-to-Text Dictation)</span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-700 italic bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                      "During our peak checkout surge, our primary payment gateway experienced thread starvation, causing failed transactions for 14% of users. I initiated incident response, isolated the database lock using pg_stat_activity, shipped a connection pool hotfix within 18 minutes, and added circuit breakers that brought p99 latency back down to 95ms."
                    </p>
                    <div className="flex flex-wrap gap-2 text-[11px] pt-1">
                      <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-emerald-700 border border-emerald-200 font-medium">
                        ✓ Leadership Ownership ("I" statements identified)
                      </span>
                      <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-blue-700 border border-blue-200 font-medium">
                        ✓ Quantifiable Metrics (14% users, 18 mins, 95ms detected)
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3 font-mono text-xs">
                    <h4 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">STAR Dimension Analysis</h4>
                    {[
                      { label: "Situation (Context & Urgency)", score: 94 },
                      { label: "Task (Explicit Responsibility)", score: 88 },
                      { label: "Action (Technical Steps Taken)", score: 96 },
                      { label: "Result (Latency & Business Impact)", score: 90 },
                    ].map((dim) => (
                      <div key={dim.label} className="space-y-1">
                        <div className="flex justify-between text-[11px] text-slate-600">
                          <span>{dim.label}</span>
                          <span className="font-bold text-slate-900">{dim.score}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-600" style={{ width: `${dim.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. BENTO BOX FEATURE SPECIFICATIONS */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">The 4 Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Built for technical rigour, not memorization.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every tool in PrepVisor is engineered to reflect how candidates are actually evaluated in senior engineering loops.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Bento Card 1 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all">
              <div className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Calendar className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Time-Calibrated Pacing & 1-Click Rebalance</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether you have 7 days before an unexpected on-site or 60 days to prepare, your curriculum dynamically sizes your daily workload around your available hours. If you fall behind, 1 click redistributes tasks smoothly.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Day 1 Diagnostic Baseline to surface specific blind spots</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                  <span>Balanced daily mix of Algorithms, System Design, and Behavioral</span>
                </li>
              </ul>
            </div>

            {/* Bento Card 2 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all">
              <div className="h-9 w-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Terminal className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">DSA Coding Studio with Live Stdout in 9 Languages</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                VS Code-grade Cloud IDE featuring Java as primary default alongside Python, C++, and TypeScript. A live Console Output terminal captures print statements for fast debugging, with automated Big-O complexity scoring.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Print logs stream line-by-line without swallowed outputs</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>3-tier progressive hint engine to unstick algorithms independently</span>
                </li>
              </ul>
            </div>

            {/* Bento Card 3 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all">
              <div className="h-9 w-9 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">System Design Canvas with Real-Time Scale Math</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Connect microservices, load balancers, databases, and caches on an infinite cloud canvas. Back-of-the-envelope scale math automatically computes QPS, 5-year storage, and RAM requirements with automated AI SPOF evaluation on submission.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  <span>Interactive node snapping with protocol definitions (gRPC, REST, TCP)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                  <span>Automated single point of failure and bottleneck evaluation on submission</span>
                </li>
              </ul>
            </div>

            {/* Bento Card 4 */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all">
              <div className="h-9 w-9 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Mic className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Voice AI Mock Sessions with STAR Evaluation</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Practice speaking out loud naturally. Speech-to-Text transcribes your answers in real time and grades your leadership ownership ('I' vs 'we'), metric density, and depth across the proven STAR framework.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <span>Structured multi-turn question rounds with turn-by-turn STAR critique</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                  <span>Longitudinal tracking across 10 behavioral dimensions over time</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5 CANDIDATE STORIES & SOCIAL PROOF */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Candidate Stories</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              What engineers say after practicing
            </h2>
            <p className="text-sm text-slate-600">
              Engineers who switched from random problem grinding to structured, time-aware preparation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-slate-200 bg-[#fafbfc] hover:border-blue-300 hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "The daily pacing was the game-changer. Instead of drowning in 200 random LeetCode questions with 3 weeks left, PrepVisor gave me 2 focused hours each day. The schedule rebalance saved me when a production issue killed my weekend."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Rohit S.</h4>
                  <p className="text-[11px] text-slate-500">Senior Backend Engineer</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  Target: Tier-1 Fintech
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#fafbfc] hover:border-blue-300 hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "Most platforms ignore system design or just give you static diagrams. The cloud architecture whiteboard with live QPS, 5-year storage math, and automatic SPOF detection tested me the exact way Staff interviewers do. Absolutely worth it."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Ananya K.</h4>
                  <p className="text-[11px] text-slate-500">Staff Systems Architect</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  Target: Cloud Infrastructure
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-[#fafbfc] hover:border-blue-300 hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  "I kept getting rejected in behavioral rounds without knowing why. The AI voice mock picked up that I answered 80% with 'we' instead of taking ownership with 'I'. Practicing speaking out loud with STAR scoring fixed my delivery in 4 days."
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Karthik V.</h4>
                  <p className="text-[11px] text-slate-500">SDE-2 Full Stack</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                  Target: US Tech Remote
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE SPECIFICATION COMPARISON MATRIX */}
      <section className="py-24 bg-slate-50/50 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">The Comparison</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Why engineers choose PrepVisor
            </h2>
            <p className="text-sm text-slate-600">
              A transparent look at how PrepVisor stacks up against isolated puzzle platforms, chat bots, and bootcamps.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70">
                  <th className="p-4 font-semibold text-slate-700">Capability</th>
                  <th className="p-4 font-bold text-blue-700 bg-blue-50 border-x border-blue-200">PrepVisor</th>
                  <th className="p-4 font-medium text-slate-500">LeetCode</th>
                  <th className="p-4 font-medium text-slate-500">ChatGPT Plus</th>
                  <th className="p-4 font-medium text-slate-500">Pramp / Peer</th>
                  <th className="p-4 font-medium text-slate-500">Coding Bootcamps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  {
                    feature: "Time-Calibrated Pacing (7–60 Days)",
                    prepvisor: "Dynamic daily tasks based on interview date",
                    leetcode: "None (random grind)",
                    chatgpt: "Static text response",
                    pramp: "None (calendar barter)",
                    bootcamp: "Rigid 6-month batch",
                  },
                  {
                    feature: "Interactive System Design Canvas",
                    prepvisor: "Infinite cloud architecture canvas with scale math",
                    leetcode: "None",
                    chatgpt: "None (text only)",
                    pramp: "Basic textpad",
                    bootcamp: "Slide decks",
                  },
                  {
                    feature: "Live Terminal Stdout in 9 Languages",
                    prepvisor: "Full stdout console + Big-O analysis",
                    leetcode: "Limited test runner",
                    chatgpt: "Cannot run code",
                    pramp: "Shared textpad",
                    bootcamp: "Local terminal setup",
                  },
                  {
                    feature: "Voice Behavioral Mocks with STAR",
                    prepvisor: "Spoken audio with STAR metrics",
                    leetcode: "None",
                    chatgpt: "Voice mode without STAR grading",
                    pramp: "Uncalibrated peer mocks",
                    bootcamp: "1–2 scheduled peer mocks",
                  },
                  {
                    feature: "1-Click Schedule Rebalancing",
                    prepvisor: "Auto-redistributes missed tasks",
                    leetcode: "None",
                    chatgpt: "Manual re-prompting",
                    pramp: "None",
                    bootcamp: "Fall behind permanently",
                  },
                  {
                    feature: "Pricing Model",
                    prepvisor: "Free Tier · Passes from ₹199 (No Auto-Renew)",
                    leetcode: "$35/mo subscription",
                    chatgpt: "$20/mo subscription",
                    pramp: "Free / Limited",
                    bootcamp: "₹50,000 – ₹1,50,000 upfront",
                  },
                ].map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 font-sans text-xs text-slate-900 font-medium">{row.feature}</td>
                    <td className="p-4 text-xs font-semibold text-blue-900 bg-blue-50/30 border-x border-blue-200/60">{row.prepvisor}</td>
                    <td className="p-4 text-xs text-slate-500">{row.leetcode}</td>
                    <td className="p-4 text-xs text-slate-500">{row.chatgpt}</td>
                    <td className="p-4 text-xs text-slate-500">{row.pramp}</td>
                    <td className="p-4 text-xs text-slate-500">{row.bootcamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5. TARGET ROLE TRACKS */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Curriculum Tracks</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Engineered for your exact stack
            </h2>
            <p className="text-sm text-slate-600">
              Select your domain to calibrate problem difficulty and system design depth.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                role: "Backend Engineers",
                subtitle: "Java, Spring Boot, Go, Python",
                focus: ["JVM & Concurrency Internals", "Distributed Caching & Sharding", "Transactional Outbox & Saga", "STAR Production Outages"],
                badge: "High Demand",
              },
              {
                role: "Frontend Engineers",
                subtitle: "React, TypeScript, Next.js",
                focus: ["DOM Virtualization & Rendering", "Client Architecture & State", "Component Design Systems", "Web Performance & Core Vitals"],
                badge: "Popular",
              },
              {
                role: "Full-Stack Developers",
                subtitle: "End-to-End Product Engineering",
                focus: ["REST & GraphQL Contracts", "Relational Schema Modeling", "Authentication & JWT Security", "System Trade-off Communication"],
                badge: "Versatile",
              },
              {
                role: "Tech Leads & SDE-3",
                subtitle: "Staff & Engineering Managers",
                focus: ["High-Scale Architecture & SPOF", "Distributed Consensus & Raft", "Cross-Functional Leadership", "Capacity Math & Cost Sizing"],
                badge: "Senior",
              },
            ].map((persona) => (
              <div key={persona.role} className="rounded-2xl border border-slate-200 bg-slate-50/40 p-6 flex flex-col justify-between space-y-4 hover:border-blue-300 hover:bg-white hover:shadow-md transition">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                      {persona.badge}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{persona.role}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{persona.subtitle}</p>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
                    {persona.focus.map((f) => (
                      <li key={f} className="flex items-center gap-1.5">
                        <Check className="h-3 w-3 text-blue-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <a
                  href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-200"
                >
                  <span>Build Track Plan</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>

          {/* Generalized Multiple Roles & Custom Role Support Banner */}
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 via-blue-50/30 to-slate-50 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>Multiple Tech Roles Supported</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                  Looking for another role? Use our Custom Role option.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  These 4 tracks are just a starting point. PrepVisor supports <strong className="text-slate-900 font-semibold">24+ specialized tech roles</strong> across AI & Data Intelligence (AI Engineer, MLOps, Data Engineer), Cloud & DevOps (Cloud Architect, SRE, Platform), Mobile (iOS, Android), and Systems Engineering. You can also select the <strong className="text-slate-900 font-semibold">Custom Role</strong> option to specify your exact target role and generate an AI-calibrated preparation plan tailored specifically to you.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=curriculum_custom_role`)}
                  onClick={() => trackEvent("click_custom_role_track")}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Build Custom Role Plan</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <Link
                  to="/roadmap"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition"
                >
                  <span>Explore Roadmaps</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DIAGNOSTIC TECHNICAL ASSESSMENT & READINESS BENCHMARK */}
      <section className="py-24 bg-slate-50/60 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-semibold">
              Diagnostic Intelligence & Timed Assessments
            </span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Measure your readiness before interview day.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Start Day 1 with a timed technical assessment to uncover hidden blind spots, then track your 0–100 Interview Readiness Score with instant AI-generated scorecards.
            </p>
          </div>

          {/* Interactive AI Assessment Evaluation Showcase Frame */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Capability & Context */}
              <div className="lg:col-span-5 space-y-5 text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <Timer className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Timed OA Simulator & Instant AI Grading</span>
                </div>

                <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  Simulate real company online assessments under pressure.
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  Before candidates reach the onsite loop, companies screen them with 45–60 minute timed tests. PrepVisor replicates that exact environment with a countdown timer, question palette, and anti-cheat tab-switch tracking.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-700 pt-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 font-medium">Initial Baseline on Day 1</strong>: Uncovers your strongest topics and biggest blind spots before starting daily tasks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 font-medium">Multi-Skill Evaluations</strong>: Integrates coding challenges, schema design questions, and distributed systems checks.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900 font-medium">Instant Actionable Feedback</strong>: Detailed rubrics breakdown, optimal solutions, and targeted weaknesses automatically fed into your roadmap.</span>
                  </li>
                </ul>

                <div className="pt-2">
                  <a
                    href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=diagnostic_assessment`)}
                    onClick={() => trackEvent("landing_cta_clicked", { cta: "diagnostic_assessment_cta", location: "homepage_assessment_section" })}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Take Free Diagnostic Assessment</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Right Column: High-Fidelity AI Evaluation Report UI Mockup */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6 space-y-5 text-left shadow-inner">
                  {/* Top report header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-slate-900">Technical Diagnostic Evaluation</span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
                          Completed · 45 mins
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-mono">Candidate ID: PV-2026-9812 · Senior Backend Track</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-mono font-extrabold text-emerald-600">84<span className="text-xs font-sans text-slate-400 font-normal"> / 100</span></div>
                      <span className="text-[11px] font-mono text-emerald-700 font-medium">Interview-Ready Band</span>
                    </div>
                  </div>

                  {/* Skill Breakdown Bars */}
                  <div className="space-y-2.5">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                      Competency Breakdown
                    </div>
                    {[
                      { skill: "Data Structures & Big-O", score: 92, color: "bg-emerald-600" },
                      { skill: "System & Schema Design", score: 86, color: "bg-blue-600" },
                      { skill: "Edge Case & Fault Tolerance", score: 84, color: "bg-teal-600" },
                      { skill: "Java Concurrency & Threads", score: 74, color: "bg-amber-500" },
                    ].map((item) => (
                      <div key={item.skill} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-700 font-medium">{item.skill}</span>
                          <span className="font-mono text-slate-600 font-semibold">{item.score}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${item.color}`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* AI Strengths & Weaknesses Callout */}
                  <div className="grid gap-3 sm:grid-cols-2 pt-2">
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>AI Verified Strength</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Optimal O(N) auxiliary space logic with clean boundary condition handling.
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>Actionable Blind Spot</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Heavy synchronized locks detected under high write load; recommend ReentrantLock.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 text-left shadow-xs">
              <span className="text-3xl font-extrabold font-mono text-emerald-600">85+</span>
              <h3 className="text-sm font-semibold text-slate-900">Interview-Ready Benchmark</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Candidates scoring 85+ pass on-site technical rounds at 3.4x the industry average.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 text-left shadow-xs">
              <span className="text-3xl font-extrabold font-mono text-blue-600">10 Dims</span>
              <h3 className="text-sm font-semibold text-slate-900">Longitudinal Tracking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates algorithmic complexity, single points of failure, and STAR ownership over multiple practice sessions.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-2 text-left shadow-xs">
              <span className="text-3xl font-extrabold font-mono text-purple-600">0 Blind Spots</span>
              <h3 className="text-sm font-semibold text-slate-900">Targeted Weak Spot Alerts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Highlights your exact weak topics before sitting in front of real hiring managers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQS ACCORDION */}
      <section id="faq" className="py-24 bg-white border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600">
              Technical specifics about our studios, evaluation methodology, and plans.
            </p>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={faq.q} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-medium text-slate-900 hover:bg-slate-100/60 gap-4"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3 bg-white">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 8. HIGH-IMPACT BOTTOM CTA BANNER */}
      <section className="py-24 sm:py-32 text-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border-t border-slate-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] border border-white/[0.15] px-3 py-1 text-xs font-mono text-slate-200">
            <Zap className="h-3.5 w-3.5 text-blue-400" />
            Instant Digital Workbench
          </span>
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            Start preparing with clarity today.
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Create your personalized interview roadmap in 60 seconds with our free tier. Test your baseline skills in our DSA and System Design studios with zero credit card required.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "bottom_get_roadmap", location: "bottom_cta" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-sm hover:bg-slate-100 active:scale-[0.99] transition w-full sm:w-auto"
            >
              <span>Get Your Free Interview Roadmap →</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-7 py-3.5 text-xs sm:text-sm font-medium text-white hover:bg-white/[0.1] transition w-full sm:w-auto"
            >
              <span>View Passes (From ₹199)</span>
            </Link>
          </div>
          <p className="text-xs text-slate-400 font-mono pt-2">
            No credit card required · Free forever tier included · One-time prepaid passes · Zero recurring debits
          </p>
        </div>
      </section>
    </div>
  )
}

export default HomePage
