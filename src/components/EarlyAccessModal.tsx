import React, { useState } from "react"
import { X, CheckCircle2, ArrowRight, ShieldCheck, Zap, CreditCard, Lock } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { trackEvent } from "@/lib/analytics"

interface EarlyAccessModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlanId?: string
}

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({
  isOpen,
  onClose,
  selectedPlanId = "accelerator",
}) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [targetRole, setTargetRole] = useState("Software Engineer")
  const [customRole, setCustomRole] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderId, setOrderId] = useState("PV-84291")

  if (!isOpen) return null

  const selectedTier =
    COMPANY_CONFIG.pricing.find((p) => p.id === selectedPlanId) || COMPANY_CONFIG.pricing[1]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !phone) return

    const effectiveRole =
      targetRole === "Other" && customRole.trim() ? customRole.trim() : targetRole

    setIsSubmitting(true)
    const generatedOrderId = `PV-${Math.floor(10000 + Math.random() * 90000)}`
    setOrderId(generatedOrderId)

    try {
      const orderRecord = {
        name,
        email,
        phone: `+91 ${phone}`,
        targetRole: effectiveRole,
        selectedPlanId,
        orderId: generatedOrderId,
        amountINR: selectedTier.priceINR,
        submittedAt: new Date().toISOString(),
      }
      localStorage.setItem("prepvisor_order", JSON.stringify(orderRecord))
    } catch {
      // ignore storage error
    }

    trackEvent("lead_form_submitted", {
      plan_id: selectedPlanId,
      plan_name: selectedTier.name,
      amount: selectedTier.priceINR,
      order_id: generatedOrderId,
      target_role: effectiveRole,
    })
    trackEvent("begin_checkout", {
      plan_id: selectedPlanId,
      value: selectedTier.priceINR,
      currency: "INR",
      order_id: generatedOrderId,
    })

    try {
      await fetch(`https://formsubmit.co/ajax/${COMPANY_CONFIG.contact.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `[New Order #${generatedOrderId}] ${selectedTier.name} - ${name}`,
          _template: "table",
          _captcha: "false",
          "Order ID": generatedOrderId,
          "Customer Name": name,
          "Email Address": email,
          "Mobile Number": `+91 ${phone}`,
          "Selected Plan": `${selectedTier.name} (${selectedTier.days} Days)`,
          "Payable Amount": `₹${selectedTier.priceINR} (All taxes incl.)`,
          "Target Role": effectiveRole,
          "Submission Time": new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }),
      })
    } catch (err) {
      console.error("Order notification error:", err)
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-blue-600 mb-1.5 font-semibold">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <span>Checkout & Activation</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-900 mb-1.5">
              Order Summary & Registration
            </h2>
            <p className="text-xs text-slate-600 mb-5">
              Complete your registration below to proceed with your selected preparation pass.
            </p>

            {/* Selected Plan Summary Pill */}
            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-blue-700 font-semibold">Selected Plan:</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedTier.name} ({selectedTier.days} Days)
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  One-time payment · Instant digital access
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-mono font-bold text-slate-900">
                  ₹{selectedTier.priceINR}
                </p>
                <span className="text-[10px] text-emerald-700 font-mono font-medium">
                  (Incl. of all taxes)
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Number (for Order & Access OTP) *
                </label>
                <div className="flex rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
                  <span className="inline-flex items-center px-3 bg-slate-100 text-slate-600 text-xs font-mono border-r border-slate-300">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full bg-transparent px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Role / Primary Track
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                >
                  <option value="Software Engineer">Software Engineer (General)</option>
                  <option value="Backend Engineer">Backend Engineer (Java / Python / Node)</option>
                  <option value="Frontend Engineer">Frontend Engineer (React / Next.js / TypeScript)</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="Engineering Lead / Manager">Engineering Lead / Technical Architect</option>
                  <option value="Other">Other (Specify Custom Role)</option>
                </select>
              </div>

              {targetRole === "Other" && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Specify Your Custom Role *
                  </label>
                  <input
                    type="text"
                    required
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                    placeholder="e.g. DevOps / SRE, Data Engineer, iOS / Android Developer"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-sm font-semibold text-white shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Lock className="h-4 w-4" />
                  <span>
                    {isSubmitting
                      ? "Processing Registration..."
                      : `Proceed to Payment (₹${selectedTier.priceINR})`}
                  </span>
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>100% Secure Checkout · Instant Access · 7-Day Refund Guarantee</span>
              </div>
            </form>
          </div>
        ) : (
          /* Order Confirmation Screen */
          <div className="text-center py-3 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-mono text-emerald-700 font-medium">
                Order Registered
              </span>
              <h3 className="text-2xl font-semibold text-slate-900 mt-2">
                Thank You, {name}!
              </h3>
              <p className="text-xs text-slate-600">
                Your order registration has been received successfully.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-blue-600">#{orderId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Plan & Validity:</span>
                <span className="font-semibold text-slate-900">{selectedTier.name} ({selectedTier.days} Days)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Amount:</span>
                <span className="font-mono font-bold text-slate-900">₹{selectedTier.priceINR} (All taxes incl.)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Contact:</span>
                <span className="font-mono text-slate-700">{email}</span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 text-left text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-blue-700">
                <Zap className="h-4 w-4 text-blue-600" />
                <span>Instant Digital Fulfillment:</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Your tax invoice and direct activation link have been generated and queued for <strong>{email}</strong>. Access is provisioned instantly within 0 to 15 minutes.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 py-2.5 text-sm font-semibold text-white transition-colors"
            >
              Return to Website
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EarlyAccessModal
