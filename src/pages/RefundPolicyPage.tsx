import React from "react"
import { RotateCcw } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { usePageSeo } from "@/hooks/usePageSeo"

export const RefundPolicyPage: React.FC = () => {
  usePageSeo({
    title: "Cancellation & Refund Policy | PrepVisor",
    description: "Official Cancellation and Refund Policy for PrepVisor digital preparation passes. Details on 7-day refund eligibility, non-refundable cases, and payment reversal timelines.",
    canonicalUrl: "https://prepvisor.in/refund-policy",
  })

  return (
    <div className="py-14 sm:py-20 bg-[#fafbfc] min-h-screen text-slate-800 bg-dot-grid-subtle">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Policy Document</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 9, 2026 • Governed by the Laws of India
          </p>
        </div>

        {/* Highlight Summary */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs sm:text-sm text-slate-700 space-y-1">
          <p className="font-bold text-slate-900">Summary at a Glance</p>
          <p className="leading-relaxed text-slate-600">
            PrepVisor paid plans are 100% prepaid, one-time passes with zero recurring auto-debits. Purchases carry a <strong className="text-slate-900">7-day refund window</strong>. Approved refunds are returned to your original payment method within <strong className="text-slate-900">5 to 7 business days</strong>.
          </p>
        </div>

        {/* Core Policy Points */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. One-Time Prepaid Passes (Zero Auto-Renewals)</h2>
            <p>
              All PrepVisor paid plans are one-time prepaid digital access passes for the selected duration (7, 14, 30, or 90 days). There are no automatic renewals, recurring debits, or surprise charges.
            </p>
            <p>
              Your pass expires automatically at the end of its prepaid period unless you explicitly purchase another pass. If you wish to discontinue using the platform, no cancellation action is required since you will never be billed automatically.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Refund Eligibility (7-Day Window)</h2>
            <p>
              Preparation passes are eligible for a full refund within <strong className="text-slate-900">{COMPANY_CONFIG.compliance.refundWindowDays} calendar days</strong> of purchase if:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-600">
              <li>You encounter technical issues preventing platform access that our engineering team cannot resolve.</li>
              <li>You experienced an accidental duplicate payment.</li>
              <li>You are dissatisfied under fair initial evaluation (fewer than 2 mock interviews conducted).</li>
            </ul>
            <p className="text-slate-500 text-xs">
              *Because PrepVisor passes do not auto-renew, you will never be charged for subsequent periods without your explicit action.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Non-Refundable Cases</h2>
            <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-600">
              <li>Requests submitted after 7 days from purchase.</li>
              <li>Accounts with substantial usage (e.g., extensive mock interviews completed or bulk downloads).</li>
              <li>External job interview results (PrepVisor is an educational practice tool and does not guarantee job placement).</li>
              <li>Accounts suspended for violating our Terms of Service.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Processing Time & Mode</h2>
            <p>
              Approved refunds are processed <strong className="text-slate-900">exclusively back to the original payment method</strong> (Bank account, Credit/Debit Card, or UPI) within <strong className="text-slate-900">{COMPANY_CONFIG.compliance.refundProcessingDays}</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. How to Request a Refund</h2>
            <p>
              Send an email to <a href={`mailto:${COMPANY_CONFIG.contact.email}`} className="text-blue-600 hover:underline font-medium">{COMPANY_CONFIG.contact.email}</a> with your registered email, payment/order ID, and reason for the refund. We review and respond within {COMPANY_CONFIG.contact.tat.toLowerCase()}.
            </p>
          </section>

          <section className="space-y-2 border-t border-slate-200 pt-5">
            <h2 className="text-base font-bold text-slate-900">6. Grievance & Statutory Details</h2>
            <p>
              Pursuant to the Consumer Protection (E-Commerce) Rules, 2020:
            </p>
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5 text-xs text-slate-700 shadow-xs">
              <p><strong className="text-slate-900">Grievance Officer:</strong> {COMPANY_CONFIG.compliance.grievanceOfficer.name}</p>
              <p><strong className="text-slate-900">Entity:</strong> {COMPANY_CONFIG.legalEntity}</p>
              <p><strong className="text-slate-900">Address:</strong> {COMPANY_CONFIG.compliance.grievanceOfficer.address}</p>
              <p><strong className="text-slate-900">Email:</strong> <a href={`mailto:${COMPANY_CONFIG.compliance.grievanceOfficer.email}`} className="text-blue-600 hover:underline">{COMPANY_CONFIG.compliance.grievanceOfficer.email}</a></p>
              <p><strong className="text-slate-900">Phone:</strong> {COMPANY_CONFIG.compliance.grievanceOfficer.phone}</p>
              <p><strong className="text-slate-900">Jurisdiction:</strong> {COMPANY_CONFIG.compliance.jurisdiction}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default RefundPolicyPage

