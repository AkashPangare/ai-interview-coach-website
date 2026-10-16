import { useEffect, useState } from "react";

export type PricingCurrency = "INR" | "USD";
const STORAGE_KEY = "prepvisor-pricing-currency";

export function formatPrice(amount: number, currency: PricingCurrency): string {
  return `${currency === "INR" ? "₹" : "$"}${amount}`;
}

export function usePricingCurrency() {
  const [currency, setCurrency] = useState<PricingCurrency>(() => {
    if (typeof window === "undefined") return "INR";
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return saved === "USD" ? "USD" : "INR";
    } catch { return "INR"; }
  });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);
    const detect = async () => {
      try {
        const trace = await fetch("/cdn-cgi/trace", { signal: controller.signal, cache: "no-store" });
        if (trace.ok) {
          const match = (await trace.text()).match(/^loc=([A-Z]{2})$/m);
          if (match) return match[1];
        }
      } catch { /* Fall through to the IP country service. */ }
      try {
        const response = await fetch("https://api.country.is/", { signal: controller.signal });
        if (response.ok) {
          const data: { country?: string } = await response.json();
          return data.country;
        }
      } catch { /* Keep the saved or India default currency. */ }
      return undefined;
    };
    void detect().then((country) => {
      if (!active || !country) return;
      try {
        if (window.localStorage.getItem(STORAGE_KEY)) return;
      } catch { /* Storage may be disabled. */ }
      setCurrency(country === "IN" ? "INR" : "USD");
    }).finally(() => window.clearTimeout(timer));
    return () => { active = false; controller.abort(); window.clearTimeout(timer); };
  }, []);

  const selectCurrency = (next: PricingCurrency) => {
    setCurrency(next);
    try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* Storage may be disabled. */ }
  };
  return { currency, selectCurrency };
}
