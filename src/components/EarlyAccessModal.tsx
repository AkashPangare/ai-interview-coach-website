import React, { useState } from "react"
import { X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Gift } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

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
  const [targetRole, setTargetRole] = useState("Software Engineer")
  const [targetCompany, setTargetCompany] = useState("")
  const [timeline, setTimeline] = useState("14-30 Days")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [waitlistNumber, setWaitlistNumber] = useState(1842)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    const baseNumber = 1840 + Math.floor(Math.random() * 25) + 1
    setWaitlistNumber(baseNumber)
    setIsSubmitted(true)

    try {
      const waitlistRecord = {
        name,
        email,
        targetRole,
        targetCompany,
        timeline,
        selectedPlanId,
        joinedAt: new Date().toISOString(),
        waitlistNumber: baseNumber,
      }
      localStorage.setItem("prepvisor_waitlist", JSON.stringify(waitlistRecord))
    } catch {
      // ignore storage error
    }
  }

  const selectedTier = COMPANY_CONFIG.pricing.find((p) => p.id === selectedPlanId) || COMPANY_CONFIG.pricing[1]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl">
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
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Priority Access</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              Join the Early Access List
            </h2>
            <p className="text-sm text-slate-500 mb-5">
              Reserve your spot today to secure early access and lock in our founding member rate.
            </p>

            {/* Selected Plan Summary Pill */}
            <div className="mb-5 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-slate-600">Selected Plan:</span>
                <p className="text-sm font-bold text-slate-900">{selectedTier.name} ({selectedTier.days} Days)</p>
              </div>
              <div className="text-right">
                <p className="text-base font-extrabold text-blue-700">
                  ₹{selectedTier.priceINR}
                </p>
              </div>
            </div>

            {/* Waitlist Form */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Target Role
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Backend Engineer">Backend Engineer</option>
                    <option value="Frontend Engineer">Frontend Engineer</option>
                    <option value="Full Stack Engineer">Full Stack Engineer</option>
                    <option value="Engineering Lead / Manager">Engineering Lead / Manager</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Preparation Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                  >
                    <option value="7 Days (Urgent)">7 Days (Urgent)</option>
                    <option value="14 Days (Accelerated)">14 Days (Accelerated)</option>
                    <option value="30 Days (Standard)">30 Days (Standard)</option>
                    <option value="60+ Days (Comprehensive)">60+ Days (Comprehensive)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Target Company (Optional)
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  placeholder="e.g. Google, Amazon, Startup"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-700 active:scale-98 transition-all"
                >
                  <span>Claim Early Access</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero spam. We’ll notify you as soon as your spot opens.</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
                Early Access Reserved
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                You’re on the List, {name}!
              </h3>
              <p className="text-sm text-slate-600">
                Your waitlist priority spot is:
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 max-w-xs mx-auto">
              <span className="text-3xl font-extrabold text-blue-600">
                #{waitlistNumber}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                We'll reach out to {email}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-semibold text-emerald-700">
                <Gift className="h-4 w-4" />
                <span>Early Access Benefits:</span>
              </div>
              <ul className="space-y-1 text-slate-600 list-disc list-inside">
                <li>Locked-in discounted price on {selectedTier.name}</li>
                <li>Free initial study plan generation</li>
                <li>Priority email invitation</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-slate-100 hover:bg-slate-200 py-2.5 text-sm font-semibold text-slate-800 transition-colors"
            >
              Continue Exploring
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
