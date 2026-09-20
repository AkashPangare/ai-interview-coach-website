import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  Mic,
  CheckCircle2,
  Award,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Bot,
  Activity,
  Volume2,
} from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { decorateUrlWithUtms, trackEvent } from "../lib/analytics"
import { usePageSeo } from "@/hooks/usePageSeo"

export const MockInterviewLandingPage: React.FC = () => {
  usePageSeo({
    title: "AI Voice Mock Interview Online & STAR Behavioral Coach | PrepVisor",
    description: "Practice realistic tech mock interviews with Speech-to-Text dictation. Real-time voice practice, STAR framework scoring (Situation, Task, Action, Result), leadership ownership metrics, and multi-turn role-calibrated rounds.",
    canonicalUrl: "https://prepvisor.in/mock-interview",
    keywords: "AI mock interview free, behavioral interview practice with AI, STAR method interview practice online, speech to text interview prep, amazon leadership principles mock interview",
  })

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const faqs = [
    {
      q: "How does the Speech-to-Text voice mock interview work?",
      a: "PrepVisor uses browser-native speech recognition to capture your spoken words live into your answer space. You speak naturally just like in an actual technical or behavioral interview. The AI transcribes your spoken response, evaluates your technical accuracy and communication structure, and provides instant scoring.",
    },
    {
      q: "What is the STAR framework and why does PrepVisor grade it?",
      a: "STAR stands for Situation, Task, Action, and Result. It is the gold standard used by Amazon (Leadership Principles), Google, Meta, and Microsoft to evaluate behavioral competencies. PrepVisor breaks down each segment of your answer to ensure you clearly communicate business stakes, your personal technical actions, and quantifiable business outcomes.",
    },
    {
      q: "How are mock interview rounds structured?",
      a: "Each mock session presents a multi-turn round of 5 role-calibrated questions tailored directly to your target role and preparation task. You answer each question sequentially—via speech dictation or typing—and receive instant turn-by-turn critique covering technical depth, answer structuring (STAR), and communication clarity before advancing to the next question.",
    },
    {
      q: "Can I practice for both technical and leadership roles?",
      a: "Yes. PrepVisor supports tracks for Junior Engineers, Senior/Staff Software Engineers, Tech Leads, and Engineering Managers with questions tailored to system trade-offs, cross-functional conflicts, and team mentorship.",
    },
    {
      q: "How many mock interviews are included in the Free tier?",
      a: "The Free Forever plan includes 3 full multi-turn AI mock sessions with complete technical scoring, detailed feedback, and identified strengths and weaknesses—with zero credit card required.",
    },
  ]

  return (
    <div className="flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-purple-600 selection:text-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-20 pb-20 sm:pt-28 sm:pb-32 text-center bg-dot-grid">
        {/* Subtle Ambient Radial Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] glow-purple pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
            <Mic className="h-3.5 w-3.5 text-purple-600" />
            <span>AI Voice-to-Text Mock Interviewer & STAR Behavioral Coach</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.08]">
            Speak out loud.{" "}
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
              Master the STAR framework with AI critique.
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
            Say goodbye to awkward peer interview scheduling and generic ChatGPT text prompts. Speak naturally out loud with built-in Speech-to-Text dictation, and receive instant AI critique across technical accuracy, the proven STAR framework, and leadership ownership.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row items-center pt-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=mock_interview_pillar`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "mock_interview_start_free", location: "pillar_hero" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white hover:bg-purple-700 transition active:scale-[0.99] w-full sm:w-auto shadow-xs"
            >
              <span>Start Free Voice Mock</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition active:scale-[0.99] w-full sm:w-auto shadow-xs"
            >
              <span>View All Plans & Passes</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-slate-600 border-t border-slate-200 max-w-4xl mx-auto">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-600" /> Real-time Speech Recognition
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> STAR Framework Scoring (S-T-A-R)
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600" /> Leadership Ownership Ratio ('I' vs 'we')
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pink-600" /> Multi-Turn Role-Calibrated Rounds
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE EVALUATION SHOWCASE */}
      <section className="py-16 sm:py-24 border-y border-slate-200 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-purple-600 uppercase tracking-wider font-semibold">
                <Volume2 className="h-3.5 w-3.5" />
                <span>Live Evaluation Engine · Voice Session</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">STAR Method Analysis & Scoring Breakdown</h2>
              <p className="text-xs text-slate-600">Prompt: "Tell me about a time you resolved a major production incident."</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-mono text-purple-700 border border-purple-200 font-medium">
                STAR Score: 92 / 100
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-mono text-emerald-700 border border-emerald-200 font-medium">
                Verdict: Strong Hire
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
                <span className="ml-3 font-mono text-xs text-slate-600">interviewer-loop-v2.speech</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                <Activity className="h-3.5 w-3.5 text-purple-600 animate-pulse" />
                <span>Voice Dictation: Speech Recognition Active</span>
              </div>
            </div>

            <div className="p-6 sm:p-8 grid gap-6 lg:grid-cols-12 bg-dot-grid">
              {/* Left Transcript & Waveform Card */}
              <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-rose-500 animate-pulse" />
                    <span className="text-xs font-mono font-medium text-slate-800">Live Voice Transcription</span>
                  </div>
                  {/* Visual Waveform */}
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-1 bg-purple-400 rounded-full animate-pulse" />
                    <span className="h-5 w-1 bg-purple-500 rounded-full animate-pulse" />
                    <span className="h-3 w-1 bg-purple-500 rounded-full" />
                    <span className="h-6 w-1 bg-pink-500 rounded-full animate-pulse" />
                    <span className="h-4 w-1 bg-purple-600 rounded-full" />
                    <span className="h-2 w-1 bg-purple-400 rounded-full" />
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs leading-relaxed text-slate-700 italic space-y-2">
                  <p>
                    "During our holiday checkout surge, our primary auth service experienced severe connection pool exhaustion, causing checkout errors for 14% of customers.
                  </p>
                  <p>
                    As the on-call backend lead, I took immediate ownership, analyzed thread dumps in Datadog, discovered an un-indexed foreign key query causing lock contention, deployed a database index hotfix within 22 minutes, and subsequently introduced circuit breakers that reduced p99 latency from 1.8s to 110ms."
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-xl bg-slate-50/70 p-3.5 border border-slate-200">
                    <p className="text-[11px] font-mono text-slate-500">Leadership Ownership</p>
                    <p className="text-sm font-semibold text-emerald-700 mt-0.5">86% "I" Statements</p>
                    <p className="text-[10px] text-slate-500">Direct personal execution demonstrated</p>
                  </div>
                  <div className="rounded-xl bg-slate-50/70 p-3.5 border border-slate-200">
                    <p className="text-[11px] font-mono text-slate-500">Metric Density</p>
                    <p className="text-sm font-semibold text-blue-700 mt-0.5">High (4 metrics cited)</p>
                    <p className="text-[10px] text-slate-500">14% users, 22 mins, 1.8s → 110ms</p>
                  </div>
                </div>
              </div>

              {/* Right STAR Bars */}
              <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs">
                <h3 className="text-xs font-mono text-slate-500 uppercase tracking-wider font-semibold">STAR Competency Scores</h3>
                <div className="space-y-3.5">
                  {[
                    { label: "Situation (Context & Urgency)", score: 94, color: "bg-blue-600" },
                    { label: "Task (Specific Personal Role)", score: 88, color: "bg-emerald-600" },
                    { label: "Action (Technical Steps Taken)", score: 96, color: "bg-purple-600" },
                    { label: "Result (Business & Latency Impact)", score: 90, color: "bg-pink-600" },
                  ].map((dim) => (
                    <div key={dim.label} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-700">{dim.label}</span>
                        <span className="font-semibold text-slate-900">{dim.score}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-3.5 text-xs text-purple-900">
                  <p className="font-semibold flex items-center gap-1.5 text-purple-700">
                    <Bot className="h-3.5 w-3.5 text-purple-600" /> AI Coach Feedback & Actionable Directives:
                  </p>
                  <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
                    "Great technical ownership and root cause triage. To elevate this response: specify how you communicated the outage timeline to leadership and stakeholders during the 22-minute incident window."
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
            <span className="text-xs font-mono uppercase tracking-widest text-purple-600 font-semibold">Why PrepVisor Voice Mocks Win</span>
            <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-slate-900">
              Engineered to eliminate interview day nervousness
            </h2>
            <p className="text-sm text-slate-600">
              The only way to get comfortable speaking in high-stakes interviews is to practice speaking out loud.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                <Mic className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Real-Time Conversational Voice Recognition</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Practice answering with your real voice. PrepVisor transcribes your verbal articulation, pauses, and pacing without forcing you to type lengthy essays.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Browser-native Speech-to-Text with instant feedback</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600 shrink-0" />
                  <span>Simulates genuine conversational interview cadence</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">STAR Method Evaluation Engine</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every behavioral response is automatically mapped to Situation, Task, Action, and Result. Get notified when your action section is too generic or your results lack numbers.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Amazon Leadership Principles & Google behavioral alignment</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                  <span>Specific feedback on quantifiable business impact</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-600">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Multi-Turn Role-Calibrated Rounds</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real interviews aren't single one-off prompts. PrepVisor sequences 5 comprehensive questions tailored to your target engineering track and seniority, providing structured turn-by-turn technical and behavioral evaluation across the full session.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-pink-600 shrink-0" />
                  <span>Curated 5-turn interview sequences calibrated by role</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-pink-600 shrink-0" />
                  <span>Instant turn-by-turn critique and scoring before advancing</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-4 hover:border-slate-300 hover:shadow-md transition">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">10-Dimension Longitudinal Progress</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track your communication and ownership metrics across all mock sessions. See how your conciseness, technical depth, and conflict resolution improve over your preparation roadmap.
              </p>
              <ul className="space-y-2 text-xs text-slate-700 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Verifiable trend direction (+3 improving, stable, or declining)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Diagnostic score integrated into overall Readiness Index</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 sm:py-28 border-t border-slate-200 bg-slate-50/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-purple-600 font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Voice Mock Interview FAQs
            </h2>
            <p className="text-sm text-slate-600">
              Everything you need to know about preparing for conversational and behavioral rounds.
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
                      <ChevronUp className="h-4 w-4 shrink-0 text-purple-600" />
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

      {/* 5. BOTTOM CTA */}
      <section className="py-20 sm:py-28 text-center border-t border-slate-200 bg-gradient-to-b from-[#fafbfc] to-slate-100 relative">
        <div className="absolute inset-0 glow-purple opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-3xl px-4 sm:px-6 relative z-10 space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-3.5 py-1 text-xs font-mono text-purple-700 font-medium">
            <Zap className="h-3.5 w-3.5 text-purple-600" />
            Instant Digital Access
          </span>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-0.03em] text-slate-900">
            Start practicing voice mock interviews today.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Gain confidence speaking about your career milestones, architecture trade-offs, and production incidents with realistic AI feedback.
          </p>
          <div className="pt-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=mock_interview_bottom`)}
              onClick={() => trackEvent("landing_cta_clicked", { cta: "mock_interview_bottom_start_free", location: "pillar_bottom" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 py-3.5 text-sm font-semibold text-white hover:bg-purple-700 transition active:scale-[0.99] shadow-xs"
            >
              <span>Start Free Voice Mock Session</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MockInterviewLandingPage
