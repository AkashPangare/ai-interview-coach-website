import React, { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  RotateCcw,
  Headphones,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PlusCircle,
} from "lucide-react"
import { COMPANY_CONFIG, type PricingTier, type AddOnPack } from "@/config/company"
import { decorateUrlWithUtms, trackEvent } from "../lib/analytics"
import { usePageSeo } from "@/hooks/usePageSeo"

interface PricingPageProps {
  onOpenWaitlistWithPlan?: (planId: string) => void
}

interface FAQItem {
  question: string
  answer: React.ReactNode
}

const PRICING_FAQS: FAQItem[] = [
  {
    question: "How do I receive access after completing payment?",
    answer:
      "Access is granted electronically and instantly upon successful payment. Your plan will be activated within 0 to 15 minutes, and an order confirmation along with your digital receipt will be delivered directly to your registered email address.",
  },
  {
    question: "Is this a recurring subscription with automatic renewal?",
    answer:
      "No. All PrepVisor paid plans are one-time prepaid digital passes for the specific duration selected (7, 14, 30, or 90 days). There are zero automatic recurring charges or unexpected debits.",
  },
  {
    question: "What is the cancellation and refund policy?",
    answer: (
      <span>
        We offer a 7-day refund policy for first-time pass purchases under fair
        initial evaluation (fewer than 2 mock interviews conducted). Approved
        refunds are processed back to your original payment source within 5 to 7
        business days. Please review our full{" "}
        <Link to="/refund-policy" className="text-blue-600 underline font-medium">
          Cancellation & Refund Policy
        </Link>{" "}
        for details.
      </span>
    ),
  },
  {
    question: "Which payment modes are accepted?",
    answer:
      "We accept all major Indian payment methods through our secure Cashfree payment gateway, including UPI (Google Pay, PhonePe, Paytm, BHIM, CRED), Net Banking across 50+ Indian banks, and Visa, Mastercard, RuPay Debit and Credit Cards.",
  },
  {
    question: "Can I try PrepVisor for free before paying?",
    answer:
      "Yes! Our Free Forever plan includes 1 preparation roadmap, 3 multi-turn AI mock interviews, 1 technical assessment, and 10 AI coach questions with zero credit card required.",
  },
  {
    question: "Who operates PrepVisor?",
    answer: (
      <span>
        PrepVisor is legally operated by {COMPANY_CONFIG.legalEntity},
        headquartered at {COMPANY_CONFIG.address.formatted}. For inquiries, you
        can reach us at{" "}
        <a href={`mailto:${COMPANY_CONFIG.contact.email}`} className="text-blue-600 underline">
          {COMPANY_CONFIG.contact.email}
        </a>{" "}
        or call {COMPANY_CONFIG.contact.phone}.
      </span>
    ),
  },
]

