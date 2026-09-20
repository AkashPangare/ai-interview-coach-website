import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Layers,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Network,
  Activity,
} from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { decorateUrlWithUtms, trackEvent } from "../lib/analytics"
import { usePageSeo } from "@/hooks/usePageSeo"

export const SystemDesignLandingPage: React.FC = () => {
  usePageSeo({
    title: "System Design Interview Simulator & Cloud Architecture Canvas | PrepVisor",
    description: "Master System Design interviews with an interactive cloud architecture canvas. Real-time back-of-the-envelope capacity estimation, QPS, storage math, and automated SPOF detection.",
    canonicalUrl: "https://prepvisor.in/system-design",
    keywords: "system design interview practice free, how to design twitter interview, distributed systems whiteboard, system design simulator, scale math capacity estimation",
  })

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const faqs = [
    {
      q: "How does PrepVisor's System Design canvas calculate capacity and scale?",
      a: "Our integrated estimation engine evaluates your target numbers in real time: Read/Write QPS, 5-Year persistent storage growth based on payload byte sizing, 80/20 Pareto caching RAM requirements, and network bandwidth saturation. This matches the exact back-of-the-envelope calculations interviewers look for at companies like Google, Meta, and Uber.",
    },
    {
      q: "How does the AI detect Single Points of Failure (SPOFs)?",
      a: "Upon submission, our AI Principal Architect evaluates your complete architecture topology. If critical ingress traffic flows to an un-replicated relational database without a cache or read replicas, or if a monolithic service lacks an upstream load balancer with health checks, PrepVisor highlights the SPOF with concrete remediation advice.",
    },
    {
      q: "Can I practice popular interview questions like TinyURL and Rate Limiter?",
      a: "Yes! PrepVisor includes interactive challenge blueprints for high-frequency architecture questions including TinyURL (URL Shortener), API Rate Limiter, Global Push Notification System, Real-Time Chat (WhatsApp / Slack), YouTube Video Streaming, Uber Ride Dispatch, Twitter News Feed, and Distributed Key-Value Store.",
    },
    {
      q: "Is this suitable for SDE-2, SDE-3, and Tech Lead roles?",
      a: "Absolutely. PrepVisor evaluates architecture at senior and staff engineering depth, including distributed transaction patterns (Saga vs 2PC), multi-region active-active replication, consensus protocols, and cost/latency trade-offs.",
    },
    {
      q: "Can I try the System Design Whiteboard for free?",
      a: "Yes! You can explore the interactive canvas, build architectures, run scale calculations, and solve the featured Design TinyURL challenge blueprint on our Free Forever tier with zero credit card required (the full catalog of 8 blueprints is unlocked on our 14-day pass or higher).",
    },
  ]

  return (
    <div className="flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-32 text-center">
        {/* Ambient Hero Backdrop (Seamless Masked Dot Grid + Glow) */}
        <div className="absolute inset-0 bg-dot-grid hero-mask pointer-events-none" />
        <div className="absolute inset-0 glow-blue pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Cpu className="h-3.5 w-3.5 text-blue-600" />
            <span>Interactive Distributed Systems Simulator</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.12]">
            Design distributed architectures. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">
              Validate scale math in real time.
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
            Stop drawing static boxes on generic paint apps. Design high-throughput distributed systems on an infinite cloud architecture canvas. Connect microservices, databases, and caches with real-world protocols—and validate your architecture with real-time back-of-the-envelope capacity calculations and AI bottleneck analysis.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row items-center pt-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=system_design_pillar`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "system_design_start_free", location: "pillar_hero" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-blue-700 transition active:scale-[0.99] w-full sm:w-auto shadow-xs"
            >
              <span>Launch Free Architecture Studio</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/guides"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition active:scale-[0.99] w-full sm:w-auto shadow-xs"
            >
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span>Explore Architecture Guides</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-slate-600 border-t border-slate-200 max-w-4xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Infinite Drag-and-Drop Canvas
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live QPS & 5-Yr Storage Sizing
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Automated AI SPOF & Bottleneck Analysis
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" /> Microservices & Protocol Modeling
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE CANVAS PREVIEW SHOWCASE */}
      <section className="py-16 sm:py-24 border-y border-slate-200 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-600 uppercase tracking-wider font-semibold">
                <Network className="h-3.5 w-3.5" />
                <span>Cloud Architecture & Topology Engine</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">High-Throughput Distributed Rate Limiter Topology</h2>
              <p className="text-xs text-slate-600">Live back-of-the-envelope capacity validation & protocol routing active</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-mono text-emerald-700 border border-emerald-200 font-medium">
                SPOF Vulnerability: 0
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-mono text-blue-700 border border-blue-200 font-medium">
                Target: 100,000 QPS
              </span>
            </div>
          </div>

          {/* Realistic Window Chrome */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl">
            {/* macOS Window Title Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-100/80 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 font-mono text-xs text-slate-600 font-medium">distributed-rate-limiter.topology</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                <Activity className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                <span>Engine: Active · 6 Nodes</span>
              </div>
            </div>

            {/* Architecture Node Diagram Visual */}
            <div className="p-6 sm:p-10 flex flex-wrap items-center justify-center gap-3 sm:gap-5 bg-dot-grid-subtle relative min-h-[220px]">
              {/* Ingress Node */}
              <div className="rounded-xl bg-white border border-slate-200 p-4 text-center shadow-sm w-40 hover:border-blue-300 transition">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Traffic Ingress</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Cloudflare Anycast</p>
                <span className="text-[11px] text-emerald-600 font-mono mt-1 block font-medium">100K Read QPS</span>
              </div>

              {/* Protocol Link */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500">HTTPS / HTTP/2</span>
                <span className="text-slate-400 font-mono text-xs font-semibold">────────▶</span>
              </div>

              {/* API Gateway Node */}
              <div className="rounded-xl bg-white border border-blue-300 p-4 text-center shadow-sm w-40 hover:border-blue-500 transition">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider font-semibold">API Gateway</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Envoy Proxy Fleet</p>
                <span className="text-[11px] text-blue-600 font-mono mt-1 block">Rate Limit Filter</span>
              </div>

              {/* Protocol Link */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500">gRPC</span>
                <span className="text-slate-400 font-mono text-xs font-semibold">────────▶</span>
              </div>

              {/* Memory Cache Node */}
              <div className="rounded-xl bg-white border border-rose-300 p-4 text-center shadow-sm w-40 hover:border-rose-500 transition">
                <span className="text-[10px] font-mono text-rose-600 uppercase tracking-wider font-semibold">Memory Cache</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Redis Cluster</p>
                <span className="text-[11px] text-rose-600 font-mono mt-1 block">Lua Script Atomic</span>
              </div>

              {/* Protocol Link */}
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-mono text-slate-500">TCP Sync</span>
                <span className="text-slate-400 font-mono text-xs font-semibold">────────▶</span>
              </div>

              {/* Primary DB Node */}
              <div className="rounded-xl bg-white border border-purple-300 p-4 text-center shadow-sm w-40 hover:border-purple-500 transition">
                <span className="text-[10px] font-mono text-purple-600 uppercase tracking-wider font-semibold">Primary DB</span>
                <p className="text-sm font-semibold text-slate-900 mt-1">Postgres Cluster</p>
                <span className="text-[11px] text-purple-600 font-mono mt-1 block">3 Read Replicas</span>
              </div>
            </div>
          </div>

          {/* Real-time Scale Calculator Metrics */}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
              <p className="text-xs font-mono text-slate-500 font-medium">Peak Read Throughput</p>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">100,000 QPS</p>
              <p className="text-[11px] text-emerald-600 font-mono">Latency SLA &lt; 15ms</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
              <p className="text-xs font-mono text-slate-500 font-medium">5-Year Cumulative Storage</p>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">14.6 Terabytes</p>
              <p className="text-[11px] text-slate-500 font-mono">Metadata + index overhead</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
              <p className="text-xs font-mono text-slate-500 font-medium">Redis In-Memory RAM</p>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">32 Gigabytes</p>
              <p className="text-[11px] text-rose-600 font-mono">80/20 Pareto distribution</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1 shadow-xs">
              <p className="text-xs font-mono text-slate-500 font-medium">Peak Ingress Bandwidth</p>
              <p className="text-2xl font-semibold text-slate-900 tracking-tight">1.2 Gbps</p>
              <p className="text-[11px] text-blue-600 font-mono">Multiplexed HTTP/2 & gRPC</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE TECHNICAL PILLARS (Bento Grid) */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">The 4 Pillars of Architecture Mastery</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Engineered for FAANG & High-Growth Scale-Ups
            </h2>
            <p className="text-sm text-slate-600">
              How PrepVisor bridges the gap between theoretical system knowledge and production execution.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Infinite Drag-and-Drop Cloud Topology</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Position load balancers, reverse proxies, microservices, caches, and relational or NoSQL datastores. Connect components with defined protocols (HTTPS, gRPC, WebSocket, TCP) to emulate authentic production architectures.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Interactive node snapping with directional edge routing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Support for microservices, event streams (Kafka), and memory tiers</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Cpu className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Live Back-of-the-Envelope Capacity Estimator</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never guess storage and memory requirements. As you configure your daily active users (DAU) and read/write ratios, PrepVisor computes precise QPS, bandwidth, 5-year persistent storage, and RAM sizing dynamically.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Instant QPS, storage, and network bandwidth calculations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>80/20 Pareto caching distribution sizing for Redis/Memcached</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Automated AI SPOF & Bottleneck Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upon submission, the AI Principal Architect analyzes your complete diagram topology for single points of failure, missing circuit breakers, and un-replicated databases. Get instant scoring and actionable remediation before an interviewer spots your vulnerability.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Identifies database write saturation and failover gaps</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>Provides actionable mitigation recommendations</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 space-y-4 hover:border-slate-300 hover:bg-white hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">AI Principal Architect Evaluation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Receive comprehensive feedback on trade-offs: Consistency vs Availability (CAP theorem), SQL vs NoSQL suitability, indexing strategies, and asynchronous event-driven decoupling.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Evaluates trade-off articulation and technical depth</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Benchmarks against staff-level industry standards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FLAGSHIP SYSTEM DESIGN CASE STUDIES */}
      <section className="py-20 border-y border-slate-200 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-blue-600 font-semibold">Curated Blueprint Guides</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Learn from real-world architecture breakdowns
            </h2>
            <p className="text-sm text-slate-600">
              Study comprehensive architecture blueprints with end-to-end capacity estimation and database choices.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                slug: "system-design-tinyurl",
                title: "How to Design TinyURL (URL Shortener)",
                desc: "Learn Base62 vs hashing, Key Generation Service (KGS), 3.6TB storage math, and caching tiers.",
                readTime: "20 min read",
              },
              {
                slug: "system-design-rate-limiter",
                title: "How to Design an API Rate Limiter",
                desc: "Token Bucket vs Leaky Bucket, distributed Redis Lua script atomicity, memory sizing, and fail-open resilience.",
                readTime: "22 min read",
              },
              {
                slug: "system-design-notification-service",
                title: "How to Design a Notification System at Scale",
                desc: "Kafka priority topics, idempotency keys, worker fleets, Apple APNs/FCM, and vendor circuit breakers.",
                readTime: "24 min read",
              },
            ].map((g) => (
              <div key={g.slug} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-medium">{g.readTime}</span>
                  <h3 className="text-base font-semibold text-slate-900 leading-snug">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
                </div>
                <Link
                  to={`/guides/${g.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 pt-3 border-t border-slate-100"
                >
                  <span>Read Complete Blueprint</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQS ACCORDION */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              System Design Interview FAQs
            </h2>
            <p className="text-sm text-slate-600">
              Everything you need to know about preparing for architecture loops with PrepVisor.
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
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
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

      {/* 6. BOTTOM CTA */}
      <section className="py-20 sm:py-28 text-center border-t border-slate-200 bg-gradient-to-b from-[#fafbfc] to-slate-100/80 relative overflow-hidden">
        <div className="absolute inset-0 glow-blue opacity-30 pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-medium text-blue-700">
            <Zap className="h-3.5 w-3.5 text-blue-600" />
            Interactive Practice Studio
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-slate-900">
            Build your first architecture on PrepVisor today.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Test your distributed systems design skills on our infinite cloud canvas with instant capacity calculations and AI feedback.
          </p>
          <div className="pt-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=system_design_pillar_bottom`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "system_design_bottom_start_free", location: "pillar_bottom" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 transition active:scale-[0.99] shadow-sm"
            >
              <span>Launch Free Architecture Studio</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SystemDesignLandingPage
