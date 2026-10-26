import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, CheckCircle2, Clock3, FileText, MessageSquareText, Sparkles } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { SEO_ROUTES } from "@/config/seo"
import { FREE_RESUME_ALLOWANCE, PLAN_DURATIONS, PRICING_PREVIEW, RESUME_ALLOWANCES, type PlanDuration, type PricingPreviewPlan } from "@/config/pricingPreview"
import { usePageSeo } from "@/hooks/usePageSeo"
import { decorateUrlWithUtms, trackEvent } from "@/lib/analytics"

function planFeatures(plan: PricingPreviewPlan): string[] {
  const a = RESUME_ALLOWANCES[plan.days]
  const resume = [
    `${a.generations} AI-tailored generations and ${a.optimizations} JD optimizations`,
    `${a.savedJobs} saved jobs and ${a.matches} resume–JD matches`,
    `${a.qualityChecks} quality checks and ${a.recruiterReviews} recruiter reviews`,
    `${a.gapAnalyses} AI gap analyses`,
    "Unlimited manual resume versions and PDF exports",
  ]
  const interviewPlan = COMPANY_CONFIG.pricing.find((tier) => tier.id === `PLAN_${plan.days}`)
  const interview = interviewPlan?.features.filter((feature) => /Roadmaps|Mock Interviews|Assessments|Coach|Coding|System Design/.test(feature)) ?? []
  if (plan.kind === "resume") return resume
  if (plan.kind === "interview") return interview
  return [...resume, ...interview]
}

