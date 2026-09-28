import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GUIDES, isValidGuideDate } from "../src/data/guides.ts";
import { seoForGuide } from "../src/config/seo.ts";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd } from "../src/lib/structuredData.ts";
import { guideTocEntries, parseGuideMarkdown, renderGuideMarkdownHtml, renderGuideReferencesHtml, safeExternalGuideUrl, safeGuideHref } from "../src/lib/guideMarkdown.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rateLimiter = GUIDES.find((guide) => guide.slug === "system-design-rate-limiter")!;
const readGuideHtml = (slug: string) => fs.readFileSync(path.join(root, "dist", "guides", slug, "index.html"), "utf8");
const decodeHtml = (value: string) => value
  .replaceAll("&amp;", "&")
  .replaceAll("&lt;", "<")
  .replaceAll("&gt;", ">")
  .replaceAll("&quot;", '"')
  .replaceAll("&#39;", "'");

test("Semantic guide rendering and structured data", async (t) => {
  await t.test("guide slugs and canonical URLs remain unique and stable", () => {
    assert.equal(new Set(GUIDES.map((guide) => guide.slug)).size, GUIDES.length);
    const canonicals = GUIDES.map((guide) => seoForGuide(guide).canonicalUrl);
    assert.equal(new Set(canonicals).size, canonicals.length);
    assert.equal(seoForGuide(rateLimiter).canonicalUrl, "https://prepvisor.in/guides/system-design-rate-limiter");
    assert.equal(seoForGuide(GUIDES.find((guide) => guide.slug === "system-design-tinyurl")!).canonicalUrl,
      "https://prepvisor.in/guides/system-design-tinyurl");
  });

  await t.test("article and breadcrumb schema use stable shared identities and canonical URLs", () => {
    const article = generateArticleJsonLd(rateLimiter);
    const canonical = seoForGuide(rateLimiter).canonicalUrl;
    assert.equal(article["@id"], `${canonical}#article`);
    assert.equal(article.url, canonical);
    assert.equal(article.publisher["@id"], "https://prepvisor.in/#organization");
    assert.equal(article.author["@type"], "Organization");
    assert.equal(article.author.name, "PrepVisor");
    assert.equal(article.author["@id"], "https://prepvisor.in/#organization");
    assert.equal(article.dateModified, `${rateLimiter.dateModified}T08:00:00+05:30`);
    assert.ok(!("datePublished" in article), "Do not infer a publication date");

    const breadcrumb = generateBreadcrumbJsonLd(rateLimiter);
    const entries = breadcrumb.itemListElement;
    assert.deepEqual(entries.map((entry) => entry.name), ["Home", "Guides", rateLimiter.title]);
    assert.deepEqual(entries.map((entry) => entry.item), [
      "https://prepvisor.in/",
      "https://prepvisor.in/guides",
      canonical,
    ]);
  });

  await t.test("API Rate Limiter pilot provides the optional answer and takeaways", () => {
    assert.ok(rateLimiter.quickAnswer);
    const wordCount = rateLimiter.quickAnswer.trim().split(/\s+/).length;
    assert.ok(wordCount >= 40 && wordCount <= 70, `Expected 40–70 words, got ${wordCount}`);
    assert.ok(rateLimiter.keyTakeaways && rateLimiter.keyTakeaways.length >= 4 && rateLimiter.keyTakeaways.length <= 6);
    assert.ok(rateLimiter.references.length >= 2);
  });

  await t.test("visible FAQ answers match FAQPage data", () => {
    const schema = generateFaqJsonLd(rateLimiter);
    assert.deepEqual(schema.mainEntity.map((entry) => [entry.name, entry.acceptedAnswer.text]),
      rateLimiter.faqs.map((faq) => [faq.question, faq.answer]));
    const html = readGuideHtml(rateLimiter.slug);
    const visibleFaq = [...html.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)]
      .map((match) => [decodeHtml(match[1]), decodeHtml(match[2])]);
    assert.deepEqual(visibleFaq, rateLimiter.faqs.map((faq) => [faq.question, faq.answer]));
  });

  await t.test("prerender output contains semantic article content and valid TOC anchors", () => {
    const html = readGuideHtml(rateLimiter.slug);
    assert.ok(html.includes(`<h2>Quick Answer</h2><p>${rateLimiter.quickAnswer}</p>`));
    assert.ok(html.includes("<h2>Key Takeaways</h2><ul>"));
    assert.match(html, /<h[234][^>]*id="/);
    assert.match(html, /<ul>[\s\S]*?<li>/);
    assert.match(html, /<pre><code class="language-lua">/);
    assert.ok(html.includes("<noscript>\n      <article"), "Semantic guide content must be present in prerendered HTML");
    const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
    const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
    assert.deepEqual(breadcrumb.itemListElement.map((item) => item.item), [
      "https://prepvisor.in/",
      "https://prepvisor.in/guides",
      "https://prepvisor.in/guides/system-design-rate-limiter",
    ]);
    const toc = html.match(/<nav aria-label="Table of Contents">([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(toc, "Prerendered guide must include a table of contents");
    const links = [...toc.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    assert.ok(links.length > 0);
    assert.ok(links.every((id) => ids.has(id)), "Every TOC link must resolve to a rendered element ID");
    assert.equal(links.length, new Set(links).size, "TOC entries must not duplicate anchors");
  });

  await t.test("all guide output uses conservative publisher attribution without unsupported credentials", () => {
    const forbidden = ["FAANG Interview Coaches", "Ex-Staff Engineer", "Staff Infrastructure Engineers", "Technical Interview Panelists"];
    for (const guide of GUIDES) {
      const html = readGuideHtml(guide.slug);
      assert.ok(html.includes("Published by PrepVisor"));
      assert.ok(html.includes("Guide publisher"));
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
      assert.equal(new Set(ids).size, ids.length, `IDs must be unique in ${guide.slug}`);
      const toc = html.match(/<nav aria-label="Table of Contents">([\s\S]*?)<\/nav>/)?.[1] ?? "";
      const anchors = [...toc.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]);
      assert.ok(anchors.every((id) => ids.includes(id)), `TOC links must resolve in ${guide.slug}`);
      for (const phrase of forbidden) assert.ok(!html.includes(phrase), `${phrase} remains in ${guide.slug}`);
      const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      for (const script of jsonLd) assert.doesNotThrow(() => JSON.parse(script[1]));
    }
  });

  await t.test("guide references and manually maintained dates are valid", () => {
    for (const guide of GUIDES) {
      assert.ok(isValidGuideDate(guide.dateModified), `${guide.slug} dateModified is valid`);
      if (guide.datePublished) assert.ok(isValidGuideDate(guide.datePublished), `${guide.slug} datePublished is valid`);
      const urls = new Set();
      for (const reference of guide.references ?? []) {
        assert.ok(reference.title.trim(), `${guide.slug} reference title exists`);
        assert.ok(reference.publisher.trim(), `${guide.slug} reference publisher exists`);
        assert.doesNotThrow(() => new URL(reference.url), `${guide.slug} reference URL parses`);
        assert.match(reference.url, /^https:\/\//, `${guide.slug} reference uses HTTPS`);
        assert.ok(!/^javascript:|^data:/i.test(reference.url));
        assert.ok(!urls.has(reference.url), `${guide.slug} has no duplicate reference URLs`);
        urls.add(reference.url);
      }
      const html = readGuideHtml(guide.slug);
      const article = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
        .map((match) => JSON.parse(match[1])).find((schema) => schema["@type"] === "TechArticle");
      assert.equal(article.dateModified, `${guide.dateModified}T08:00:00+05:30`);
      assert.equal(html.includes(`Updated ${guide.dateModified}`), true);
      assert.equal("datePublished" in article, Boolean(guide.datePublished));
      if (guide.references?.length) assert.ok(html.includes('id="references"'));
      else assert.ok(!html.includes('id="references"'));
    }
    assert.ok(!isValidGuideDate("2026-02-30"));
    assert.ok(!isValidGuideDate("not-a-date"));
    assert.equal(renderGuideReferencesHtml([]), "", "No references means no empty section wrapper");
    assert.equal(renderGuideReferencesHtml(undefined), "", "Missing references means no empty section wrapper");
    assert.match(renderGuideReferencesHtml([{ title: "Primary source", publisher: "Example Authority", url: "https://example.com/spec" }]), /<section id="references">/);
  });

  await t.test("shared TOC entries are backed by parsed headings", () => {
    const entries = guideTocEntries(rateLimiter);
    const html = readGuideHtml(rateLimiter.slug);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
    assert.ok(entries.some((entry) => entry.id === "quick-answer"));
    assert.ok(entries.some((entry) => entry.id === "key-takeaways"));
    assert.ok(entries.every((entry) => ids.has(entry.id)));
  });

  await t.test("Markdown renderer covers semantic blocks and escapes unsafe HTML", () => {
    const source = [
      "### Heading", "#### Subheading", "A paragraph with `inline code` and [a link](https://example.com).",
      "- one", "- two", "1. first", "2. second", "> a quotation", "Table: Sample",
      "| Name | Value |", "| --- | --- |", "| A | B |", "```ts", "const answer = 42;", "```",
      "<script>alert(1)</script>", "[unsafe](javascript:alert)",
    ].join("\n");
    const html = renderGuideMarkdownHtml(parseGuideMarkdown(source, "sample"));
    assert.match(html, /<h3 id="sample-heading">/);
    assert.match(html, /<h4 id="sample-subheading">/);
    assert.match(html, /<code>inline code<\/code>/);
    assert.match(html, /<ul>[\s\S]*?<li>one<\/li>/);
    assert.match(html, /<ol>[\s\S]*?<li>first<\/li>/);
    assert.match(html, /<blockquote>/);
    assert.match(html, /<table><caption>Sample<\/caption><thead>/);
    assert.match(html, /<th scope="col">Name<\/th>/);
    assert.match(html, /<pre><code class="language-ts">const answer = 42;<\/code><\/pre>/);
    assert.ok(html.includes("&lt;script&gt;alert(1)&lt;/script&gt;"));
    assert.ok(!html.includes('href="javascript:'));
    assert.ok(html.includes('rel="noopener noreferrer"'));
  });

  await t.test("guide link validation rejects unsafe schemes and path tricks", () => {
    assert.equal(safeGuideHref("javascript:alert(1)"), undefined);
    assert.equal(safeGuideHref("data:text/html,<script>alert(1)</script>"), undefined);
    assert.equal(safeGuideHref("/\\evil.com"), undefined);
    assert.equal(safeGuideHref("//evil.com"), undefined);
    assert.equal(safeGuideHref("/guides/system-design-rate-limiter"), "/guides/system-design-rate-limiter");
    assert.equal(safeGuideHref("#references"), "#references");
    assert.equal(safeGuideHref("https://example.com/spec"), "https://example.com/spec");
    assert.equal(safeGuideHref("http://example.com/spec"), "http://example.com/spec");
    assert.equal(safeExternalGuideUrl("https://example.com/spec"), "https://example.com/spec");
    assert.equal(safeExternalGuideUrl("javascript:alert(1)"), undefined);
    assert.equal(safeExternalGuideUrl("data:text/html,unsafe"), undefined);
  });
});
