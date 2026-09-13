import React from "react"
import { ArrowRight, CalendarDays, CheckCircle2, Code2, MessageCircleQuestion, Sparkles, LogIn } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

interface HomePageProps {
  onOpenWaitlist?: () => void
}

const features = [
  {
    icon: CalendarDays,
    title: "A plan with the right topics",
    text: "Get a daily, structured preparation plan with the coding, system design, and behavioral concepts to master before your interview date.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Ask your AI coach anytime",
    text: "Ask for intuitive concept explanations, real-world examples, and step-by-step guidance whenever a technical topic feels unclear.",
  },
  {
    icon: Code2,
    title: "Practice with realistic mocks",
    text: "Take conversational mock interviews with real-time feedback, scoring your STAR technique, communication, and technical depth.",
  },
]

export const HomePage: React.FC<HomePageProps> = () => (
  <div className="bg-white text-slate-900">
    {/* Hero Section */}
    <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50/80 to-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-blue-700 shadow-xs">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Intelligent Interview Preparation</span>
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
          Prepare for your next tech interview with a clear plan.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          PrepVisor organizes your coding, system design, and behavioral interview preparation around your target role and interview date—keeping everything focused, structured, and stress-free.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row items-center">
          <a
            href={`${COMPANY_CONFIG.appUrl}/register`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] w-full sm:w-auto"
          >
            <span>Start Free Preparation</span>
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href={`${COMPANY_CONFIG.appUrl}/login`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 w-full sm:w-auto"
          >
            <LogIn className="h-4 w-4 text-slate-500" />
            <span>Log In</span>
          </a>
        </div>

        <p className="mt-4 text-xs font-medium text-slate-500">
          Instant digital access · Free plan available · Passes starting at ₹199
        </p>
      </div>
    </section>

    {/* Feature Grid */}
    <section id="how-it-works" className="py-18 sm:py-22">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Everything you need. Nothing you don’t.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            A straightforward way to turn limited study time into consistent, measurable interview readiness.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-xs">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-base font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>

    {/* Step-by-Step Preview */}
    <section className="bg-slate-50 py-18 sm:py-22 border-y border-slate-100">
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Simple from day one</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Know exactly what to work on today.
          </h2>
          <ul className="mt-6 space-y-3.5 text-sm text-slate-600">
            {[
              "Set your target company, role, and interview date",
              "Follow a focused daily plan with clear topic masteries",
              "Practice with coding & system design studios in 9 languages",
              "Validate your answers with realistic multi-turn AI mock sessions",
            ].map((item) => (
              <li key={item} className="flex gap-2.5">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                <span className="leading-tight">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-sm font-bold text-slate-900">Your Daily Preparation Agenda</p>
          <div className="mt-5 space-y-3">
            {[
              "Review HashMaps, Two-Pointer & Sliding Window",
              "Solve Two Sum in Interactive Coding Studio",
              "Ask AI Coach: How to explain time complexity tradeoffs",
              "Complete 15-Minute Conversational Topic Mock",
            ].map((task, index) => (
              <div key={task} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3.5 text-xs text-slate-700 font-medium">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shrink-0">
                  {index + 1}
                </span>
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Bottom CTA */}
    <section className="py-20 text-center">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Start preparing with more clarity today.
        </h2>
        <p className="text-sm text-slate-600">
          Create your personalized preparation roadmap in 60 seconds with our free tier.
        </p>
        <div className="pt-3">
          <a
            href={`${COMPANY_CONFIG.appUrl}/register`}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.99] transition"
          >
            <span>Start Free Preparation</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  </div>
)

export default HomePage
