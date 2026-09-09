import React from "react"
import { Shield, Lock } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-14 sm:py-20 bg-white min-h-screen text-slate-700">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Shield className="h-3.5 w-3.5" />
            <span>DPDP Act 2023 Compliant</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 9, 2026
          </p>
        </div>

        {/* Data Security Highlight */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 flex items-start gap-3.5">
          <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 text-sm">
              Your information stays private
            </h3>
            <p className="leading-relaxed">
              We only collect the details needed to respond to your early-access request and personalize preparation guidance. We do not sell your information.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Data Fiduciary & Controller</h2>
            <p>
              This Privacy Policy explains how <strong className="text-slate-900">{COMPANY_CONFIG.brandName}</strong>, operated by individual founder <strong className="text-slate-900">{COMPANY_CONFIG.proprietorName}</strong> ({COMPANY_CONFIG.businessType}), manages personal data on <a href={COMPANY_CONFIG.websiteUrl} className="text-blue-600 underline">{COMPANY_CONFIG.websiteUrl}</a>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. Information We Collect</h2>
            <ul className="space-y-1.5 list-disc list-inside text-slate-600">
              <li><strong>Contact Info:</strong> Name, email address, and mobile number.</li>
              <li><strong>Preparation Preferences:</strong> Target role, interview timeline, and daily hours available.</li>
              <li><strong>Practice Preferences:</strong> Your target role, timeline, and selected preparation plan.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. How We Use Your Data</h2>
            <p>
              Your data is used solely to activate your preparation pass, provide interview guidance, and deliver customer support. We do not sell or share personal information with third-party advertising brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. How We Protect Data & Payment Security</h2>
            <p>
              We use industry-standard technical and organizational safeguards to protect your personal data. All online payment transactions are processed securely through certified, RBI-licensed payment aggregators (Cashfree / Razorpay) using 128-bit SSL encryption. We do not capture, process, or store your debit/credit card numbers, CVV, or net banking credentials on our servers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-bold text-slate-900">5. Grievance Redressal Officer</h2>
            <p>
              In accordance with the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000, you can contact our designated Grievance Officer:
            </p>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-1.5 text-xs text-slate-700">
              <p><strong>Name:</strong> {COMPANY_CONFIG.compliance.grievanceOfficer.name}</p>
              <p><strong>Title:</strong> {COMPANY_CONFIG.compliance.grievanceOfficer.title}</p>
              <p><strong>Address:</strong> {COMPANY_CONFIG.compliance.grievanceOfficer.address}</p>
              <p><strong>Email:</strong> <a href={`mailto:${COMPANY_CONFIG.compliance.grievanceOfficer.email}`} className="text-blue-600 underline">{COMPANY_CONFIG.compliance.grievanceOfficer.email}</a></p>
              <p><strong>Phone:</strong> {COMPANY_CONFIG.compliance.grievanceOfficer.phone}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
