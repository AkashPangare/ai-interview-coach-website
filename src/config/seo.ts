import { COMPANY_CONFIG } from "./company.ts"
import type { Guide } from "../data/guides.ts"
import { GUIDE_HUB_CATEGORIES } from "./guideCategories.ts"

export type RouteSeoKey =
  | "home"
  | "resumeStudio"
  | "roadmap"
  | "codingPractice"
  | "systemDesign"
  | "mockInterview"
  | "pricing"
  | "about"
  | "guides"
  | "guideSystemDesign"
  | "guideJavaBackend"
  | "guideDsa"
  | "contact"
  | "refundPolicy"
  | "privacy"
  | "terms"
  | "notFound"

export interface SeoDefinition {
  pathname: string
  title: string
  description: string
  canonicalPath: string
  ogTitle?: string
  ogDescription?: string
  ogType?: "website" | "article"
  twitterTitle?: string
  twitterDescription?: string
  keywords?: string
  indexable: boolean
}

export interface ResolvedSeoMetadata extends SeoDefinition {
  canonicalUrl: string
  socialImageUrl: string
  socialImageAlt: string
  socialImageWidth: 1200
  socialImageHeight: 630
  ogTitle: string
  ogDescription: string
  ogType: "website" | "article"
  twitterTitle: string
  twitterDescription: string
}

export function absoluteSiteUrl(path: string): string {
  if (!path.startsWith("/")) throw new Error(`Site path must start with '/': ${path}`)
  return `${COMPANY_CONFIG.websiteUrl}${path}`
}

export function resolveSeoMetadata(definition: SeoDefinition): ResolvedSeoMetadata {
  return {
    ...definition,
    canonicalUrl: absoluteSiteUrl(definition.canonicalPath),
    socialImageUrl: absoluteSiteUrl("/og-image.png"),
    socialImageAlt: "PrepVisor — AI interview preparation for software engineers",
    socialImageWidth: 1200,
    socialImageHeight: 630,
    ogTitle: definition.ogTitle ?? definition.title,
    ogDescription: definition.ogDescription ?? definition.description,
    ogType: definition.ogType ?? "website",
    twitterTitle: definition.twitterTitle ?? definition.ogTitle ?? definition.title,
    twitterDescription: definition.twitterDescription ?? definition.ogDescription ?? definition.description,
  }
}

