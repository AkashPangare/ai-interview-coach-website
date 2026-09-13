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
  appUrl: (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_APP_URL) || "https://app.prepvisor.in",
  
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

  // Authentic PrepVisor subscription plans matching backend & application
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
      priceINR: 199,
      priceUSD: 4,
      originalPriceINR: 399,
      originalPriceUSD: 8,
      features: [
        "7-Day Focused Preparation Pass",
        "3 Active Target Roadmaps",
        "7 Full AI Mock Interviews",
        "3 Technical Diagnostic Assessments",
        "50 AI Coach Questions & Explanations",
        "Interactive Coding Studio & Sandbox",
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
      priceINR: 349,
      priceUSD: 7,
      originalPriceINR: 699,
      originalPriceUSD: 14,
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
      priceINR: 499,
      priceUSD: 10,
      originalPriceINR: 999,
      originalPriceUSD: 20,
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
      priceINR: 1299,
      priceUSD: 25,
      originalPriceINR: 2599,
      originalPriceUSD: 50,
      features: [
        "90-Day Multi-Company Mastery Pass",
        "Unlimited Active Target Roadmaps",
        "Unlimited AI Mock Interviews",
        "Unlimited Technical Assessments",
        "Unlimited AI Coach Messages",
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
      description: "Add 100 in-depth AI Coach messages to your active plan.",
      boostAmount: 100,
      featureKey: "FEAT_COACH_MESSAGES",
    },
    {
      id: "mock-pack-10",
      name: "Mock Interview Pack",
      priceINR: 100,
      description: "Add 10 complete multi-turn mock interview sessions.",
      boostAmount: 10,
      featureKey: "FEAT_MOCK_SESSIONS",
    },
    {
      id: "assessment-pack-5",
      name: "Technical Assessment Pack",
      priceINR: 100,
      description: "Add 5 complete timed technical assessment evaluations.",
      boostAmount: 5,
      featureKey: "FEAT_TECHNICAL_ASSESSMENTS",
    },
    {
      id: "extra-roadmap-1",
      name: "Extra Roadmap Slot",
      priceINR: 79,
      description: "Unlock 1 additional active target roadmap for multi-company prep.",
      boostAmount: 1,
      featureKey: "FEAT_ROADMAPS_CREATED",
    },
  ] as AddOnPack[],
}
