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
import { SystemDesignLandingPage } from "@/pages/SystemDesignLandingPage"
import { MockInterviewLandingPage } from "@/pages/MockInterviewLandingPage"
import { CodingPracticeLandingPage } from "@/pages/CodingPracticeLandingPage"
import { RoadmapPage } from "@/pages/RoadmapPage"
import { NotFoundPage } from "@/pages/NotFoundPage"
import { trackPageView } from "@/lib/analytics"

// Scroll to top and track SPA page views on route changes
function RouteTracker() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    // Small delay ensures child page's usePageSeo or useEffect has updated document.title
    const timer = setTimeout(() => {
      trackPageView(document.title, window.location.href, pathname + search)
    }, 50)
    return () => clearTimeout(timer)
  }, [pathname, search])
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
    <div className="flex min-h-screen flex-col bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white">
      <RouteTracker />
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
          <Route path="/system-design" element={<SystemDesignLandingPage />} />
          <Route path="/mock-interview" element={<MockInterviewLandingPage />} />
          <Route path="/coding-practice" element={<CodingPracticeLandingPage />} />
          <Route
            path="/roadmap"
            element={
              <RoadmapPage
                onOpenWaitlist={handleOpenWaitlist}
              />
            }
          />
          <Route path="/guides" element={<GuidesHubPage />} />
          <Route path="/guides/:slug" element={<GuideDetailPage />} />
          {/* Catch-all 404 fallback */}
          <Route
            path="*"
            element={<NotFoundPage />}
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