export function PricingPage() {
  usePageSeo(SEO_ROUTES.pricing)
  const [duration, setDuration] = useState<PlanDuration>(30)
  const plans = PRICING_PREVIEW.filter((plan) => plan.days === duration)
  const savings = plans[0].priceINR + plans[1].priceINR - plans[2].priceINR

  return (
    <div className="min-h-screen bg-[#fafbfc] py-16 text-slate-900 sm:py-24">
      <div className="mx-auto max-w-7xl space-y-14 px-4 sm:px-6 lg:px-8">
        <header className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700"><Sparkles className="h-4 w-4" /> Simple, one-time pricing</span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Choose what helps you move forward</h1>
          <p className="text-base leading-relaxed text-slate-600">Use Resume Studio, Interview Prep, or both. Select a duration to compare one-time passes and allowances.</p>
        </header>

        <section aria-labelledby="paid-plans" className="space-y-7">
          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
            <div><h2 id="paid-plans" className="text-2xl font-semibold">Compare plans</h2><p className="mt-1 text-sm text-slate-600">Start free, or choose a one-time pass with no automatic renewal.</p></div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs" role="group" aria-label="Plan duration">
              {PLAN_DURATIONS.map((days) => <button key={days} type="button" onClick={() => setDuration(days)} aria-pressed={duration === days} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${duration === days ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"}`}>{days} days</button>)}
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div><h3 className="text-xl font-semibold">Free</h3><p className="mt-1 text-sm text-slate-600">Try Resume Studio and Interview Prep</p></div>
                <Clock3 className="h-5 w-5 shrink-0 text-blue-600" />
              </div>
              <div className="mt-5 border-t border-slate-100 pt-5">
                <div className="flex items-baseline gap-2"><span className="text-3xl font-semibold">₹0</span><span className="text-sm text-slate-500">forever</span></div>
                <p className="mt-1 text-xs text-slate-500">No credit card required</p>
              </div>
              <ul className="mt-5 flex-1 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                {[
                  "1 roadmap, 3 mock interviews, 1 assessment, and 10 AI Coach messages",
                  "1 career profile and 1 saved resume version",
                  `${FREE_RESUME_ALLOWANCE.generations} AI-tailored generation and 1 PDF export`,
                  `${FREE_RESUME_ALLOWANCE.matches} JD match and ${FREE_RESUME_ALLOWANCE.qualityChecks} quality check`,
                  `${FREE_RESUME_ALLOWANCE.recruiterReviews} recruiter review and ${FREE_RESUME_ALLOWANCE.gapAnalyses} gap analysis`,
                ].map((feature) => <li key={feature} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{feature}</span></li>)}
              </ul>
              <a href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)} onClick={() => trackEvent("landing_cta_clicked", { cta: "pricing_free", location: "pricing" })} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100">Start free <ArrowRight className="h-4 w-4" /></a>
            </article>
            {plans.map((plan) => {
              const checkoutUrl = decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/pricing?days=${plan.days}`)
              return <article key={plan.id} className={`flex flex-col rounded-2xl bg-white p-6 shadow-xs ${plan.kind === "bundle" ? "border-2 border-blue-600" : "border border-slate-200"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="text-xl font-semibold">{plan.name}</h3><p className="mt-1 text-sm text-slate-600">{plan.subtitle}</p></div>
                  {plan.kind === "bundle" ? <Sparkles className="h-5 w-5 shrink-0 text-blue-600" /> : plan.kind === "resume" ? <FileText className="h-5 w-5 shrink-0 text-blue-600" /> : <MessageSquareText className="h-5 w-5 shrink-0 text-blue-600" />}
                </div>
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="flex items-baseline gap-2"><span className="text-3xl font-semibold">₹{plan.priceINR}</span><span className="text-sm text-slate-500">/ {plan.days} days</span></div>
                  <p className="mt-1 text-xs text-slate-500">One-time pass · Price shown in INR</p>
                  {plan.kind === "bundle" && <p className="mt-2 text-xs font-semibold text-emerald-700">Save ₹{savings} against both standalone passes</p>}
                </div>
                <ul className="mt-5 flex-1 space-y-2 border-t border-slate-100 pt-5 text-sm text-slate-700">
                  {planFeatures(plan).map((feature) => <li key={feature} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /><span>{feature}</span></li>)}
                </ul>
                <a href={checkoutUrl} onClick={() => trackEvent("pricing_plan_selected", { plan_id: plan.id, plan_name: plan.name, price_inr: plan.priceINR })} className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Choose in app <ArrowRight className="h-4 w-4" /></a>
              </article>
            })}
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">How allowances work</h2>
          <div className="grid gap-5 text-sm leading-relaxed text-slate-600 md:grid-cols-3">
            <p><strong className="text-slate-900">One action, one allowance.</strong> Tailoring a new resume uses one generation. Optimizing an existing version uses one optimization, never both for the same action. Failed actions should not consume an allowance.</p>
            <p><strong className="text-slate-900">Your work stays yours.</strong> Manual edits do not use AI allowances. Paid passes include unlimited manual versions and PDF exports; saved documents remain accessible after expiry.</p>
            <p><strong className="text-slate-900">Different checks, different meanings.</strong> A Resume Quality Check reviews the document. A Resume–JD match estimates requirement coverage. Neither predicts an employer's ATS result or a hiring decision.</p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-slate-600">
          <h2 className="text-2xl font-semibold text-slate-900">Questions about the plans</h2>
          <p><strong className="text-slate-900">Can I use just one studio?</strong> Yes. Resume Studio and Interview Prep remain independent. Complete Journey includes the same allowances for both products at the selected duration.</p>
          <p><strong className="text-slate-900">Can I move to the bundle?</strong> Yes. Unused paid time on an active standalone pass is credited toward a fresh bundle pass. The app shows the exact price before payment.</p>
          <p><strong className="text-slate-900">Are passes recurring?</strong> No. They are one-time passes. Purchase and refund terms are described in the <Link to="/refund-policy" className="font-semibold text-blue-600 underline">refund policy</Link>.</p>
          <p className="text-xs text-slate-500">Review the final price, eligibility, and remaining allowances in the app before paying.</p>
        </section>
      </div>
    </div>
  )
}

export default PricingPage
