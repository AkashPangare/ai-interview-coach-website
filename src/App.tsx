import { lazy, Suspense, useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { trackPageView } from "@/lib/analytics"

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
const ResumeStudioPage = lazy(() => import("@/pages/ResumeStudioPage").then((module) => ({ default: module.ResumeStudioPage })))
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
  return (
    <div className="flex min-h-screen flex-col bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white">
      <RouteTracker />
      <Navbar />

      <main className="flex-1">
        <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage />
            }
          />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/refund-policy" element={<RefundPolicyPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route
            path="/about"
            element={<AboutPage />}
          />
          <Route path="/system-design" element={<SystemDesignLandingPage />} />
          <Route path="/mock-interview" element={<MockInterviewLandingPage />} />
          <Route path="/coding-practice" element={<CodingPracticeLandingPage />} />
          <Route path="/resume-studio" element={<ResumeStudioPage />} />
          <Route
            path="/roadmap"
            element={
              <RoadmapPage />
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

    </div>
  )
}

export default App
