import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { GUIDES } from "../src/data/guides.ts"
import { GUIDE_CATEGORIES, GUIDE_HUB_CATEGORIES, GUIDE_CATEGORY_BY_ID } from "../src/config/guideCategories.ts"
import { SEO_ROUTES, PRODUCT_PAGE_INTROS, seoForGuide } from "../src/config/seo.ts"
import { generateGuideCategoryJsonLd } from "../src/lib/structuredData.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const readRoute = (route: string) => fs.readFileSync(path.join(dist, route, "index.html"), "utf8")
const matches = (html: string, pattern: RegExp) => [...html.matchAll(pattern)]

test("Phase 4 taxonomy, hubs, links, and generated SEO output", async (t) => {
  await t.test("each guide has a known category, relevant product route, and resolving explicit relationships", () => {
    const knownSlugs = new Set(GUIDES.map((guide) => guide.slug))
    for (const guide of GUIDES) {
      assert.ok(GUIDE_CATEGORY_BY_ID[guide.primaryCategory], `${guide.slug} has a category`)
      assert.ok(["/system-design", "/coding-practice", "/mock-interview"].includes(guide.productPath))
      assert.ok(SEO_ROUTES[guide.productPath === "/system-design" ? "systemDesign" : guide.productPath === "/coding-practice" ? "codingPractice" : "mockInterview"])
      assert.equal(new Set(guide.relatedGuideSlugs).size, guide.relatedGuideSlugs.length, `${guide.slug} relationships are unique`)
      for (const related of guide.relatedGuideSlugs) assert.ok(knownSlugs.has(related), `${guide.slug} references existing guide ${related}`)
      assert.ok(!guide.relatedGuideSlugs.includes(guide.slug), `${guide.slug} does not relate to itself`)
    }
  })

  await t.test("three substantive hubs have unique metadata and canonical URLs; behavioral hub is deferred", () => {
    assert.equal(GUIDE_HUB_CATEGORIES.length, 3)
    assert.ok(!GUIDE_CATEGORY_BY_ID["behavioral-interviews"].hubSeo)
    const hubRoutes = [SEO_ROUTES.guideSystemDesign, SEO_ROUTES.guideJavaBackend, SEO_ROUTES.guideDsa]
    assert.equal(new Set(hubRoutes.map((route) => route.title)).size, hubRoutes.length)
    assert.equal(new Set(hubRoutes.map((route) => route.description)).size, hubRoutes.length)
    assert.equal(new Set(hubRoutes.map((route) => route.canonicalUrl)).size, hubRoutes.length)
    assert.deepEqual(GUIDE_CATEGORIES.map((category) => category.id), ["system-design", "java-backend", "dsa", "behavioral-interviews"])
  })

  await t.test("existing public guide URLs are unchanged", () => {
    assert.deepEqual(GUIDES.map((guide) => seoForGuide(guide).canonicalPath), [
      "/guides/system-design-tinyurl",
      "/guides/java-concurrency-interview-questions",
      "/guides/system-design-rate-limiter",
      "/guides/spring-boot-microservices-interview-questions",
      "/guides/lru-cache-implementation",
      "/guides/system-design-notification-service",
    ])
  })

  await t.test("generated sitemap is well-formed at the URL-entry level and includes every guide canonical", () => {
    const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8")
    assert.match(sitemap, /^<\?xml version="1\.0" encoding="UTF-8"\?>\s*<urlset\b/)
    assert.match(sitemap, /<\/urlset>\s*$/)
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
    assert.ok(locations.length > 0)
    assert.equal(new Set(locations).size, locations.length, "sitemap locations are unique")
    for (const location of locations) assert.equal(new URL(location).protocol, "https:")
    for (const guide of GUIDES) assert.ok(locations.includes(seoForGuide(guide).canonicalUrl), `${guide.slug} canonical is in sitemap`)
  })

  await t.test("category schema is valid CollectionPage and BreadcrumbList with correct breadcrumb URLs", () => {
    for (const category of GUIDE_HUB_CATEGORIES) {
      const [collection, breadcrumb] = generateGuideCategoryJsonLd(category)
      assert.equal(collection["@type"], "CollectionPage")
      assert.equal(collection.isPartOf["@id"], "https://prepvisor.in/#website")
      assert.equal(collection.publisher["@id"], "https://prepvisor.in/#organization")
      assert.equal(breadcrumb["@type"], "BreadcrumbList")
      const items = breadcrumb.itemListElement
      assert.equal(items[0].item, "https://prepvisor.in/")
      assert.equal(items[1].item, "https://prepvisor.in/guides")
      assert.equal(items[2].item, `https://prepvisor.in/guides/${category.id}`)
      assert.doesNotThrow(() => JSON.parse(JSON.stringify([collection, breadcrumb])))
    }
  })

  await t.test("prerendered hub and product pages have singleton metadata, one H1, and indexable canonicals", () => {
    const cases = [
      ["", SEO_ROUTES.home.canonicalUrl],
      ["roadmap", SEO_ROUTES.roadmap.canonicalUrl],
      ["coding-practice", SEO_ROUTES.codingPractice.canonicalUrl],
      ["system-design", SEO_ROUTES.systemDesign.canonicalUrl],
      ["mock-interview", SEO_ROUTES.mockInterview.canonicalUrl],
      ["guides", SEO_ROUTES.guides.canonicalUrl],
      ["guides/system-design", SEO_ROUTES.guideSystemDesign.canonicalUrl],
      ["guides/java-backend", SEO_ROUTES.guideJavaBackend.canonicalUrl],
      ["guides/dsa", SEO_ROUTES.guideDsa.canonicalUrl],
      ["guides/system-design-tinyurl", seoForGuide(GUIDES.find((guide) => guide.slug === "system-design-tinyurl")!).canonicalUrl],
      ["guides/system-design-rate-limiter", seoForGuide(GUIDES.find((guide) => guide.slug === "system-design-rate-limiter")!).canonicalUrl],
      ["guides/java-concurrency-interview-questions", seoForGuide(GUIDES.find((guide) => guide.slug === "java-concurrency-interview-questions")!).canonicalUrl],
      ["guides/lru-cache-implementation", seoForGuide(GUIDES.find((guide) => guide.slug === "lru-cache-implementation")!).canonicalUrl],
    ] as const
    for (const [route, canonical] of cases) {
      const html = readRoute(route)
      assert.equal(matches(html, /<title(?:\s[^>]*)?>[\s\S]*?<\/title>/gi).length, 1, `${route || "/"}: one title`)
      assert.equal(matches(html, /<meta\s+name="description"/gi).length, 1, `${route || "/"}: one description`)
      assert.equal(matches(html, /<link\s+rel="canonical"/gi).length, 1, `${route || "/"}: one canonical`)
      assert.ok(html.includes(`<link rel="canonical" href="${canonical}" />`), `${route || "/"}: correct canonical`)
      assert.equal(matches(html, /<meta\s+property="og:url"/gi).length, 1, `${route || "/"}: one og:url`)
      assert.ok(html.includes(`<meta property="og:url" content="${canonical}" />`), `${route || "/"}: og:url matches canonical`)
      assert.equal(matches(html, /<meta\s+property="og:title"/gi).length, 1, `${route || "/"}: one og:title`)
      assert.equal(matches(html, /<meta\s+property="og:description"/gi).length, 1, `${route || "/"}: one og:description`)
      assert.equal(matches(html, /<meta\s+property="og:type"/gi).length, 1, `${route || "/"}: one og:type`)
      assert.equal(matches(html, /<meta\s+name="twitter:title"/gi).length, 1, `${route || "/"}: one twitter:title`)
      assert.equal(matches(html, /<meta\s+name="twitter:description"/gi).length, 1, `${route || "/"}: one twitter:description`)
      assert.equal(matches(html, /<meta\s+property="og:image"/gi).length, 1, `${route || "/"}: one social image`)
      assert.equal(matches(html, /<meta\s+name="twitter:image"/gi).length, 1, `${route || "/"}: one Twitter image`)
      assert.ok(html.includes('content="https://prepvisor.in/og-image.png"'), `${route || "/"}: absolute social image URL`)
      assert.equal(matches(html, /<h1\b/gi).length, 1, `${route || "/"}: one H1`)
      assert.ok(!/name="robots"[^>]*noindex/i.test(html), `${route || "/"}: indexable`)
      const scripts = matches(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)
      for (const script of scripts) assert.doesNotThrow(() => JSON.parse(script[1]), `${route || "/"}: JSON-LD parses`)
    }
  })

  await t.test("topic pages, guides, and product pages expose crawlable contextual links", () => {
    const hub = readRoute("guides")
    for (const category of GUIDE_CATEGORIES) assert.ok(hub.includes(category.name), `/guides exposes ${category.name}`)
    for (const category of GUIDE_HUB_CATEGORIES) assert.ok(hub.includes(`/guides/${category.id}`), `/guides links to ${category.id}`)
    for (const guide of GUIDES) assert.ok(hub.includes(`/guides/${guide.slug}`), `/guides preserves ${guide.slug}`)
    for (const category of GUIDE_HUB_CATEGORIES) {
      const html = readRoute(`guides/${category.id}`)
      for (const guide of GUIDES.filter((item) => item.primaryCategory === category.id)) assert.ok(html.includes(`/guides/${guide.slug}`))
      const guideLinks = [...html.matchAll(/href="\/guides\/([^"/#]+)"/g)].map((match) => match[1])
      for (const slug of guideLinks) assert.ok(GUIDES.some((guide) => guide.slug === slug), `${category.id} links to existing guide ${slug}`)
      assert.ok(html.includes("BreadcrumbList"))
      assert.ok(html.includes('href="/guides"'))
    }
    assert.ok(readRoute("system-design").includes("/guides/system-design-tinyurl"))
    assert.ok(readRoute("coding-practice").includes("/guides/lru-cache-implementation"))
    assert.ok(readRoute("roadmap").includes("/guides/java-concurrency-interview-questions"))
    assert.ok(readRoute("mock-interview").includes("/guides/java-concurrency-interview-questions"))
    for (const guide of GUIDES) {
      const html = readRoute(`guides/${guide.slug}`)
      for (const relatedSlug of guide.relatedGuideSlugs) assert.ok(html.includes(`/guides/${relatedSlug}`), `${guide.slug} links to configured related guide ${relatedSlug}`)
    }
  })

  await t.test("product intros are 40–80 words and appear in generated output", () => {
    const targets = [
      ["roadmap", PRODUCT_PAGE_INTROS.roadmap],
      ["coding-practice", PRODUCT_PAGE_INTROS.codingPractice],
      ["system-design", PRODUCT_PAGE_INTROS.systemDesign],
      ["mock-interview", PRODUCT_PAGE_INTROS.mockInterview],
    ] as const
    for (const [route, intro] of targets) {
      const count = intro.trim().split(/\s+/).length
      assert.ok(count >= 40 && count <= 80, `${route} intro has ${count} words`)
      assert.ok(readRoute(route).includes(intro), `${route} intro is prerendered`)
    }
  })
})
