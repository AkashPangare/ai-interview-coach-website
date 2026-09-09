import React from "react"
import { RotateCcw, Clock } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="py-14 sm:py-20 bg-white min-h-screen text-slate-700">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Policy Document</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Early Access Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 9, 2026
          </p>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 flex items-start gap-3.5">
          <Clock className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 text-sm">
              No payment is collected during early access
            </h3>
            <p className="leading-relaxed">
              Joining the PrepVisor early-access list is free. It does not create a purchase, subscription, or financial commitment.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Overview</h2>
            <p>
              This policy applies to people who join the early-access list for <strong className="text-slate-900">{COMPANY_CONFIG.brandName}</strong> ({COMPANY_CONFIG.websiteUrl}).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Leaving the List</h2>
            <p>
              You may ask us to remove your details from the early-access list at any time by emailing our support team.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Future Availability</h2>
            <p>
              The prices shown on our site are for plan reference during early access. We will communicate any purchase terms separately before collecting a payment.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Questions</h2>
            <p>
              For questions about early access or your personal information, email <a href={`mailto:${COMPANY_CONFIG.contact.email}`} className="text-blue-600 underline">{COMPANY_CONFIG.contact.email}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