export const PricingPage: React.FC<PricingPageProps> = () => {
  usePageSeo({
    title: "PrepVisor Pricing — One-Time AI Interview Prep Passes from ₹199",
    description: "Transparent, one-time prepaid interview passes from ₹199. Zero recurring subscriptions. Full access to DSA coding studio, infinite system design whiteboard, and voice AI mocks.",
    canonicalUrl: "https://prepvisor.in/pricing",
    keywords: "prepvisor pricing, tech interview prep cost, interview preparation passes, coding interview cost, system design practice pricing",
  })

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-[#fafbfc] py-16 sm:py-24 text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Ambient Hero Backdrop (Seamless Masked Dot Grid + Glow) */}
      <div className="absolute inset-x-0 top-0 h-[520px] bg-dot-grid hero-mask pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[520px] glow-blue pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Transparent & Honest Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.12]">
            Choose a preparation plan that fits your interview timeline.
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Instant digital access to calibrated daily roadmaps, interactive coding & whiteboard practice, and AI-powered mock evaluations. One-time payment with zero hidden charges.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 font-medium">
            <span>✓ Free forever tier available</span>
            <span className="text-slate-300">•</span>
            <span>✓ Instant digital access (0–15 mins)</span>
            <span className="text-slate-300">•</span>
            <span>✓ 7-day refund window</span>
            <span className="text-slate-300">•</span>
            <span>✓ Zero auto-renewals</span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch">
          {COMPANY_CONFIG.pricing.map((tier: PricingTier) => {
            const isFree = tier.priceINR === 0
            const baseRegisterUrl = isFree
              ? `${COMPANY_CONFIG.appUrl}/register`
              : `${COMPANY_CONFIG.appUrl}/register?plan=${tier.id}`
            const registerUrl = decorateUrlWithUtms(baseRegisterUrl)

            return (
              <article
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 transition-all ${
                  tier.recommended
                    ? "border-2 border-blue-600 bg-white shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10"
                    : "border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md shadow-xs"
                }`}
              >
                {tier.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider shadow-xs ${
                      tier.recommended
                        ? "bg-blue-600 text-white shadow-blue-600/20 shadow-md font-semibold"
                        : "bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    }`}
                  >
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{tier.name}</h3>
                    <p className="mt-1 min-h-[36px] text-xs leading-relaxed text-slate-600">
                      {tier.subtitle}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-slate-900 font-mono tracking-tight">
                        {isFree ? "Free" : `₹${tier.priceINR}`}
                      </span>
                      {tier.originalPriceINR > 0 && (
                        <span className="text-xs font-mono text-slate-400 line-through">
                          ₹{tier.originalPriceINR}
                        </span>
                      )}
                      {tier.originalPriceINR > 0 && (
                        <span className="rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-mono text-emerald-700 font-semibold">
                          -{Math.round(((tier.originalPriceINR - tier.priceINR) / tier.originalPriceINR) * 100)}%
                        </span>
                      )}
                    </div>
                    {!isFree && (
                      <p className="mt-1 text-[11px] font-mono text-slate-500">
                        One-time · {tier.days}-day access pass
                      </p>
                    )}
                    <p className={`${isFree ? "mt-1" : "mt-0.5"} text-[10px] text-emerald-700 font-mono font-medium`}>
                      {isFree ? "Full feature exploration" : "(Inclusive of all taxes)"}
                    </p>
                  </div>

                  {/* Feature Inclusions */}
                  <ul className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600 mt-0.5" />
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <a
                    href={registerUrl}
                    onClick={() =>
                      trackEvent("pricing_plan_selected", {
                        plan_id: tier.id,
                        plan_name: tier.name,
                        price_inr: tier.priceINR,
                        is_free: isFree,
                      })
                    }
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all active:scale-[0.99] ${
                      tier.recommended
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xs"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs"
                    }`}
                  >
                    <span>{isFree ? "Start Free" : "Get Started"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <p className="mt-1.5 text-center text-[10px] font-mono text-slate-500">
                    {isFree ? "Instant access upon signup" : "Instant activation upon payment"}
                  </p>
                </div>
              </article>
            )
          })}
        </div>

        {/* Add-On Booster Packs Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Flexible Boosters</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mt-1">
                Add-On Booster Packs
              </h3>
              <p className="text-xs text-slate-600">
                Need more mock interviews or AI Coach sessions? Boost your active plan anytime.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-700 self-start sm:self-auto font-medium">
              <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
              Available for active passes
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANY_CONFIG.addOns.map((pack: AddOnPack) => (
              <div
                key={pack.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between hover:border-slate-300 hover:bg-white transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-900">{pack.name}</h4>
                    <span className="text-sm font-mono font-bold text-blue-600">₹{pack.priceINR}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pack.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200">
                  <a
                    href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/pricing`)}
                    onClick={() =>
                      trackEvent("landing_cta_clicked", {
                        cta: `addon_${pack.id}`,
                        location: "pricing_addons",
                      })
                    }
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>View in App</span>
                    <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fulfillment & Trust Highlights (Cashfree Audit Section) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className="text-lg font-semibold text-slate-900">
              Safe, Transparent & Instant Digital Fulfillment
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Every PrepVisor plan is delivered in accordance with Indian e-commerce standards.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-3.5 items-start">
              <div className="rounded-xl bg-blue-50 border border-blue-200 p-2.5 text-blue-600 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-900">Instant Access (0–15 min)</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Electronic delivery via immediate account activation upon successful payment.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-600 shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-900">7-Day Refund Policy</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Eligible for a full refund within 7 days if you face unresolved issues. See policy.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="rounded-xl bg-purple-50 border border-purple-200 p-2.5 text-purple-600 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-900">Secure Payments</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Secured by Cashfree Payments. Supports UPI, Net Banking, and major Debit/Credit Cards.
                </p>
              </div>
            </div>

            <div className="flex gap-3.5 items-start">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-amber-600 shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-900">Dedicated Support</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Assistance within 24–48 hours via support@prepvisor.in or +91 7249778116.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold">
              <HelpCircle className="h-4 w-4" />
              <span>Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-600">
              Everything you need to know about our billing, access, and refund terms.
            </p>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            {PRICING_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div key={index} className="transition-colors">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-medium text-slate-900 hover:bg-slate-50/80 gap-4"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200 pt-3 bg-slate-50/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Legal & Statutory Note */}
        <div className="text-center border-t border-slate-200 pt-8 max-w-2xl mx-auto space-y-1.5">
          <p className="text-xs text-slate-500 font-mono">
            All prices are listed in Indian Rupees (INR) and are inclusive of all applicable statutory taxes.
          </p>
          <p className="text-[11px] text-slate-400">
            Operated by {COMPANY_CONFIG.legalEntity} · Bengaluru, Karnataka, India · Governed by the Laws of India.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
