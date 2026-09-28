import { lazy, Suspense, useState, useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { trackPageView } from "@/lib/analytics"

const EarlyAccessModal = lazy(() => import("@/components/EarlyAccessModal").then((module) => ({ default: module.EarlyAccessModal })))
const HomePage = lazy(() => import("@/pages/HomePage").then((module) => ({ default: module.HomePage })))
const PricingPage = lazy(() => import("@/pages/PricingPage").then((module) => ({ default: module.PricingPage })))
const ContactPage = lazy(() => import("@/pages/ContactPage").then((module) => ({ default: module.ContactPage })))
const RefundPolicyPage = lazy(() => import("@/pages/RefundPolicyPage").then((module) => ({ default: module.RefundPolicyPage })))
const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage").then((module) => ({ default: module.PrivacyPolicyPage })))
const TermsPage = lazy(() => import("@/pages/TermsPage").then((module) => ({ default: module.TermsPage })))
const AboutPage = lazy(() => import("@/pages/AboutPage").then((module) => ({ default: module.AboutPage })))
const GuidesHubPage = lazy(() => import("@/pages/GuidesHubPage").then((module) => ({ default: module.GuidesHubPage })))
const GuideCategoryPage = lazy(() => import("@/pages/GuideCategoryPage").then((module) => ({ default: module.GuideCategoryPage })))
const GuideDetailPage = lazy(() => import("@/pages/GuideDetailPage").then((module) => ({ default: module.GuideDetailPage })))
const SystemDesignLandingPage = lazy(() => import("@/pages/SystemDesignLandingPage").then((module) => ({ default: module.SystemDesignLandingPage })))
const MockInterviewLandingPage = lazy(() => import("@/pages/MockInterviewLandingPage").then((module) => ({ default: module.MockInterviewLandingPage })))
const CodingPracticeLandingPage = lazy(() => import("@/pages/CodingPracticeLandingPage").then((module) => ({ default: module.CodingPracticeLandingPage })))
const RoadmapPage = lazy(() => import("@/pages/RoadmapPage").then((module) => ({ default: module.RoadmapPage })))
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((module) => ({ default: module.NotFoundPage })))

function RouteLoadingFallback() {
  return (
    <section className="min-h-[60vh] px-4 py-16" aria-busy="true" aria-live="polite" role="status">
      <span className="sr-only">Loading page…</span>
      <div aria-hidden="true" className="mx-auto max-w-5xl space-y-5 animate-pulse">
        <div className="h-8 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-full max-w-2xl rounded bg-slate-100" />
        <div className="h-4 w-5/6 max-w-2xl rounded bg-slate-100" />
        <div className="mt-10 h-48 rounded-2xl bg-slate-100" />
      </div>
    </section>
  )
}

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
        <Suspense fallback={<RouteLoadingFallback />}>
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
          <Route path="/guides/system-design" element={<GuideCategoryPage />} />
          <Route path="/guides/java-backend" element={<GuideCategoryPage />} />
          <Route path="/guides/dsa" element={<GuideCategoryPage />} />
          <Route path="/guides/:slug" element={<GuideDetailPage />} />
          {/* Catch-all 404 fallback */}
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
        </Suspense>
      </main>

      <Footer />

      {/* Early Access Modal */}
      {isWaitlistOpen && (
        <Suspense fallback={<div className="sr-only" role="status" aria-live="polite">Loading sign-up form…</div>}>
          <EarlyAccessModal
            isOpen={isWaitlistOpen}
            onClose={() => setIsWaitlistOpen(false)}
            selectedPlanId={selectedPlanId}
          />
        </Suspense>
      )}
    </div>
  )
}

export default App
