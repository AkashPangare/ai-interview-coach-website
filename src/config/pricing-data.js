export const PAID_PLAN_PRICES = [
  { id: "PLAN_14", name: "Interview Prep · 14 days", priceINR: 349, priceUSD: 7 },
  { id: "PLAN_30", name: "Interview Prep · 30 days", priceINR: 499, priceUSD: 10 },
  { id: "PLAN_90", name: "Interview Prep · 90 days", priceINR: 1299, priceUSD: 25 },
]

export const INR_PAID_OFFER_SUMMARY = {
  lowPrice: Math.min(...PAID_PLAN_PRICES.map((plan) => plan.priceINR)),
  highPrice: Math.max(...PAID_PLAN_PRICES.map((plan) => plan.priceINR)),
  offerCount: PAID_PLAN_PRICES.length,
}