const routeDefinitions: Record<RouteSeoKey, SeoDefinition> = {
  home: {
    pathname: "/",
    title: "AI Interview Preparation for Software Engineers | PrepVisor",
    description: "Build tailored resumes, compare them with job descriptions, and prepare for software engineering interviews with roadmaps, coding practice, system design and AI mock interviews.",
    canonicalPath: "/",
    keywords: "AI tech interview coach, system design interview simulator, DSA coding practice terminal stdout, voice mock interview STAR method, tech interview study roadmap, Java interview prep, software engineer mock interview, PrepVisor",
    indexable: true,
  },
  resumeStudio: {
    pathname: "/resume-studio",
    title: "Resume Studio — Build, Tailor & Review Your Resume | PrepVisor",
    description: "Create a career profile, tailor resume versions to target jobs, review requirement evidence and resume quality, then turn gaps into an interview preparation plan.",
    canonicalPath: "/resume-studio",
    keywords: "resume builder, tailored resume, job description resume match, resume quality check, recruiter screen, career profile, PrepVisor Resume Studio",
    indexable: true,
  },
  roadmap: {
    pathname: "/roadmap",
    title: "Software Engineer Interview Preparation Plan & Roadmap | PrepVisor",
    description: "Build a software engineer interview preparation plan around your target role, interview date, and available study time. Organize coding, system design, and mock interview practice in one roadmap.",
    canonicalPath: "/roadmap",
    keywords: "tech interview roadmap, daily pacing schedule, interview study planner, system design preparation timeline, leetcode study plan 30 days, java interview roadmap",
    indexable: true,
  },
  codingPractice: {
    pathname: "/coding-practice",
    title: "DSA Interview Practice Online — Coding Problems & AI Feedback | PrepVisor",
    description: "Practice DSA interview problems in PrepVisor's coding workspace. Write code, run tests, inspect program output, and review complexity feedback as you work through coding challenges.",
    canonicalPath: "/coding-practice",
    keywords: "java dsa practice online, coding interview practice java, live code execution browser terminal, leetcode alternative java, big-o complexity analyzer",
    indexable: true,
  },
  systemDesign: {
    pathname: "/system-design",
    title: "System Design Interview Practice & Simulator | PrepVisor",
    description: "Practice system design interviews on an interactive architecture canvas. Model components, reason about QPS and storage capacity, examine single points of failure, and review architecture feedback.",
    canonicalPath: "/system-design",
    keywords: "system design interview practice free, how to design twitter interview, distributed systems whiteboard, system design simulator, scale math capacity estimation",
    indexable: true,
  },
  mockInterview: {
    pathname: "/mock-interview",
    title: "AI Mock Interview Practice for Technical & Behavioral Rounds | PrepVisor",
    description: "Practice technical and behavioral interview questions with PrepVisor's multi-turn mock interview tool. Use speech-to-text input where available, then review feedback on your responses and communication.",
    canonicalPath: "/mock-interview",
    keywords: "AI mock interview free, behavioral interview practice with AI, STAR method interview practice online, speech to text interview prep, amazon leadership principles mock interview",
    indexable: true,
  },
  pricing: {
    pathname: "/pricing",
    title: "PrepVisor Pricing — Resume Studio & Interview Prep Plans",
    description: "Compare 14-, 30-, and 90-day Resume Studio, Interview Prep, and Complete Journey passes, with clear allowances and one-time pricing.",
    canonicalPath: "/pricing",
    keywords: "prepvisor pricing, resume studio pricing, interview preparation passes, combined resume and interview plan",
    indexable: true,
  },
  about: {
    pathname: "/about",
    title: "About PrepVisor — Engineering Interview Preparation Built by Engineers",
    description: "Learn why PrepVisor was created. Built by engineers in Bengaluru to solve fragmented, time-blind tech interview prep with dynamic daily pacing, live terminal execution, and distributed system design.",
    canonicalPath: "/about",
    keywords: "about prepvisor, interview prep platform, divya rajkumar almelkar, tech interview coach bangalore",
    indexable: true,
  },
  guides: {
    pathname: "/guides",
    title: "Technical Interview Study Guides & Architecture Blueprints | PrepVisor",
    description: "Free comprehensive engineering interview guides. Master System Design architectures, Java concurrency internals, and coding patterns with real-world case studies.",
    canonicalPath: "/guides",
    keywords: "system design interview guide, java concurrency interview questions, technical interview study guides, spring boot microservices interview, lru cache implementation",
    ogTitle: "Technical Interview Guides | PrepVisor",
    ogDescription: "Comprehensive engineering guides on System Design, Java Concurrency, and coding patterns.",
    indexable: true,
  },
  guideSystemDesign: {
    pathname: "/guides/system-design",
    title: GUIDE_HUB_CATEGORIES.find((category) => category.id === "system-design")!.hubSeo!.title,
    description: GUIDE_HUB_CATEGORIES.find((category) => category.id === "system-design")!.hubSeo!.description,
    canonicalPath: "/guides/system-design",
    indexable: true,
  },
  guideJavaBackend: {
    pathname: "/guides/java-backend",
    title: GUIDE_HUB_CATEGORIES.find((category) => category.id === "java-backend")!.hubSeo!.title,
    description: GUIDE_HUB_CATEGORIES.find((category) => category.id === "java-backend")!.hubSeo!.description,
    canonicalPath: "/guides/java-backend",
    indexable: true,
  },
  guideDsa: {
    pathname: "/guides/dsa",
    title: GUIDE_HUB_CATEGORIES.find((category) => category.id === "dsa")!.hubSeo!.title,
    description: GUIDE_HUB_CATEGORIES.find((category) => category.id === "dsa")!.hubSeo!.description,
    canonicalPath: "/guides/dsa",
    indexable: true,
  },
  contact: {
    pathname: "/contact",
    title: "Contact PrepVisor — Customer Support & Enterprise Inquiries",
    description: "Get in touch with PrepVisor support team and founders. Reach us via email, phone, or office address in Bengaluru for customer assistance, billing, or enterprise cohort inquiries.",
    canonicalPath: "/contact",
    keywords: "contact prepvisor, customer support prepvisor, interview prep help, prepvisor bangalore address",
    indexable: true,
  },
  refundPolicy: {
    pathname: "/refund-policy",
    title: "Cancellation & Refund Policy | PrepVisor",
    description: "Official Cancellation and Refund Policy for PrepVisor digital preparation passes. Details on 7-day refund eligibility, non-refundable cases, and payment reversal timelines.",
    canonicalPath: "/refund-policy",
    indexable: true,
  },
  privacy: {
    pathname: "/privacy",
    title: "Privacy Policy | PrepVisor",
    description: "Privacy Policy explaining how PrepVisor handles personal information in compliance with the Digital Personal Data Protection Act (DPDP Act) 2023.",
    canonicalPath: "/privacy",
    indexable: true,
  },
  terms: {
    pathname: "/terms",
    title: "Terms of Service | PrepVisor",
    description: "Terms of Service and user agreement governing access to PrepVisor educational software platform and prep passes.",
    canonicalPath: "/terms",
    indexable: true,
  },
  notFound: {
    pathname: "*",
    title: "404 - Page Not Found | PrepVisor",
    description: "The page you are looking for does not exist on PrepVisor. Explore our System Design simulator, DSA coding studio, or voice mock interviews.",
    canonicalPath: "/404.html",
    indexable: false,
  },
}

