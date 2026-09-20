import React, { useState } from "react"
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle2,
  Building,
} from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { usePageSeo } from "@/hooks/usePageSeo"
import { trackEvent } from "@/lib/analytics"

export const ContactPage: React.FC = () => {
  usePageSeo({
    title: "Contact PrepVisor — Customer Support & Enterprise Inquiries",
    description: "Get in touch with PrepVisor support team and founders. Reach us via email, phone, or office address in Bengaluru for customer assistance, billing, or enterprise cohort inquiries.",
    canonicalUrl: "https://prepvisor.in/contact",
    keywords: "contact prepvisor, customer support prepvisor, interview prep help, prepvisor bangalore address",
  })

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState("General Question")
  const [message, setMessage] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ticketId, setTicketId] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return

    setIsSubmitting(true)
    const generatedId = `PV-${Math.floor(10000 + Math.random() * 90000)}`
    setTicketId(generatedId)

    trackEvent("contact_form_submitted", {
      category,
      ticket_id: generatedId,
    })

    try {
      await fetch(`https://formsubmit.co/ajax/${COMPANY_CONFIG.contact.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[Support Ticket #${generatedId}] ${category} - from ${name}`,
          _template: "table",
          _captcha: "false",
          "Ticket ID": generatedId,
          "Customer Name": name,
          "Customer Email": email,
          "Inquiry Subject": category,
          "Message": message,
          "Submission Time": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }),
      })
    } catch (err) {
      console.error("Failed to send contact inquiry:", err)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  return (
    <div className="py-16 sm:py-24 bg-[#fafbfc] min-h-screen text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Ambient Hero Backdrop (Seamless Masked Dot Grid + Glow) */}
      <div className="absolute inset-x-0 top-0 h-[480px] bg-dot-grid hero-mask pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[480px] glow-blue pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Mail className="h-3.5 w-3.5 text-blue-600" />
            <span>Support & Assistance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.12]">
            Contact PrepVisor Support
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Have questions about our plans, billing, or access? Reach out anytime and we’ll get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Merchant Details */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Business & Support Details
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  Operated by {COMPANY_CONFIG.legalEntity}
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-start gap-2.5">
                  <Building className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Operator Name</span>
                    <span className="text-slate-600">{COMPANY_CONFIG.proprietorName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Operational Address</span>
                    <span className="text-slate-600">{COMPANY_CONFIG.address.formatted}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Email</span>
                    <a
                      href={`mailto:${COMPANY_CONFIG.contact.email}`}
                      onClick={() =>
                        trackEvent("contact_link_clicked", {
                          channel: "email",
                          target: COMPANY_CONFIG.contact.email,
                        })
                      }
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      {COMPANY_CONFIG.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Phone</span>
                    <a
                      href={`tel:${COMPANY_CONFIG.contact.phone}`}
                      onClick={() =>
                        trackEvent("contact_link_clicked", {
                          channel: "phone",
                          target: COMPANY_CONFIG.contact.phone,
                        })
                      }
                      className="text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      {COMPANY_CONFIG.contact.displayPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Business Hours</span>
                    <span className="text-slate-600">{COMPANY_CONFIG.contact.hours}</span>
                    <span className="text-[11px] text-emerald-700 font-mono font-medium block mt-0.5">
                      Response time: {COMPANY_CONFIG.contact.tat}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grievance Officer */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-1 text-xs text-slate-700">
                <span className="font-semibold text-blue-700 block">Grievance Redressal Officer</span>
                <p className="text-slate-600">
                  Officer: <strong className="text-slate-900">{COMPANY_CONFIG.compliance.grievanceOfficer.name}</strong>
                </p>
                <p className="text-slate-600">
                  Email: <a href={`mailto:${COMPANY_CONFIG.compliance.grievanceOfficer.email}`} className="text-blue-600 underline">{COMPANY_CONFIG.compliance.grievanceOfficer.email}</a>
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">Send Us a Message</h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      We’ll get back to you at your registered email address.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Akash"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="akash@example.com"
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Subject
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none shadow-xs"
                    >
                      <option value="Billing & Payment">Billing & Payments</option>
                      <option value="Refund Request">Refund Request</option>
                      <option value="Access & Login">Access or Technical Question</option>
                      <option value="General Question">General Question</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="w-full rounded-xl border border-slate-300 bg-white p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 shadow-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-semibold text-white transition-all active:scale-[0.99] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Sending Message..." : "Send Message"}</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-4">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                    <CheckCircle2 className="h-7 w-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-slate-900">
                      Message Received!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-sm mx-auto">
                      Thank you, {name}. We will get back to you shortly at {email}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 max-w-xs mx-auto text-xs text-slate-600 font-mono">
                    Reference Ticket: <strong className="text-blue-600">{ticketId}</strong>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false)
                      setMessage("")
                    }}
                    className="rounded-xl bg-white hover:bg-slate-50 border border-slate-200 px-5 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
