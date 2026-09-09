import React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CalendarDays, CheckCircle2, Code2, MessageCircleQuestion, Sparkles } from "lucide-react"

interface HomePageProps { onOpenWaitlist?: () => void }

const features = [
  { icon: CalendarDays, title: "A plan with the right topics", text: "Get a daily plan with the coding and system design topics to cover before your interview." },
  { icon: MessageCircleQuestion, title: "Ask your AI coach", text: "Ask for simple concept explanations, examples, and help whenever a topic feels unclear." },
  { icon: Code2, title: "Practice with a quick mock", text: "Take a short mock interview after each topic and get clear feedback on strengths and what to improve." },
]

export const HomePage: React.FC<HomePageProps> = () => (
  <div className="bg-white text-slate-900">
    <section className="border-b border-slate-100 bg-gradient-to-b from-blue-50/80 to-white py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700"><Sparkles className="h-3.5 w-3.5" /> Interview preparation, made clear</div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">Prepare for your next tech interview with a clear plan.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">PrepVisor helps you organize your coding, system design, and interview preparation around your interview date-keeping everything focused, simple, and stress-free.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link to="/pricing" className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Get Started <ArrowRight className="h-4 w-4" /></Link><a href="#how-it-works" className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">See how it works</a></div>
        <p className="mt-4 text-xs text-slate-500">Instant digital access · 7-day refund guarantee · Starting at ₹299</p>
      </div>
    </section>
    <section id="how-it-works" className="py-18 sm:py-22">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"><div className="mx-auto max-w-2xl text-center"><h2 className="text-3xl font-bold tracking-tight">Everything you need. Nothing you don’t.</h2><p className="mt-3 text-sm leading-relaxed text-slate-600">A straightforward way to turn limited study time into consistent interview preparation.</p></div><div className="mt-10 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></div><h3 className="mt-4 font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{text}</p></article>)}</div></div>
    </section>
    <section className="bg-slate-50 py-18 sm:py-22"><div className="mx-auto grid max-w-5xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Simple from day one</p><h2 className="mt-3 text-3xl font-bold tracking-tight">Know exactly what to work on today.</h2><ul className="mt-6 space-y-3 text-sm text-slate-600">{['Set your target role and interview date', 'Follow a focused daily plan with clear topics', 'Ask for help and check your progress with a mock'].map(item => <li key={item} className="flex gap-2"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />{item}</li>)}</ul></div><div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-slate-900">Your preparation plan</p><div className="mt-5 space-y-3">{['Review arrays and strings', 'Ask your coach for an example', 'Take a quick topic mock'].map((task, index) => <div key={task} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-700"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</span>{task}</div>)}</div></div></div></section>
    <section className="py-20 text-center"><div className="mx-auto max-w-2xl px-4 sm:px-6"><h2 className="text-3xl font-bold tracking-tight">Start preparing with more clarity.</h2><p className="mt-3 text-sm text-slate-600">Choose the preparation plan that fits your timeline and start practicing today.</p><Link to="/pricing" className="mt-7 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">Get Started <ArrowRight className="h-4 w-4" /></Link></div></section>
  </div>
)
