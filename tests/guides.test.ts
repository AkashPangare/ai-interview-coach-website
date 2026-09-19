import test from "node:test";
import assert from "node:assert/strict";
import {
  GUIDES,
  getGuideBySlug,
  generateArticleJsonLd,
  generateFaqJsonLd,
} from "../src/data/guides.ts";

test("Programmatic SEO Guides Suite", async (t) => {
  await t.test("1. All flagship guides are registered with required SEO metadata", () => {
    assert.ok(GUIDES.length >= 6, "Must contain at least 6 flagship guides");

    const slugs = GUIDES.map((g) => g.slug);
    assert.ok(slugs.includes("system-design-tinyurl"), "Must contain TinyURL guide");
    assert.ok(
      slugs.includes("java-concurrency-interview-questions"),
      "Must contain Java Concurrency guide"
    );
    assert.ok(
      slugs.includes("system-design-rate-limiter"),
      "Must contain Rate Limiter guide"
    );
    assert.ok(
      slugs.includes("spring-boot-microservices-interview-questions"),
      "Must contain Spring Boot & Microservices guide"
    );
    assert.ok(
      slugs.includes("lru-cache-implementation"),
      "Must contain LRU Cache guide"
    );
    assert.ok(
      slugs.includes("system-design-notification-service"),
      "Must contain Notification System guide"
    );

    for (const guide of GUIDES) {
      assert.ok(guide.slug.length > 0, "Guide must have a slug");
      assert.ok(guide.title.length > 0, "Guide must have a title");
      assert.ok(guide.seoTitle.length > 0, "Guide must have an SEO title");
      assert.ok(guide.metaDescription.length > 0, "Guide must have a meta description");
      assert.ok(guide.keywords.length >= 3, "Guide must have at least 3 keywords");
      assert.ok(guide.sections.length >= 4, "Guide must have at least 4 detailed sections");
      assert.ok(guide.faqs.length >= 3, "Guide must have at least 3 FAQs for FAQPage schema");
      assert.ok(guide.cta.actionUrl.includes("utm_source=organic_seo"), "CTA must carry organic SEO UTM source");
      assert.ok(guide.cta.actionUrl.includes("utm_medium=guide"), "CTA must carry guide UTM medium");
    }
  });

  await t.test("2. Slugs are unique across the guide catalog", () => {
    const slugs = GUIDES.map((g) => g.slug);
    const uniqueSlugs = new Set(slugs);
    assert.equal(slugs.length, uniqueSlugs.size, "Slugs must be strictly unique");
  });

  await t.test("3. getGuideBySlug accurately retrieves matching guide", () => {
    const tinyUrl = getGuideBySlug("system-design-tinyurl");
    assert.ok(tinyUrl);
    assert.equal(tinyUrl.category, "System Design");
    assert.equal(tinyUrl.readingTimeMinutes, 20);

    const nonExistent = getGuideBySlug("non-existent-guide-xyz");
    assert.equal(nonExistent, undefined);
  });

  await t.test("4. generateArticleJsonLd produces valid TechArticle schema", () => {
    const guide = GUIDES[0];
    const schema = generateArticleJsonLd(guide);

    assert.equal(schema["@context"], "https://schema.org");
    assert.equal(schema["@type"], "TechArticle");
    assert.equal(schema.headline, guide.title);
    assert.equal(schema.description, guide.metaDescription);
    assert.ok(schema.mainEntityOfPage["@id"].includes(guide.slug));
    assert.ok(schema.publisher.name, "PrepVisor");
  });

  await t.test("5. generateFaqJsonLd produces valid FAQPage schema with all question entities", () => {
    const guide = GUIDES[0];
    const faqSchema = generateFaqJsonLd(guide);

    assert.equal(faqSchema["@context"], "https://schema.org");
    assert.equal(faqSchema["@type"], "FAQPage");
    assert.equal(faqSchema.mainEntity.length, guide.faqs.length);

    for (let i = 0; i < guide.faqs.length; i++) {
      const entry = faqSchema.mainEntity[i];
      assert.equal(entry["@type"], "Question");
      assert.equal(entry.name, guide.faqs[i].question);
      assert.equal(entry.acceptedAnswer["@type"], "Answer");
      assert.equal(entry.acceptedAnswer.text, guide.faqs[i].answer);
    }
  });
});
