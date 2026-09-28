export const PAID_PLAN_PRICES = [
  { id: "PLAN_7", name: "7-Day Sprint", priceINR: 199, priceUSD: 4 },
  { id: "PLAN_14", name: "14-Day Grind", priceINR: 349, priceUSD: 7 },
  { id: "PLAN_30", name: "30-Day Pro", priceINR: 499, priceUSD: 10 },
  { id: "PLAN_90", name: "90-Day Elite", priceINR: 1299, priceUSD: 25 },
]

export const INR_PAID_OFFER_SUMMARY = {
  lowPrice: Math.min(...PAID_PLAN_PRICES.map((plan) => plan.priceINR)),
  highPrice: Math.max(...PAID_PLAN_PRICES.map((plan) => plan.priceINR)),
  offerCount: PAID_PLAN_PRICES.length,
}