export const SEO_ROUTES: Record<RouteSeoKey, ResolvedSeoMetadata> = Object.fromEntries(
  Object.entries(routeDefinitions).map(([key, definition]) => [key, resolveSeoMetadata(definition)]),
) as Record<RouteSeoKey, ResolvedSeoMetadata>

export function seoForPath(pathname: string): ResolvedSeoMetadata | undefined {
  return Object.values(SEO_ROUTES).find((metadata) => metadata.pathname === pathname)
}

export function seoForGuide(guide: Pick<Guide, "slug" | "seoTitle" | "metaDescription" | "title" | "keywords">): ResolvedSeoMetadata {
  return resolveSeoMetadata({
    pathname: `/guides/${guide.slug}`,
    title: `${guide.seoTitle} | ${COMPANY_CONFIG.brandName}`,
    description: guide.metaDescription,
    canonicalPath: `/guides/${guide.slug}`,
    ogTitle: guide.title,
    ogDescription: guide.metaDescription,
    ogType: "article",
    twitterTitle: guide.title,
    twitterDescription: guide.metaDescription,
    keywords: guide.keywords.join(", "),
    indexable: true,
  })
}

export const PRODUCT_PAGE_INTROS = {
  roadmap: "PrepVisor's interview roadmap organizes preparation around your target role, interview date, and available study hours. It brings coding, system design, and mock interview work into a daily plan, with schedule rebalancing available when your preparation timeline or priorities change throughout preparation.",
  codingPractice: "Use PrepVisor's coding workspace to practice data-structure and algorithm problems. Write code in the supported languages, run tests, inspect program output, and review complexity feedback as you work through a challenge. This supports practice from implementation through test review for each coding challenge.",
  systemDesign: "Practice an architecture problem on PrepVisor's interactive system design canvas. Add and connect system components, reason about QPS and storage capacity, inspect single points of failure, and use the resulting feedback to revisit your design choices. You can work through the architecture as a visual model.",
  mockInterview: "PrepVisor's mock interview tool supports multi-turn technical and behavioral practice. Respond to role-calibrated questions, use speech-to-text input where available, and review feedback on your answers, technical depth, and communication. The review can help you reflect on how to make a response clearer.",
} as const
