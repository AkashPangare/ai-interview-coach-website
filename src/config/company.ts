import { PAID_PLAN_PRICES } from "./pricing-data.js"

export interface PricingTier {
  id: string
  name: string
  subtitle: string
  badge?: string
  days: number
  priceINR: number
  priceUSD: number
  originalPriceINR: number
  originalPriceUSD: number
  features: string[]
  recommended?: boolean
}

export interface AddOnPack {
  id: string
  name: string
  priceINR: number
  priceUSD: number
  description: string
  boostAmount: number
  featureKey: string
}

export const COMPANY_CONFIG = {
  brandName: "PrepVisor",
  legalEntity: "PrepVisor (Operated by Divya Rajkumar Almelkar, Individual)",
  proprietorName: "Divya Rajkumar Almelkar",
  businessType: "Individual",
  industry: "EdTech & Interactive Educational SaaS Software",
  websiteUrl: "https://prepvisor.in",
  productSchemaDescription: "An interactive AI tech interview coach featuring time-calibrated preparation roadmaps, DSA coding studio with terminal stdout, infinite system design whiteboard with scale math, and voice STAR behavioral mock interviews.",
  appUrl: (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_APP_URL || "https://app.prepvisor.in",
  
  // Physical & Communication Address
  address: {
    line1: "Flat 201,Aurum Residencies,Maruthi Nagar,BTM Layout stage 1",
    line2: "Near RS High School,9th cross, Madiwala",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560068",
    country: "India",
    formatted: "Flat 201,Aurum Residencies,Maruthi Nagar,BTM Layout stage 1, Bengaluru, Karnataka 560068, India",
  },

  // Contact Details
  contact: {
    email: "support@prepvisor.in",
    phone: "+91 7249778116",
    displayPhone: "+91 7249778116",
    hours: "Monday – Friday, 9:30 AM to 6:30 PM IST",
    tat: "Within 24 to 48 business hours",
  },

  // Statutory & Compliance Policies
  compliance: {
    governingLaw: "Laws of India",
    jurisdiction: "Bengaluru, Karnataka, India",
    refundWindowDays: 7,
    refundProcessingDays: "5 to 7 business working days",
    deliveryMode: "Instant Electronic Digital Access (within 0–15 minutes)",
    grievanceOfficer: {
      name: "Divya Rajkumar Almelkar",
      title: "Grievance Officer & Founder",
      email: "grievance@prepvisor.in",
      phone: "+91 7249778116",
      address: "Flat 201,Aurum Residencies,Maruthi Nagar,BTM Layout stage 1, Bengaluru, Karnataka 560068, India",
    },
  },

  // PrepVisor free tier and fixed-duration preparation passes.
  pricing: [
    {
      id: "FREE",
      name: "Free Plan",
      subtitle: "Explore personalized AI roadmap generation and essential quiz assessments",
      badge: "Free Forever",
      days: -1,
      priceINR: 0,
      priceUSD: 0,
      originalPriceINR: 0,
      originalPriceUSD: 0,
      features: [
        "1 Active Target Preparation Roadmap",
        "3 Multi-Turn AI Mock Interviews",
        "1 Technical Diagnostic Assessment",
        "10 AI Coach Questions & Explanations",
        "5 Practice Questions per Topic",
        "Instant Scoring & Feedback",
      ],
    },
    {
      id: "PLAN_7",
      name: "7-Day Sprint",
      subtitle: "Last-mile intensive interview prep with coding arena & rebalancing",
      badge: "Sprint Prep",
      days: 7,
      priceINR: PAID_PLAN_PRICES[0].priceINR,
      priceUSD: PAID_PLAN_PRICES[0].priceUSD,
      originalPriceINR: 399,
      originalPriceUSD: 0,
      features: [
        "7-Day Focused Preparation Pass",
        "3 Active Target Roadmaps",
        "7 Full AI Mock Interviews",
        "3 Technical Diagnostic Assessments",
        "50 AI Coach Questions & Explanations",
        "Interactive Coding Studio (9 Languages)",
        "Dynamic 1-Click Schedule Rebalancing",
        "Email Support within 48 hours",
      ],
    },
    {
      id: "PLAN_14",
      name: "14-Day Grind",
      subtitle: "Complete toolkit with System Design studio and 15 mock sessions",
      badge: "Most Popular",
      days: 14,
      priceINR: PAID_PLAN_PRICES[1].priceINR,
      priceUSD: PAID_PLAN_PRICES[1].priceUSD,
      originalPriceINR: 699,
      originalPriceUSD: 0,
      recommended: true,
      features: [
        "14-Day Comprehensive Preparation Pass",
        "6 Active Target Roadmaps",
        "15 Full AI Mock Interviews",
        "7 Technical Diagnostic Assessments",
        "100 AI Coach In-Depth Messages",
        "Interactive Coding Studio (9 Languages)",
        "System Design Architecture Studio",
        "Dynamic Schedule Rebalancing",
        "Priority Support within 24 hours",
      ],
    },
    {
      id: "PLAN_30",
      name: "30-Day Pro",
      subtitle: "For product company switchers needing behavioral & deep design drills",
      badge: "Best Value",
      days: 30,
      priceINR: PAID_PLAN_PRICES[2].priceINR,
      priceUSD: PAID_PLAN_PRICES[2].priceUSD,
      originalPriceINR: 999,
      originalPriceUSD: 0,
      features: [
        "30-Day Full Career Accelerator Pass",
        "15 Active Target Roadmaps",
        "30 Full AI Mock Interviews",
        "15 Technical Diagnostic Assessments",
        "300 AI Coach Messages",
        "STAR Behavioral Pattern Analysis",
        "Communication & Delivery Scoring",
        "Full Longitudinal Performance Analytics",
        "Coding + System Design Studios",
        "Priority Support",
      ],
    },
    {
      id: "PLAN_90",
      name: "90-Day Elite",
      subtitle: "Long-term placement and senior/staff multi-company mastery",
      badge: "All-Inclusive",
      days: 90,
      priceINR: PAID_PLAN_PRICES[3].priceINR,
      priceUSD: PAID_PLAN_PRICES[3].priceUSD,
      originalPriceINR: 2599,
      originalPriceUSD: 0,
      features: [
        "90-Day Multi-Company Mastery Pass",
        "30 Active Target Roadmaps",
        "60 Full AI Mock Interviews",
        "35 Technical Diagnostic Assessments",
        "600 AI Coach Messages",
        "Priority Low-Latency LLM Engine",
        "STAR Behavioral & Communication Scoring",
        "Coding + System Design Architecture Studios",
        "VIP Direct Support & Guidance",
      ],
    },
  ] as PricingTier[],

  // Flexible Add-On Booster Packs
  addOns: [
    {
      id: "coach-booster-100",
      name: "Coach Booster Pack",
      priceINR: 99,
      priceUSD: 3,
      description: "Add 100 in-depth AI Coach messages to your active plan.",
      boostAmount: 100,
      featureKey: "FEAT_COACH_MESSAGES",
    },
    {
      id: "mock-pack-10",
      name: "Mock Interview Pack",
      priceINR: 100,
      priceUSD: 5,
      description: "Add 10 complete multi-turn mock interview sessions.",
      boostAmount: 10,
      featureKey: "FEAT_MOCK_SESSIONS",
    },
    {
      id: "assessment-pack-5",
      name: "Technical Assessment Pack",
      priceINR: 100,
      priceUSD: 4,
      description: "Add 5 complete timed technical assessment evaluations.",
      boostAmount: 5,
      featureKey: "FEAT_TECHNICAL_ASSESSMENTS",
    },
    {
      id: "extra-roadmap-1",
      name: "Extra Roadmap Slot",
      priceINR: 79,
      priceUSD: 2,
      description: "Unlock 1 additional active target roadmap for multi-company prep.",
      boostAmount: 1,
      featureKey: "FEAT_ROADMAPS_CREATED",
    },
  ] as AddOnPack[],
}
