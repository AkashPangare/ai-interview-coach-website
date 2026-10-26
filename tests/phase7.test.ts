import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { COMPANY_CONFIG } from "../src/config/company.ts"
import { PLAN_DURATIONS, PRICING_PREVIEW, RESUME_ALLOWANCES } from "../src/config/pricingPreview.ts"
import { SEO_ROUTES, seoForGuide } from "../src/config/seo.ts"
import { GUIDE_HUB_CATEGORIES } from "../src/config/guideCategories.ts"
import { GUIDES } from "../src/data/guides.ts"
import { generateArticleJsonLd, generateCoreStructuredData, generateFaqJsonLd, generateGuideCategoryJsonLd } from "../src/lib/structuredData.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const read = (route: string) => fs.readFileSync(path.join(dist, route, "index.html"), "utf8")
const count = (html: string, pattern: RegExp) => [...html.matchAll(pattern)].length
const extractSchemas = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]))

test("Phase 7 production readiness regressions", async (t) => {
  await t.test("generated sitemap exactly matches canonical URLs for indexable routes and guides", () => {
    const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8")
    const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
    const expected = [
      ...Object.values(SEO_ROUTES).filter((route) => route.indexable && route.pathname !== "*").map((route) => route.canonicalUrl),
      ...GUIDES.map((guide) => seoForGuide(guide).canonicalUrl),
    ]
    assert.equal(new Set(locations).size, locations.length, "sitemap entries are unique")
    assert.deepEqual([...locations].sort(), [...expected].sort(), "sitemap matches configured canonical URLs exactly")
    assert.ok(!locations.some((url) => /404|\?|app\.prepvisor|localhost/i.test(url)))
    for (const url of locations) assert.ok(url.startsWith("https://prepvisor.in/"))
  })

  await t.test("404 output is noindex and absent from sitemap", () => {
    const notFound = fs.readFileSync(path.join(dist, "404.html"), "utf8")
    assert.match(notFound, /<meta name="robots" content="noindex,follow"\s*\/>/)
    assert.ok(!fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8").includes("404.html"))
  })

  await t.test("robots allows public routes and points to the absolute production sitemap", () => {
    const robots = fs.readFileSync(path.join(root, "public/robots.txt"), "utf8")
    assert.match(robots, /User-agent:\s*\*\s*\nAllow:\s*\//)
    assert.match(robots, /Sitemap:\s*https:\/\/prepvisor\.in\/sitemap\.xml/)
    assert.doesNotMatch(robots, /Disallow:\s*\/(?:guides|roadmap|system-design|coding-practice)/i)
  })

  await t.test("every indexable generated route has singleton metadata and a valid social image", () => {
    const routes = [
      ...Object.values(SEO_ROUTES).filter((route) => route.indexable && route.pathname !== "*").map((route) => [route.pathname.replace(/^\//, ""), route] as const),
      ...GUIDES.map((guide) => [`guides/${guide.slug}`, seoForGuide(guide)] as const),
    ]
    for (const [routePath, metadata] of routes) {
      const html = read(routePath)
      assert.equal(count(html, /<title\b/gi), 1, `${routePath || "/"}: one title`)
      assert.equal(count(html, /<meta\s+name="description"/gi), 1, `${routePath}: one description`)
      assert.equal(count(html, /<link\s+rel="canonical"/gi), 1, `${routePath}: one canonical`)
      assert.equal(count(html, /<meta\s+property="og:(?:title|description|url|type|image|image:width|image:height|image:alt)"/gi), 8, `${routePath}: expected OG tags once`)
      assert.equal(count(html, /<meta\s+name="twitter:(?:title|description|url|image)"/gi), 4, `${routePath}: expected Twitter tags once`)
      assert.ok(html.includes(`rel="canonical" href="${metadata.canonicalUrl}"`), `${routePath}: canonical matches configuration`)
      assert.ok(html.includes(`property="og:url" content="${metadata.canonicalUrl}"`), `${routePath}: og:url matches canonical`)
      assert.ok(html.includes(`property="og:image" content="${metadata.socialImageUrl}"`), `${routePath}: image uses shared source`)
      assert.ok(html.includes('name="twitter:card" content="summary_large_image"'))
      assert.ok(!/name="robots"[^>]*noindex/i.test(html), `${routePath}: should remain indexable`)
      assert.match(html, /<h1\b[^>]*>[\s\S]*?<\/h1>/i, `${routePath}: substantive prerendered content`)
      assert.ok(/href="\/(?!\/)[^"]+"/.test(html), `${routePath}: crawlable internal links`)
      for (const schema of extractSchemas(html)) assert.doesNotThrow(() => JSON.stringify(schema))
    }
    assert.ok(fs.existsSync(path.join(dist, "og-image.png")))
  })

  await t.test("representative schema has supported identities, prices, and types only", () => {
    const homeHtml = read("")
    const core = extractSchemas(homeHtml).find((schema) => schema["@graph"])
    assert.ok(core)
    const types = core["@graph"].map((item: Record<string, any>) => item["@type"])
    assert.deepEqual(types, ["Organization", "WebSite", "SoftwareApplication"])
    const software = core["@graph"].find((item: Record<string, any>) => item["@type"] === "SoftwareApplication")
    const paid = PRICING_PREVIEW
    assert.equal(software.offers.lowPrice, Math.min(...paid.map((plan) => plan.priceINR)))
    assert.equal(software.offers.highPrice, Math.max(...paid.map((plan) => plan.priceINR)))
    assert.equal(software.offers.offerCount, paid.length)
    assert.ok(!("aggregateRating" in software) && !("reviewCount" in software))
    const categories = GUIDE_HUB_CATEGORIES[0]
    assert.deepEqual(generateGuideCategoryJsonLd(categories).map((item) => item["@type"]), ["CollectionPage", "BreadcrumbList"])
    const guide = GUIDES.find((item) => item.slug === "system-design-rate-limiter")!
    const article = generateArticleJsonLd(guide)
    assert.equal(article.author["@type"], "Organization")
    assert.equal(article.publisher["@id"], "https://prepvisor.in/#organization")
    assert.equal(generateFaqJsonLd(guide)["@type"], "FAQPage")
    assert.doesNotMatch(JSON.stringify([core, article]), /aggregateRating|reviewCount|"@type":"Person"/)
  })

  await t.test("pricing page stays in parity and every pass links to app pricing", () => {
    const pricingHtml = read("pricing")
    const reactPage = fs.readFileSync(path.join(root, "src/pages/PricingPage.tsx"), "utf8")
    const escapeHtml = (value: string) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;")
    const renderedPlanIds = [...pricingHtml.matchAll(/<article data-plan-id="([^"]+)"/g)].map((match) => match[1])
    assert.deepEqual(renderedPlanIds, PRICING_PREVIEW.map((plan) => plan.id))
    assert.match(reactPage, /PRICING_PREVIEW\.filter/, "React cards derive from shared preview config")
    assert.deepEqual(PLAN_DURATIONS, [14, 30, 90])
    assert.deepEqual(PLAN_DURATIONS.map((days) => PRICING_PREVIEW.filter((plan) => plan.days === days).map((plan) => plan.priceINR)), [
      [249, 349, 499],
      [399, 499, 699],
      [999, 1299, 1799],
    ])
    for (const days of PLAN_DURATIONS) {
      const [resume, interview, bundle] = PRICING_PREVIEW.filter((plan) => plan.days === days)
      assert.deepEqual([resume.kind, interview.kind, bundle.kind], ["resume", "interview", "bundle"])
      assert.ok(bundle.priceINR < resume.priceINR + interview.priceINR, `${days}-day bundle must save money`)
    }

    for (const plan of PRICING_PREVIEW) {
      assert.ok(pricingHtml.includes(`id="pricing-plan-${plan.id}"`), `${plan.id}: title target exists`)
      assert.ok(pricingHtml.includes(`>${escapeHtml(plan.name)}</h2>`), `${plan.id}: name matches`)
      assert.ok(pricingHtml.includes(escapeHtml(plan.subtitle)), `${plan.id}: description matches`)
      assert.ok(pricingHtml.includes(`>₹${plan.priceINR}</span>`), `${plan.id}: price matches`)
      assert.ok(pricingHtml.includes(`One-time · ${plan.days}-day access pass`), `${plan.id}: duration matches`)
      assert.ok(pricingHtml.includes(`href="${COMPANY_CONFIG.appUrl}/pricing?days=${plan.days}"`), `${plan.id}: app pricing link is present`)
    }
    assert.ok(!pricingHtml.includes("Resume Studio Boost"))
    assert.deepEqual(RESUME_ALLOWANCES[30], { generations: 10, savedJobs: 20, matches: 20, qualityChecks: 10, recruiterReviews: 5, gapAnalyses: 5, optimizations: 10 })

    assert.ok(pricingHtml.includes(`<link rel="canonical" href="${SEO_ROUTES.pricing.canonicalUrl}" />`))
    assert.ok(pricingHtml.includes(`<title>${escapeHtml(SEO_ROUTES.pricing.title)}</title>`))
    const core = extractSchemas(pricingHtml).find((schema) => schema["@graph"])
    const software = core["@graph"].find((entity: Record<string, any>) => entity["@type"] === "SoftwareApplication")
    const paid = PRICING_PREVIEW
    assert.equal(software.offers.offerCount, paid.length, "free plan remains excluded from paid offer count")
    assert.equal(software.offers.highPrice, Math.max(...paid.map((plan) => plan.priceINR)))
    assert.equal(software.offers.lowPrice, Math.min(...paid.map((plan) => plan.priceINR)))
  })

  await t.test("verification-token placeholders are absent and production check remains opt-in", () => {
    const html = fs.readFileSync(path.join(root, "index.html"), "utf8")
    assert.doesNotMatch(html, /google-site-verification|bing-site-verification/i)
    const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"))
    assert.equal(packageJson.scripts["seo:production-check"], "node scripts/seo-production-check.js")
    assert.ok(!packageJson.scripts.build.includes("production-check"))
  })
})
