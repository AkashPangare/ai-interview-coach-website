import React from "react"
import { Zap, Clock } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

export const DeliveryPolicyPage: React.FC = () => {
  return (
    <div className="py-14 sm:py-20 bg-white min-h-screen text-slate-700">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Zap className="h-3.5 w-3.5" />
            <span>Delivery & Fulfillment</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Digital Service Delivery Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: September 9, 2026
          </p>
        </div>

        {/* Highlight Card */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 flex items-start gap-3.5">
          <Clock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-slate-700">
            <h3 className="font-bold text-slate-900 text-sm">
              Instant Electronic Delivery (0 to 15 Minutes)
            </h3>
            <p className="leading-relaxed">
              PrepVisor is an online educational service. <strong>No physical shipments are made.</strong> Early-access updates and future access details are delivered by email.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-600">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">1. Digital Nature of Service</h2>
            <p>
              <strong className="text-slate-900">{COMPANY_CONFIG.brandName}</strong> provides web-based software for interview preparation. All practice modules and curriculum planners are accessed directly through your web browser. No physical goods or books will be shipped to your postal address.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">2. How Access is Delivered</h2>
            <ol className="space-y-2 list-decimal list-inside text-slate-600">
              <li>You join the early-access list using your contact details.</li>
              <li>We email you when the product is ready for access.</li>
              <li>You can contact us anytime with questions about availability.</li>
            </ol>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">3. Shipping Fees</h2>
            <p>
              Because our platform is delivered entirely online, shipping and handling charges are <strong>₹0.00 (Completely Free)</strong>.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900">4. Support for Delivery Inquiries</h2>
            <p>
              If you have questions about early access, please reach out to us at <a href={`mailto:${COMPANY_CONFIG.contact.email}`} className="text-blue-600 underline">{COMPANY_CONFIG.contact.email}</a> or call us at <span className="text-slate-800 font-medium">{COMPANY_CONFIG.contact.displayPhone}</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
