import test from "node:test";
import assert from "node:assert/strict";
import {
  captureUtmParams,
  getUtmParams,
  decorateUrlWithUtms,
  trackEvent,
  initAnalytics,
} from "../src/lib/analytics.ts";

test("Analytics & UTM Attribution Suite", async (t) => {
  // Mock browser globals for Node.js test environment
  const mockStorage: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
  };

  let mockCookie = "";
  (globalThis as any).document = {
    get cookie() {
      return mockCookie;
    },
    set cookie(val: string) {
      mockCookie = val;
    },
    querySelector: () => null,
    createElement: () => ({ setAttribute: () => {} }),
    head: { appendChild: () => {} },
  };

  (globalThis as any).window = {
    location: {
      search: "",
      pathname: "/",
      hostname: "prepvisor.in",
    },
    document: (globalThis as any).document,
  };

  await t.test("1. Parses UTM parameters from query string and saves to storage", () => {
    const queryString = "?utm_source=instagram&utm_medium=social&utm_campaign=interview_tips&utm_content=reel1";
    const result = captureUtmParams(queryString, "https://instagram.com");

    assert.equal(result.utm_source, "instagram");
    assert.equal(result.utm_medium, "social");
    assert.equal(result.utm_campaign, "interview_tips");
    assert.equal(result.utm_content, "reel1");
    assert.equal(result.referrer, "https://instagram.com");

    const retrieved = getUtmParams();
    assert.equal(retrieved.utm_source, "instagram");
    assert.equal(retrieved.utm_campaign, "interview_tips");
  });

  await t.test("2. Decorates outbound application URL with stored UTM parameters", () => {
    const outboundAppUrl = "https://app.prepvisor.in/register";
    const decorated = decorateUrlWithUtms(outboundAppUrl);

    assert.ok(decorated.includes("utm_source=instagram"));
    assert.ok(decorated.includes("utm_medium=social"));
    assert.ok(decorated.includes("utm_campaign=interview_tips"));
    assert.ok(decorated.includes("utm_content=reel1"));
  });

  await t.test("3. Preserves existing URL query parameters during decoration", () => {
    const outboundWithPlan = "https://app.prepvisor.in/register?plan=PRO_MONTHLY";
    const decorated = decorateUrlWithUtms(outboundWithPlan);

    assert.ok(decorated.includes("plan=PRO_MONTHLY"));
    assert.ok(decorated.includes("utm_source=instagram"));
  });

  await t.test("4. Safe event tracking dispatches without errors when gtag is absent or blocked", () => {
    delete (globalThis as any).window.gtag;
    assert.doesNotThrow(() => {
      trackEvent("landing_cta_clicked", { cta: "test_button" });
    });
  });

  await t.test("5. Dispatches event to window.gtag with merged UTM metadata when gtag is present", () => {
    const dispatched: any[] = [];
    (globalThis as any).window.gtag = (command: string, eventName: string, params: any) => {
      dispatched.push({ command, eventName, params });
    };

    trackEvent("pricing_plan_selected", { plan_id: "PRO_MONTHLY", price_inr: 499 });

    assert.equal(dispatched.length, 1);
    assert.equal(dispatched[0].eventName, "pricing_plan_selected");
    assert.equal(dispatched[0].params.plan_id, "PRO_MONTHLY");
    assert.equal(dispatched[0].params.utm_source, "instagram");
    assert.ok(dispatched[0].params.timestamp);
  });

  await t.test("6. Infers organic search attribution from referrer when no UTMs exist", () => {
    // Clear storage/cookies for a fresh organic visitor
    for (const k in mockStorage) delete mockStorage[k];
    mockCookie = "";

    const organicResult = captureUtmParams("", "https://www.google.com/search?q=interview+prep");
    assert.equal(organicResult.utm_source, "google");
    assert.equal(organicResult.utm_medium, "organic");
    assert.equal(organicResult.utm_campaign, "organic");

    const outboundUrl = decorateUrlWithUtms("https://app.prepvisor.in/register");
    assert.ok(outboundUrl.includes("utm_source=google"));
    assert.ok(outboundUrl.includes("utm_medium=organic"));
  });

  await t.test("7. Defaults to direct attribution when no UTMs or external referrer exist", () => {
    // Clear storage/cookies for a direct visitor
    for (const k in mockStorage) delete mockStorage[k];
    mockCookie = "";

    const directResult = captureUtmParams("", "");
    assert.equal(directResult.utm_source, "direct");
    assert.equal(directResult.utm_medium, "direct");
  });
});
