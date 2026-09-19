import { useState, useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { EarlyAccessModal } from "@/components/EarlyAccessModal"
import { HomePage } from "@/pages/HomePage"
import { PricingPage } from "@/pages/PricingPage"
import { ContactPage } from "@/pages/ContactPage"
import { RefundPolicyPage } from "@/pages/RefundPolicyPage"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage"
import { TermsPage } from "@/pages/TermsPage"
import { AboutPage } from "@/pages/AboutPage"
import { GuidesHubPage } from "@/pages/GuidesHubPage"
import { GuideDetailPage } from "@/pages/GuideDetailPage"

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export function App() {
  // Early access modal state
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState("accelerator")

  const handleOpenWaitlist = () => {
    setSelectedPlanId("accelerator")
    setIsWaitlistOpen(true)
  }

  const handleOpenWaitlistWithPlan = (planId: string) => {
    setSelectedPlanId(planId)
    setIsWaitlistOpen(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <ScrollToTop />
      <Navbar
        onOpenWaitlist={handleOpenWaitlist}
      />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenWaitlist={handleOpenWaitlist}
              />
            }
          />
          <Route
            path="/pricing"
            element={
              <PricingPage
                onOpenWaitlistWithPlan={handleOpenWaitlistWithPlan}
              />
            }
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/about"
            element={<AboutPage onOpenWaitlist={handleOpenWaitlist} />}
          />
          <Route path="/guides" element={<GuidesHubPage />} />
          <Route path="/guides/:slug" element={<GuideDetailPage />} />
          {/* Catch-all fallback */}
          <Route
            path="*"
            element={
              <HomePage
                onOpenWaitlist={handleOpenWaitlist}
              />
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Early Access Modal */}
      <EarlyAccessModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        selectedPlanId={selectedPlanId}
      />
    </div>
  )
}

export default App
