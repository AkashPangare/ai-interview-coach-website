import { lazy, Suspense, useEffect } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { trackPageView } from "@/lib/analytics"
import { commonRoutePaths, preloadRoute, routeModules } from "@/lib/routeModules"

const HomePage = lazy(() => routeModules.home().then((module) => ({ default: module.HomePage })))
const PricingPage = lazy(() => routeModules.pricing().then((module) => ({ default: module.PricingPage })))
const ContactPage = lazy(() => routeModules.contact().then((module) => ({ default: module.ContactPage })))
const RefundPolicyPage = lazy(() => routeModules.refundPolicy().then((module) => ({ default: module.RefundPolicyPage })))
const PrivacyPolicyPage = lazy(() => routeModules.privacyPolicy().then((module) => ({ default: module.PrivacyPolicyPage })))
const TermsPage = lazy(() => routeModules.terms().then((module) => ({ default: module.TermsPage })))
const AboutPage = lazy(() => routeModules.about().then((module) => ({ default: module.AboutPage })))
const GuidesHubPage = lazy(() => routeModules.guidesHub().then((module) => ({ default: module.GuidesHubPage })))
const GuideCategoryPage = lazy(() => routeModules.guideCategory().then((module) => ({ default: module.GuideCategoryPage })))
const GuideDetailPage = lazy(() => routeModules.guideDetail().then((module) => ({ default: module.GuideDetailPage })))
const SystemDesignLandingPage = lazy(() => routeModules.systemDesign().then((module) => ({ default: module.SystemDesignLandingPage })))
const MockInterviewLandingPage = lazy(() => routeModules.mockInterview().then((module) => ({ default: module.MockInterviewLandingPage })))
const CodingPracticeLandingPage = lazy(() => routeModules.codingPractice().then((module) => ({ default: module.CodingPracticeLandingPage })))
const RoadmapPage = lazy(() => routeModules.roadmap().then((module) => ({ default: module.RoadmapPage })))
const ResumeStudioPage = lazy(() => routeModules.resumeStudio().then((module) => ({ default: module.ResumeStudioPage })))
const NotFoundPage = lazy(() => routeModules.notFound().then((module) => ({ default: module.NotFoundPage })))

function RoutePreloader() {
  useEffect(() => {
    const warmLink = (event: Event) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const link = target.closest<HTMLAnchorElement>('a[href^="/"]')
      if (link) preloadRoute(new URL(link.href).pathname)
    }
    document.addEventListener("pointerover", warmLink, { passive: true })
    document.addEventListener("focusin", warmLink)
    document.addEventListener("touchstart", warmLink, { passive: true })

    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
    let idleId: number | undefined
    let scheduledAsIdle = false
    if (!connection?.saveData && connection?.effectiveType !== "2g" && connection?.effectiveType !== "slow-2g") {
      if (typeof window.requestIdleCallback === "function") {
        idleId = window.requestIdleCallback(() => commonRoutePaths.forEach(preloadRoute), { timeout: 2500 })
        scheduledAsIdle = true
      } else {
        idleId = setTimeout(() => commonRoutePaths.forEach(preloadRoute), 1500)
      }
    }
    return () => {
      document.removeEventListener("pointerover", warmLink)
      document.removeEventListener("focusin", warmLink)
      document.removeEventListener("touchstart", warmLink)
      if (idleId !== undefined) {
        if (scheduledAsIdle) window.cancelIdleCallback(idleId)
        else clearTimeout(idleId)
      }
    }
  }, [])
  return null
}

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
      <RoutePreloader />
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
