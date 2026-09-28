import test from "node:test";
import assert from "node:assert/strict";
import { COMPANY_CONFIG } from "../src/config/company.ts";
import { absoluteSiteUrl, SEO_ROUTES, seoForGuide } from "../src/config/seo.ts";
import { GUIDES } from "../src/data/guides.ts";
import { generateCoreStructuredData } from "../src/lib/structuredData.ts";

test("Central SEO metadata and structured data", async (t) => {
  await t.test("uses absolute production canonical URLs for routes and guides", () => {
    assert.equal(absoluteSiteUrl("/"), "https://prepvisor.in/");
    assert.equal(absoluteSiteUrl("/roadmap"), "https://prepvisor.in/roadmap");
    assert.throws(() => absoluteSiteUrl("roadmap"), /must start with '\/'/);
    assert.equal(SEO_ROUTES.home.canonicalUrl, "https://prepvisor.in/");
    assert.equal(SEO_ROUTES.roadmap.canonicalUrl, "https://prepvisor.in/roadmap");
    assert.equal(seoForGuide(GUIDES.find((guide) => guide.slug === "system-design-tinyurl")!).canonicalUrl,
      "https://prepvisor.in/guides/system-design-tinyurl");

    const canonicalUrls = [
      ...Object.values(SEO_ROUTES).map((route) => route.canonicalUrl),
      ...GUIDES.map((guide) => seoForGuide(guide).canonicalUrl),
    ];
    assert.equal(new Set(canonicalUrls).size, canonicalUrls.length, "Each public page must have a unique canonical");
    assert.ok(canonicalUrls.every((url) => url.startsWith("https://prepvisor.in/")));
    assert.ok(canonicalUrls.every((url) => !url.includes("localhost")));
    assert.equal(seoForGuide(GUIDES[0]).canonicalUrl, `https://prepvisor.in/guides/${GUIDES[0].slug}`);
  });

  await t.test("includes descriptive titles and descriptions for every route and guide", () => {
    for (const [key, metadata] of Object.entries(SEO_ROUTES)) {
      assert.ok(metadata.title.trim(), `${key} must have a title`);
      assert.ok(metadata.description.trim(), `${key} must have a description`);
      assert.equal(metadata.canonicalUrl, absoluteSiteUrl(metadata.canonicalPath));
    }
    for (const guide of GUIDES) {
      const metadata = seoForGuide(guide);
      assert.ok(metadata.title.includes(guide.seoTitle));
      assert.equal(metadata.description, guide.metaDescription);
      assert.equal(metadata.ogType, "article");
    }
  });

  await t.test("derives aggregate offers from configured paid plans only", () => {
    const graph = generateCoreStructuredData()["@graph"] as Array<Record<string, any>>;
    const software = graph.find((entity) => entity["@type"] === "SoftwareApplication");
    const offers = software?.offers;
    const paidPlans = COMPANY_CONFIG.pricing.filter((plan) => plan.priceINR > 0);
    assert.equal(offers["@type"], "AggregateOffer");
    assert.equal(offers.lowPrice, Math.min(...paidPlans.map((plan) => plan.priceINR)));
    assert.equal(offers.highPrice, Math.max(...paidPlans.map((plan) => plan.priceINR)));
    assert.equal(offers.offerCount, paidPlans.length);
    assert.ok(!("aggregateRating" in software));
    assert.ok(!("reviewCount" in software));
  });
});
