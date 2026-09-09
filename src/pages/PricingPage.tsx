import React from "react"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { COMPANY_CONFIG, type PricingTier } from "@/config/company"

interface PricingPageProps { onOpenWaitlistWithPlan: (planId: string) => void }

export const PricingPage: React.FC<PricingPageProps> = ({ onOpenWaitlistWithPlan }) => (
  <div className="min-h-screen bg-slate-50 py-16 text-slate-900 sm:py-20">
    <div className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Simple pricing</p><h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Choose a preparation plan that fits your timeline.</h1><p className="mt-4 text-sm leading-relaxed text-slate-600">Pick the timeframe that suits your interview. Join early access today and we’ll share availability and next steps with you.</p></div>
      <div className="mt-12 grid gap-5 md:grid-cols-3">{COMPANY_CONFIG.pricing.map((tier: PricingTier) => <article key={tier.id} className={`relative flex flex-col rounded-xl border bg-white p-6 ${tier.recommended ? "border-blue-500 shadow-md" : "border-slate-200"}`}>{tier.badge && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{tier.badge}</span>}<div><h2 className="text-xl font-bold">{tier.name}</h2><p className="mt-1 min-h-10 text-sm text-slate-600">{tier.subtitle}</p><p className="mt-5 text-3xl font-extrabold">₹{tier.priceINR}</p><p className="mt-1 text-xs text-slate-500">Suggested price · {tier.days}-day plan</p><ul className="mt-6 space-y-3 text-sm text-slate-600">{tier.features.map(feature => <li key={feature} className="flex gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />{feature}</li>)}</ul></div><button onClick={() => onOpenWaitlistWithPlan(tier.id)} className={`mt-8 inline-flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold ${tier.recommended ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}>Join early access <ArrowRight className="h-4 w-4" /></button></article>)}</div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-500">Prices are shown for reference while PrepVisor is in early access. Joining the list does not take payment or create a commitment.</p>
    </div>
  </div>
)
