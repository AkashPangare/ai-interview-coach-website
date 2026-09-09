import React from "react"
import { ShieldAlert, Scale } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

export const TermsPage: React.FC = () => {
  return (
    <div className="py-14 sm:py-20 bg-white min-h-screen text-slate-700">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Scale className="h-3.5 w-3.5" />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Terms of Service
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 9, 2026 • Governed by the Laws of India
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using <strong className="text-slate-900">{COMPANY_CONFIG.brandName}</strong> ({COMPANY_CONFIG.websiteUrl}), operated by <strong className="text-slate-900">{COMPANY_CONFIG.legalEntity}</strong>, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Description of Service</h2>
            <p>
              PrepVisor provides online tools for interview preparation, including custom study plans, coding practice, and system design learning.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Early Access</h2>
            <p>
              Joining our early-access list is free and does not create a purchase, subscription, or obligation. We will contact you when access becomes available.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Educational Disclaimer</h2>
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 space-y-1.5 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-amber-900">
                <ShieldAlert className="h-4 w-4" />
                <span>Notice on Career Outcomes</span>
              </div>
              <p>
                PrepVisor is an educational and practice software tool. We do not act as an employment agency and cannot guarantee job offers or specific interview results at third-party companies.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">5. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the competent courts in {COMPANY_CONFIG.compliance.jurisdiction}.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
