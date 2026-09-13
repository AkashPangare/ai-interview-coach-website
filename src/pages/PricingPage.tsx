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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-14 sm:py-20 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            Transparent & Honest Pricing
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
            Choose a preparation plan that fits your interview timeline.
          </h1>
          <p className="text-sm leading-relaxed text-slate-600 max-w-2xl mx-auto">
            Instant digital access to structured preparation roadmaps, interactive coding & whiteboard practice, and AI-powered mock evaluations. One-time payment with zero hidden charges.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 items-stretch">
          {COMPANY_CONFIG.pricing.map((tier: PricingTier) => {
            const isFree = tier.priceINR === 0
            const registerUrl = isFree
              ? `${COMPANY_CONFIG.appUrl}/register`
              : `${COMPANY_CONFIG.appUrl}/register?plan=${tier.id}`

            return (
              <article
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-xs transition-all hover:shadow-md ${
                  tier.recommended
                    ? "border-blue-500 ring-2 ring-blue-500/20 shadow-md"
                    : "border-slate-200"
                }`}
              >
                {tier.badge && (
                  <span
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${
                      tier.recommended ? "bg-blue-600" : "bg-slate-800"
                    }`}
                  >
                    {tier.badge}
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{tier.name}</h2>
                    <p className="mt-1 min-h-[36px] text-xs leading-relaxed text-slate-500">
                      {tier.subtitle}
                    </p>
                  </div>

                  {/* Price Display */}
                  <div className="border-t border-slate-100 pt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {isFree ? "Free" : `₹${tier.priceINR}`}
                      </span>
                      {tier.originalPriceINR > 0 && (
                        <span className="text-xs text-slate-400 line-through">
                          ₹{tier.originalPriceINR}
                        </span>
                      )}
                      {tier.originalPriceINR > 0 && (
                        <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200">
                          Save {Math.round(((tier.originalPriceINR - tier.priceINR) / tier.originalPriceINR) * 100)}%
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[11px] font-medium text-slate-500">
                      {isFree ? "No credit card needed" : `One-time · ${tier.days}-day access pass`}
                    </p>
                    <p className="mt-0.5 text-[10px] text-emerald-700 font-medium">
                      {isFree ? "Full feature exploration" : "(Inclusive of all applicable taxes)"}
                    </p>
                  </div>

                  {/* Feature Inclusions */}
                  <ul className="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
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
                    className={`inline-flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all ${
                      tier.recommended
                        ? "bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:scale-[0.99]"
                        : isFree
                        ? "bg-slate-900 text-white hover:bg-slate-800"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                    }`}
                  >
                    <span>{isFree ? "Start Free" : "Get Started"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <p className="mt-1.5 text-center text-[10px] text-slate-400">
                    {isFree ? "Instant access upon signup" : "Instant activation upon payment"}
                  </p>
                </div>
              </article>
            )
          })}
        </div>

        {/* Add-On Booster Packs Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Flexible Boosters</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Add-On Booster Packs
              </h3>
              <p className="text-xs text-slate-500">
                Need more mock interviews or AI Coach sessions? Boost your active plan anytime.
              </p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 self-start sm:self-auto">
              <PlusCircle className="h-3.5 w-3.5 text-blue-600" />
              Available for active passes
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANY_CONFIG.addOns.map((pack: AddOnPack) => (
              <div
                key={pack.id}
                className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 flex flex-col justify-between hover:border-slate-200 transition"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900">{pack.name}</h4>
                    <span className="text-sm font-extrabold text-blue-600">₹{pack.priceINR}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pack.description}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/60">
                  <a
                    href={`${COMPANY_CONFIG.appUrl}/pricing`}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <h3 className="text-base font-bold text-slate-900">
              Safe, Transparent & Instant Digital Fulfillment
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Every PrepVisor plan is delivered in accordance with Indian e-commerce standards.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700 shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Instant Access (0–15 min)</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Electronic delivery via immediate account activation upon successful payment.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 shrink-0">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">7-Day Refund Policy</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Eligible for a full refund within 7 days if you face unresolved issues. See policy.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-purple-100 p-2.5 text-purple-700 shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Secure Payments</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Secured by Cashfree Payments. Supports UPI, Net Banking, and major Debit/Credit Cards.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700 shrink-0">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Dedicated Support</h4>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Assistance within 24–48 hours via support@prepvisor.in or +91 7249778116.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 uppercase tracking-wider">
              <HelpCircle className="h-4 w-4" />
              <span>Got Questions?</span>
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-slate-500">
              Everything you need to know about our billing, access, and refund terms.
            </p>
          </div>

          <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {PRICING_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index
              return (
                <div key={index} className="transition-colors">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-slate-900 hover:bg-slate-50/70 gap-4"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 shrink-0 text-blue-600" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/40">
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
          <p className="text-xs text-slate-500">
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
