// Keep route chunks separate, while allowing navigation links to warm them ahead of a click.
export const routeModules = {
  home: () => import("@/pages/HomePage"),
  pricing: () => import("@/pages/PricingPage"),
  contact: () => import("@/pages/ContactPage"),
  refundPolicy: () => import("@/pages/RefundPolicyPage"),
  privacyPolicy: () => import("@/pages/PrivacyPolicyPage"),
  terms: () => import("@/pages/TermsPage"),
  about: () => import("@/pages/AboutPage"),
  guidesHub: () => import("@/pages/GuidesHubPage"),
  guideCategory: () => import("@/pages/GuideCategoryPage"),
  guideDetail: () => import("@/pages/GuideDetailPage"),
  systemDesign: () => import("@/pages/SystemDesignLandingPage"),
  mockInterview: () => import("@/pages/MockInterviewLandingPage"),
  codingPractice: () => import("@/pages/CodingPracticeLandingPage"),
  roadmap: () => import("@/pages/RoadmapPage"),
  resumeStudio: () => import("@/pages/ResumeStudioPage"),
  notFound: () => import("@/pages/NotFoundPage"),
}

const routePaths: Record<string, () => Promise<unknown>> = {
  "/": routeModules.home,
  "/pricing": routeModules.pricing,
  "/contact": routeModules.contact,
  "/refund-policy": routeModules.refundPolicy,
  "/privacy": routeModules.privacyPolicy,
  "/terms": routeModules.terms,
  "/about": routeModules.about,
  "/guides": routeModules.guidesHub,
  "/guides/system-design": routeModules.guideCategory,
  "/guides/java-backend": routeModules.guideCategory,
  "/guides/dsa": routeModules.guideCategory,
  "/system-design": routeModules.systemDesign,
  "/mock-interview": routeModules.mockInterview,
  "/coding-practice": routeModules.codingPractice,
  "/roadmap": routeModules.roadmap,
  "/resume-studio": routeModules.resumeStudio,
}

const pending = new Map<string, Promise<unknown>>()

export function preloadRoute(pathname: string): void {
  const loader = routePaths[pathname] ?? (pathname.startsWith("/guides/") ? routeModules.guideDetail : undefined)
  if (!loader || pending.has(pathname)) return
  const promise = loader()
  pending.set(pathname, promise)
  // A transient network error must not make a later click permanently fail.
  void promise.catch(() => pending.delete(pathname))
}

export const commonRoutePaths = [
  "/resume-studio", "/roadmap", "/system-design", "/mock-interview",
  "/coding-practice", "/guides", "/pricing",
]
