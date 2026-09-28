export interface PaidPlanPrice {
  id: string
  name: string
  priceINR: number
  priceUSD: number
}

export const PAID_PLAN_PRICES: PaidPlanPrice[]
export const INR_PAID_OFFER_SUMMARY: {
  lowPrice: number
  highPrice: number
  offerCount: number
}
