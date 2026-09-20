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
} from "lucide-react"
import { usePageSeo } from "@/hooks/usePageSeo"
import { COMPANY_CONFIG } from "@/config/company"
import { decorateUrlWithUtms, trackEvent } from "@/lib/analytics"

interface RoadmapPageProps {
  onOpenWaitlist?: () => void
}

export const RoadmapPage: React.FC<RoadmapPageProps> = () => {
  usePageSeo({
    title: "Time-Aware Tech Interview Roadmap & Daily Pacing | PrepVisor",
    description: "Calibrate your technical interview study schedule around your exact deadline and daily hours. Adaptive curriculum across DSA, System Design, and STAR behavioral mocks with 1-click schedule rebalancing.",
    canonicalUrl: "https://prepvisor.in/roadmap",
    keywords: "tech interview roadmap, daily pacing schedule, interview study planner, system design preparation timeline, leetcode study plan 30 days, java interview roadmap",
  })

  // State for interactive pacing calculator
  const [selectedDays, setSelectedDays] = useState<number>(30)
  const [selectedHours, setSelectedHours] = useState<number>(2)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx)
  }

  // Calculated metrics
  const totalHours = selectedDays * selectedHours
  const dsaProblems = Math.round(totalHours * 0.9)
  const systemDesignStudies = Math.max(3, Math.round(selectedDays / 4))
  const mockInterviews = Math.max(2, Math.round(selectedDays / 5))

  const sampleDays = [
    {
      day: "Day 1",
      phase: "Baseline Diagnostic",
      tasks: [
        "Take 45-minute multi-topic diagnostic assessment",
        "Identify core weakness gaps in Data Structures & Concurrency",
        "Generate calibrated knowledge competency graph",
      ],
      type: "diagnostic",
    },
    {
      day: "Day 2–7",
      phase: "High-Frequency Algorithms",
      tasks: [
        "Two Pointers & Sliding Window core drills (Cloud IDE)",
        "HashMaps & Two-Sum pattern variants with Big-O feedback",
        "Console output debugging via live terminal stdout",
      ],
      type: "coding",
    },
    {
      day: "Day 8–14",
      phase: "Distributed Systems & Trees",
      tasks: [
        "Binary Search Trees, Heaps & Priority Queues",
        "System Design Whiteboard: Design a URL Shortener (TinyURL)",
        "Back-of-the-envelope capacity calculations (QPS, 5-Yr Storage)",
      ],
      type: "design",
    },
    {
      day: "Day 15–22",
      phase: "Architecture Scaling & STAR Mocks",
      tasks: [
        "Rate Limiter design (Token Bucket vs Leaky Bucket in Redis)",
        "Voice Mock Interview #1: Past Project Architecture Deep Dive",
        "STAR framework evaluation (Situation, Task, Action, Result)",
      ],
      type: "mock",
    },
    {
      day: "Day 23–30",
      phase: "Final Round Readiness & Polishing",
      tasks: [
        "Dynamic Programming & Graph Traversals (BFS/DFS)",
        "SPOF detection & Database Replication Lag mitigation",
        "Full 60-minute simulated behavioral & technical loop",
      ],
      type: "final",
    },
  ]

  const faqs = [
    {
      q: "How does PrepVisor determine what I should study each day?",
      a: "When you set up a preparation track, PrepVisor takes your target role (Frontend, Backend, Full Stack, SDE-2, SDE-3), your interview date, and your daily available hours. It sequences topics by foundational dependencies and algorithmic frequency, preventing you from wasting hours on low-yield puzzles.",
    },
    {
      q: "What happens if I miss a day due to work or personal commitments?",
      a: "Unlike static spreadsheets or rigid bootcamps, PrepVisor features a 1-click Schedule Rebalance button. If you fall behind on Day 5, clicking rebalance recalculates your remaining calendar days and evenly redistributes your incomplete tasks without overwhelming your daily quota.",
    },
    {
      q: "Can I prepare on a short timeline (7 to 14 days)?",
      a: "Yes. Our 7-Day Sprint and 14-Day Grind tracks focus strictly on highest-frequency tier-1 patterns, critical system design trade-offs, and voice behavioral simulations to maximize readiness in high-pressure crunch periods.",
    },
    {
      q: "Is the curriculum balanced across coding, system design, and behavioral?",
      a: "Yes. Every roadmap balances your time based on your target seniority. Junior roles receive more DSA problem sets, while senior and staff roles prioritize distributed architecture blueprints, capacity estimation, and STAR leadership ownership ratios.",
    },
  ]

  return (
    <div className="py-16 sm:py-24 bg-[#fafbfc] min-h-screen text-slate-900 bg-dot-grid relative selection:bg-blue-600 selection:text-white">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] glow-blue pointer-events-none opacity-40" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 shadow-xs">
            <Calendar className="h-3.5 w-3.5 text-blue-600" />
            <span>Dynamic Daily Pacing Engine</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.1]">
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
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              <span>Real-Time Adaptation</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Control Sliders & Pills */}
            <div className="space-y-6">
              {/* Timeline Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Interview Timeline
                  </span>
                  <span className="text-blue-600 font-mono">{selectedDays} Days</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[7, 14, 30, 60].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setSelectedDays(days)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        selectedDays === days
                          ? "border-blue-600 bg-blue-50 text-blue-700 shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {days} Days
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
                  <span className="text-indigo-600 font-mono">{selectedHours} hrs/day</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setSelectedHours(hours)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition ${
                        selectedHours === hours
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {hours} {hours === 1 ? "hr" : "hrs"} / day
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Output HUD */}
            <div className="grid grid-cols-2 gap-3 p-5 rounded-xl border border-slate-200 bg-slate-50/70">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <p className="text-xs text-slate-500 font-medium">Total Study Time</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalHours} Hours</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Across {selectedDays} calendar days</p>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 shadow-xs">
                <p className="text-xs text-blue-700 font-medium">DSA Coding Arena</p>
                <p className="text-2xl font-bold text-blue-900 mt-1">{dsaProblems} Problems</p>
                <p className="text-[11px] text-blue-600 mt-0.5">With terminal stdout & Big-O</p>
              </div>

              <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 shadow-xs">
                <p className="text-xs text-sky-700 font-medium">System Design Blueprints</p>
                <p className="text-2xl font-bold text-sky-900 mt-1">{systemDesignStudies} Blueprints</p>
                <p className="text-[11px] text-sky-600 mt-0.5">Scale math & SPOF evaluation</p>
              </div>

              <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 shadow-xs">
                <p className="text-xs text-purple-700 font-medium">Voice Mock Sessions</p>
                <p className="text-2xl font-bold text-purple-900 mt-1">{mockInterviews} Full Mocks</p>
                <p className="text-[11px] text-purple-600 mt-0.5">STAR method audio scoring</p>
              </div>
            </div>
          </div>

          {/* Sample Phased Agenda Breakdown */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">
              Sample {selectedDays}-Day Curated Progression
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {sampleDays.map((item) => (
                <div
                  key={item.day}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-blue-600">{item.day}</span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.phase}
                      </span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {item.tasks.map((task, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold shrink-0">•</span>
                          <span className="leading-snug">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Auto-tracked</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 1-Click Rebalance Deep Dive */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white p-8 sm:p-10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-300 bg-blue-100/60 px-3 py-1 text-xs font-semibold text-blue-800">
              <RefreshCw className="h-3.5 w-3.5 text-blue-700" />
              <span>Zero-Guilt Adaptability</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Life happens. 1-Click Rebalancing keeps you on track.
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              When production incidents, family commitments, or exhaustion interrupt your schedule, traditional static plans fail. With PrepVisor, simply tap <strong>Rebalance Schedule</strong>. Our algorithm recalculates your remaining days and smoothly spreads incomplete tasks across your remaining timeline—ensuring you stay confident right until interview day.
            </p>
          </div>

          <div className="w-full lg:w-80 p-5 rounded-xl border border-slate-200 bg-white shadow-md space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 border-b border-slate-100 pb-2">
              <span>Status: 2 Tasks Overdue</span>
              <span className="text-amber-600 font-bold">Behind Schedule</span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">Missed Day 6 Tasks:</p>
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-amber-800">
                • LRU Cache Implementation (Java)<br />
                • Token Bucket Algorithm Review
              </div>
            </div>
            <button
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Rebalance Remaining Days</span>
            </button>
            <p className="text-[11px] text-center text-slate-500">
              Redistributes 2 tasks evenly across remaining 24 days.
            </p>
          </div>
        </div>

        {/* 3 Studio Pillars Integration */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900">
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
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
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
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 sm:p-12 text-center text-white space-y-5 shadow-lg">
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Ready to calibrate your daily preparation?
          </h2>
          <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
            Generate your personalized interview roadmap in 60 seconds with our Free Forever tier. Zero credit card required.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=roadmap_bottom`)}
              onClick={() => trackEvent("roadmap_cta_clicked", { cta: "bottom_start_free", location: "bottom_cta" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-xs sm:text-sm font-semibold text-slate-950 shadow-sm hover:bg-slate-100 transition w-full sm:w-auto"
            >
              <span>Start Free Preparation</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition w-full sm:w-auto"
            >
              <span>View Prep Passes (From ₹199)</span>
            </Link>
          </div>
          <p className="text-xs text-blue-200 font-mono">
            No auto-renewals · One-time prepaid passes · Instant access
          </p>
        </div>
      </div>
    </div>
  )
}

export default RoadmapPage
