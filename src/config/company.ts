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

export const COMPANY_CONFIG = {
  brandName: "PrepVisor",
  legalEntity: "PrepVisor (Operated by Divya Rajkumar Almelkar, Individual)",
  proprietorName: "Divya Rajkumar Almelkar",
  businessType: "Individual",
  industry: "EdTech & Interactive Educational SaaS Software",
  websiteUrl: "https://prepvisor.in",
  
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

  // Early-access pricing plans
  pricing: [
    {
      id: "sprint",
      name: "Sprint Prep Pass",
      subtitle: "For candidates with an interview in 1 to 2 weeks",
      days: 14,
      priceINR: 299,
      priceUSD: 6,
      originalPriceINR: 599,
      originalPriceUSD: 12,
      features: [
        "14-Day Custom Preparation Schedule",
        "Day 1 Initial Skills Assessment",
        "Focused Coding Practice",
        "System Design Fundamentals",
        "Ask the AI Coach for Explanations & Examples",
        "Topic Mock Interviews with Improvement Feedback",
        "Daily Goals & Progress Tracking",
        "Email Support within 48 hours",
      ],
    },
    {
      id: "accelerator",
      name: "Pro Career Accelerator",
      subtitle: "Our most popular comprehensive preparation track",
      badge: "Most Popular",
      days: 30,
      priceINR: 499,
      priceUSD: 10,
      originalPriceINR: 999,
      originalPriceUSD: 20,
      recommended: true,
      features: [
        "30-Day Comprehensive Preparation Track",
        "Dynamic 1-Click Schedule Rebalancing",
        "Full Coding Practice Library",
        "Complete System Design Topics",
        "Behavioural Interview Question Guides",
        "Ask the AI Coach for Concepts & Examples",
        "Topic Mock Interviews with Strengths & Improvements",
        "Progress Tracking Across Key Skills",
        "Priority Support within 24 hours",
      ],
    },
    {
      id: "mastery",
      name: "Comprehensive Mastery",
      subtitle: "For multi-company preparation and lead/senior roles",
      badge: "Best Value",
      days: 90,
      priceINR: 1299,
      priceUSD: 27,
      originalPriceINR: 2599,
      originalPriceUSD: 54,
      features: [
        "90-Day Multi-Role Preparation Access",
        "Target Company Focused Practice",
        "Full Coding, System Design & Behavioural Library",
        "In-Depth System Design Practice",
        "Ask the AI Coach for Concepts & Examples",
        "Topic Mock Interviews with Strengths & Improvements",
        "Personalized Study Recommendations",
        "Progress Tracking & Guidance",
        "Direct Support & Guidance",
      ],
    },
  ] as PricingTier[],
}
