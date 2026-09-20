import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Terminal,
  Code2,
  CheckCircle2,
  Cpu,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Play,
  Activity,
} from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { decorateUrlWithUtms, trackEvent } from "../lib/analytics"
import { usePageSeo } from "@/hooks/usePageSeo"

export const CodingPracticeLandingPage: React.FC = () => {
  usePageSeo({
    title: "DSA Coding Arena with Live Terminal Stdout & Big-O Feedback | PrepVisor",
    description: "Practice DSA coding problems with Java, Python, and C++. Features a live Console Output terminal capturing print statements, automated test runner, 3-tier progressive hints, and Big-O algorithmic complexity analysis.",
    canonicalUrl: "https://prepvisor.in/coding-practice",
    keywords: "java dsa practice online, coding interview practice java, live code execution browser terminal, leetcode alternative java, big-o complexity analyzer",
  })

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const faqs = [
    {
      q: "Which programming languages are supported in the Coding Arena?",
      a: "PrepVisor features Java as a primary first-class default (with modern Records, Pattern Matching, and Stream API), alongside Python 3.12, C++ 20, TypeScript, JavaScript, Go, Rust, Kotlin, and C#. Every language is evaluated by an intelligent execution runner with dedicated test cases and stdout log capture.",
    },
    {
      q: "How does the live Terminal Console Output work?",
      a: "Unlike platforms that hide or swallow debugging print logs, PrepVisor's execution runner captures standard output (System.out.println, print(), console.log(), std::cout) in real time and streams it directly to your dedicated Live Terminal Console window alongside automated test results.",
    },
    {
      q: "How does the Big-O algorithmic complexity analyzer evaluate code?",
      a: "Our AI Principal Engineer evaluation engine analyzes your code logic and loop iteration bounds, comparing auxiliary data structure allocations against theoretical optimal complexity. It classifies your solution (e.g. O(N) Time, O(1) Space) and highlights concrete opportunities to optimize further.",
    },
    {
      q: "What if I get stuck on a difficult algorithm?",
      a: "PrepVisor provides a 3-tier progressive hint system: Tier 1 offers an intuitive problem reframe, Tier 2 suggests the optimal data structure pattern (e.g. Monotonic Stack, Two Pointers), and Tier 3 walks through the pseudo-code logic without giving away the direct code.",
    },
    {
      q: "Can I try the DSA Coding Arena for free?",
      a: "Yes! The Free Forever plan gives you full access to solve problems, execute code with the live terminal console, and receive Big-O feedback on core challenges like Two Sum (alongside Design TinyURL on the system design canvas) with zero credit card required.",
    },
  ]

  return (
    <div className="flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-32 text-center">
        {/* Ambient Hero Backdrop (Seamless Masked Dot Grid + Glow) */}
        <div className="absolute inset-0 bg-dot-grid hero-mask pointer-events-none" />
        <div className="absolute inset-0 glow-blue pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Terminal className="h-3.5 w-3.5 text-blue-600" />
            <span>Interactive DSA Coding Arena · Java First-Class Default</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.12]">
            Solve DSA in Java, Python & C++. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent">
              Debug with live terminal stdout.
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
            Stop debugging algorithms blindly. PrepVisor provides a full VS Code-grade Cloud IDE with <strong>Java as primary default</strong> (alongside Python, C++, and TypeScript), a live Console Output terminal that prints your stdout statements in real time, custom test runners, and instant Big-O algorithmic complexity analysis.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row items-center pt-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=coding_practice_pillar`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "coding_practice_start_free", location: "pillar_hero" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition active:scale-[0.99] w-full sm:w-auto shadow-xs"
            >
              <span>Launch Free Coding Arena</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/guides"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition active:scale-[0.99] w-full sm:w-auto shadow-xs"
            >
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span>Explore Coding Guides</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-slate-600 border-t border-slate-200 max-w-4xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Java, Python, C++, TS in Cloud IDE
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Live Terminal Console Output (Print Logs)
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Automated Test Runner & Edge Cases
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Big-O Time & Space Algorithmic Scoring
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE WORKBENCH PREVIEW */}
      <section className="py-16 sm:py-24 border-y border-slate-200 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
                <Code2 className="h-3.5 w-3.5" />
                <span>Cloud IDE Runtime Engine · Java</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">Live Execution Runner & Split Stdout Console</h2>
              <p className="text-xs text-slate-600">Run code in a dedicated execution runner with real-time stdout streaming</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-mono text-emerald-700 border border-emerald-200 font-medium">
                Time: O(N) · Space: O(N)
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-mono text-slate-700 border border-slate-200 font-medium flex items-center gap-1.5">
                <Play className="h-3 w-3 fill-slate-700" />
                <span>Runner Ready</span>
              </span>
            </div>
          </div>

          {/* Workbench Frame */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl">
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 font-mono text-xs text-slate-600">TwoSum.java · Java (OpenJDK)</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>Runner: Live Execution Active</span>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-12 font-mono text-xs divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
              {/* Editor Preview (Authentic dark editor container inside light window) */}
              <div className="lg:col-span-7 p-6 space-y-1.5 text-slate-200 bg-[#0b0f19] overflow-x-auto shadow-inner">
                <p className="text-slate-500">// Optimal Single-Pass Hash Map with Live Stdout Debugging</p>
                <p><span className="text-purple-400">import</span> java.util.*;</p>
                <p className="pt-1"><span className="text-purple-400">class</span> <span className="text-amber-300">Solution</span> &#123;</p>
                <p className="pl-4"><span className="text-purple-400">public int</span>[] <span className="text-sky-300">twoSum</span>(<span className="text-purple-400">int</span>[] nums, <span className="text-purple-400">int</span> target) &#123;</p>
                <p className="pl-8">Map&lt;Integer, Integer&gt; prev = <span className="text-purple-400">new</span> HashMap&lt;&gt;();</p>
                <p className="pl-8"><span className="text-purple-400">for</span> (<span className="text-purple-400">int</span> i = 0; i &lt; nums.length; i++) &#123;</p>
                <p className="pl-12"><span className="text-purple-400">int</span> diff = target - nums[i];</p>
                <p className="pl-12 text-emerald-400">System.out.printf(<span className="text-amber-200">"[stdout] Checking diff=%d at index=%d%n"</span>, diff, i);</p>
                <p className="pl-12"><span className="text-purple-400">if</span> (prev.containsKey(diff)) &#123;</p>
                <p className="pl-16"><span className="text-purple-400">return new int</span>[] &#123; prev.get(diff), i &#125;;</p>
                <p className="pl-12">&#125;</p>
                <p className="pl-12">prev.put(nums[i], i);</p>
                <p className="pl-8">&#125;</p>
                <p className="pl-8"><span className="text-purple-400">return new int</span>[] &#123;&#125;;</p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>

              {/* Terminal Console Output & Test Cases */}
              <div className="lg:col-span-5 p-6 flex flex-col justify-between gap-4 bg-slate-50/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-semibold text-slate-800 flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-emerald-600" /> Live Console Output (stdout)
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">All Tests Passed</span>
                  </div>
                  <div className="rounded-xl bg-[#0b0f19] p-4 text-[11px] text-slate-300 space-y-1 font-mono border border-slate-800 shadow-inner">
                    <p className="text-slate-500">[stdout] Checking diff=7 at index=0</p>
                    <p className="text-slate-500">[stdout] Checking diff=2 at index=1</p>
                    <p className="text-emerald-400 font-semibold">✓ Case 1: nums=[2,7,11,15], target=9 → Passed (11ms)</p>
                    <p className="text-emerald-400 font-semibold">✓ Case 2: nums=[3,2,4], target=6 → Passed (8ms)</p>
                    <p className="text-emerald-400 font-semibold">✓ Case 3: nums=[3,3], target=6 → Passed (7ms)</p>
                  </div>
                </div>

                <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs text-emerald-950">
                  <p className="font-semibold text-slate-900">Big-O Complexity Verdict:</p>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Single-pass hash table lookup guarantees strict <strong>O(N) linear time</strong> complexity and <strong>O(N) auxiliary space</strong>. Matches industry-standard FAANG benchmark.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE CAPABILITIES (Bento Grid) */}
      <section className="py-20 sm:py-28 bg-[#fafbfc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Built for Serious Engineering Candidates</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Everything you need to write clean, production-grade code
            </h2>
            <p className="text-sm text-slate-600">
              Why engineers prefer PrepVisor's coding studio over generic online judges.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">First-Class Java Default</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Most platforms lock you into outdated Java setups. PrepVisor supports modern Java features (Virtual Threads, Records, Sequenced Collections, Pattern Matching) alongside Python, C++, and TypeScript.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Full support for 9 industry languages</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Authentic starter templates and idiomatic signatures</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Live Terminal Console Output (stdout)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Debugging without print statements is frustrating. PrepVisor captures stdout from your code and prints it line-by-line in a dedicated console window so you can trace pointers and recursion states rapidly.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Streams print statements instantly upon execution</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Separates stdout debug streams from assertion failures</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Big-O Algorithmic Complexity Scoring</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Passing test cases is only half the battle. Interviewers care about complexity. PrepVisor analyzes time and space Big-O complexity, helping you optimize from brute-force O(N²) to optimal O(N log N) or O(N).
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Calculates both Time and Auxiliary Space bounds</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Benchmarks your code against optimal algorithmic patterns</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">3-Tier Progressive Hint System</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never peek at complete solutions and ruin your practice. Our 3-tier hints guide your intuition: Tier 1 clarifies the problem, Tier 2 points to the data structure pattern, and Tier 3 reveals pseudo-code logic.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Builds independent problem-solving intuition</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>Prevents frustration without spoiling the solution</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLAGSHIP CODING GUIDES */}
      <section className="py-20 border-y border-slate-200 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Curated Coding Blueprints</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Study step-by-step algorithmic implementations
            </h2>
            <p className="text-sm text-slate-600">
              In-depth engineering guides covering multi-threading, sentinel nodes, and lock-free concurrency.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                slug: "lru-cache-implementation",
                title: "LRU Cache Implementation: Step-by-Step in Java, Python & C++",
                desc: "Master Doubly Linked List + HashMap sentinel pointer manipulation, thread safety, and O(1) eviction mechanics.",
                readTime: "18 min read",
              },
              {
                slug: "java-concurrency-interview-questions",
                title: "Top 50 Java Concurrency Interview Questions (2026 Edition)",
                desc: "Deep explanations of the JVM memory model, Virtual Threads (Loom), ThreadPoolExecutor sizing, and ConcurrentHashMap.",
                readTime: "24 min read",
              },
            ].map((g) => (
              <div key={g.slug} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 hover:border-slate-300 hover:shadow-md transition">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">{g.readTime}</span>
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
                </div>
                <Link
                  to={`/guides/${g.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
                >
                  <span>Read Complete Implementation Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQS ACCORDION */}
      <section className="py-20 sm:py-28 bg-[#fafbfc]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              DSA Coding Arena FAQs
            </h2>
            <p className="text-sm text-slate-600">
              Everything you need to know about coding execution, languages, and hints.
            </p>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div key={faq.q} className="transition-colors">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-medium text-slate-900 hover:bg-slate-50/80 gap-4"
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
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-20 sm:py-28 text-center border-t border-slate-200 bg-gradient-to-b from-[#fafbfc] to-slate-100/80 relative overflow-hidden">
        <div className="absolute inset-0 glow-blue opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-medium text-blue-700">
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            Instant Studio Access
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-slate-900">
            Start writing code in our interactive arena today.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Run test cases, inspect live console output logs, and verify your Big-O algorithmic complexity with zero setup required.
          </p>
          <div className="pt-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=coding_practice_bottom`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "coding_practice_bottom_start_free", location: "pillar_bottom" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition active:scale-[0.99] shadow-sm"
            >
              <span>Launch Free Coding Studio</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CodingPracticeLandingPage
