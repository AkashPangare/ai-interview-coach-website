export type PlanDuration = 14 | 30 | 90
export type ProductKind = "resume" | "interview" | "bundle"

export interface ResumeAllowance {
  generations: number
  savedJobs: number
  matches: number
  qualityChecks: number
  recruiterReviews: number
  gapAnalyses: number
  optimizations: number
}

export interface PricingPreviewPlan {
  id: string
  kind: ProductKind
  days: PlanDuration
  name: string
  subtitle: string
  priceINR: number
  interviewPlanId?: string
}

export const PLAN_DURATIONS: PlanDuration[] = [14, 30, 90]

export const RESUME_ALLOWANCES: Record<PlanDuration, ResumeAllowance> = {
  14: { generations: 5, savedJobs: 10, matches: 10, qualityChecks: 5, recruiterReviews: 2, gapAnalyses: 2, optimizations: 5 },
  30: { generations: 10, savedJobs: 20, matches: 20, qualityChecks: 10, recruiterReviews: 5, gapAnalyses: 5, optimizations: 10 },
  90: { generations: 25, savedJobs: 50, matches: 50, qualityChecks: 25, recruiterReviews: 12, gapAnalyses: 12, optimizations: 25 },
}

export const PRICING_PREVIEW: PricingPreviewPlan[] = [
  { id: "RESUME_14", kind: "resume", days: 14, name: "Resume Studio", subtitle: "Build, tailor and review applications", priceINR: 249 },
  { id: "PLAN_14", kind: "interview", days: 14, name: "Interview Prep", subtitle: "Practice for your next interview", priceINR: 349, interviewPlanId: "PLAN_14" },
  { id: "BUNDLE_14", kind: "bundle", days: 14, name: "Complete Journey", subtitle: "Resume Studio and Interview Prep together", priceINR: 499 },
  { id: "RESUME_30", kind: "resume", days: 30, name: "Resume Studio", subtitle: "Build, tailor and review applications", priceINR: 399 },
  { id: "PLAN_30", kind: "interview", days: 30, name: "Interview Prep", subtitle: "Practice for your next interview", priceINR: 499, interviewPlanId: "PLAN_30" },
  { id: "BUNDLE_30", kind: "bundle", days: 30, name: "Complete Journey", subtitle: "Resume Studio and Interview Prep together", priceINR: 699 },
  { id: "RESUME_90", kind: "resume", days: 90, name: "Resume Studio", subtitle: "Build, tailor and review applications", priceINR: 999 },
  { id: "PLAN_90", kind: "interview", days: 90, name: "Interview Prep", subtitle: "Practice for your next interview", priceINR: 1299, interviewPlanId: "PLAN_90" },
  { id: "BUNDLE_90", kind: "bundle", days: 90, name: "Complete Journey", subtitle: "Resume Studio and Interview Prep together", priceINR: 1799 },
]

export const FREE_RESUME_ALLOWANCE: ResumeAllowance = {
  generations: 1,
  savedJobs: 1,
  matches: 1,
  qualityChecks: 1,
  recruiterReviews: 1,
  gapAnalyses: 1,
  optimizations: 0,
}

export const APPLICATION_PACK = {
  priceINR: 149,
  generations: 5,
  matches: 10,
  qualityChecks: 5,
  recruiterReviews: 2,
  gapAnalyses: 2,
  optimizations: 5,
} as const
