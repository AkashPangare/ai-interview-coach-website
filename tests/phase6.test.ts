import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { GUIDES } from "../src/data/guides.ts"
import { GUIDE_INDEX } from "../src/data/guideIndex.ts"
import { SEO_ROUTES, seoForGuide } from "../src/config/seo.ts"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")

test("Phase 6 lazy loading preserves lightweight guide listings and prerendered SEO output", async (t) => {
  await t.test("guide index matches article metadata without shipping article bodies", () => {
    assert.equal(GUIDE_INDEX.length, GUIDES.length)
    const fields = ["slug", "title", "seoTitle", "metaDescription", "primaryCategory", "dateModified", "summary"] as const
    for (const guide of GUIDES) {
      const indexed = GUIDE_INDEX.find((item) => item.slug === guide.slug)
      assert.ok(indexed, `${guide.slug} is in the listing index`)
      for (const field of fields) assert.equal(indexed[field], guide[field], `${guide.slug} ${field} stays in sync`)
      assert.deepEqual(indexed.topics, guide.sections.slice(0, 3).map((section) => section.title.split(". ")[1] || section.title))
      assert.ok(!("sections" in indexed) && !("faqs" in indexed) && !("cta" in indexed))
    }
  })

  await t.test("page modules are lazy imports and resolve to source files", () => {
    const app = fs.readFileSync(path.join(root, "src/App.tsx"), "utf8")
    const routeModules = fs.readFileSync(path.join(root, "src/lib/routeModules.ts"), "utf8")
    const pages = [...routeModules.matchAll(/import\("@\/pages\/([^\"]+)"\)/g)].map((match) => match[1])
    assert.ok(pages.length >= 15, `Expected route-level dynamic imports, found ${pages.length}`)
    assert.equal(app.includes('from "@/pages/'), false, "App must not eagerly import route modules")
    assert.match(app, /lazy\(\(\) => routeModules\./, "Routes still load lazily")
    for (const page of pages) assert.ok(fs.existsSync(path.join(root, "src/pages", `${page}.tsx`)), `${page} import resolves`)
  })

  await t.test("public routes and guide hubs remain fully prerendered and indexable", () => {
    const routes = [
      ["", SEO_ROUTES.home],
      ["roadmap", SEO_ROUTES.roadmap],
      ["coding-practice", SEO_ROUTES.codingPractice],
      ["system-design", SEO_ROUTES.systemDesign],
      ["mock-interview", SEO_ROUTES.mockInterview],
      ["guides", SEO_ROUTES.guides],
      ["guides/system-design", SEO_ROUTES.guideSystemDesign],
      ["guides/java-backend", SEO_ROUTES.guideJavaBackend],
      ["guides/dsa", SEO_ROUTES.guideDsa],
    ] as const
    for (const [route, seo] of routes) {
      const html = fs.readFileSync(path.join(dist, route, "index.html"), "utf8")
      assert.ok(html.includes(`<title>${seo.title.replaceAll("&", "&amp;")}</title>`), `${route || "/"} title exists`)
      assert.ok(html.includes(`name="description" content="${seo.description}"`), `${route || "/"} description exists`)
      assert.ok(html.includes(`rel="canonical" href="${seo.canonicalUrl}"`), `${route || "/"} canonical unchanged`)
      assert.match(html, /<h1\b[^>]*>[\s\S]*?<\/h1>/i, `${route || "/"} has an H1`)
      assert.ok(!/name="robots" content="noindex/i.test(html), `${route || "/"} remains indexable`)
      assert.ok(html.includes('type="application/ld+json"'), `${route || "/"} keeps structured data`)
      assert.ok(/href="\/(?!\/)[^"]+"/.test(html), `${route || "/"} has internal links`)
    }
  })

  await t.test("guide semantic content remains in static HTML after client route splitting", () => {
    const slugs = [
      "system-design-rate-limiter",
      "java-concurrency-interview-questions",
    ]
    for (const slug of slugs) {
      const guide = GUIDES.find((item) => item.slug === slug)!
      const html = fs.readFileSync(path.join(dist, "guides", slug, "index.html"), "utf8")
      assert.ok(html.includes(`<title>${seoForGuide(guide).title.replaceAll("&", "&amp;")}</title>`))
      assert.ok(html.includes(`rel="canonical" href="${seoForGuide(guide).canonicalUrl}"`))
      assert.ok(html.includes(guide.title) && html.includes(guide.summary))
      if (guide.quickAnswer) assert.ok(html.includes("Quick Answer") && html.includes(guide.quickAnswer))
      if (guide.keyTakeaways?.length) assert.ok(html.includes("Key Takeaways"))
      assert.ok(html.includes(`<section id="${guide.sections[0].id}">`))
      assert.ok(html.includes(guide.sections[0].title.replaceAll("&", "&amp;")))
      assert.ok(html.includes("id=\"references\"") && html.includes("Frequently Asked Questions"))
      assert.ok(html.includes("TechArticle") && html.includes("BreadcrumbList") && html.includes("FAQPage"))
      assert.ok(/href="\/(?!\/)[^"]+"/.test(html))
      const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
      assert.ok(schemas.length >= 3)
      for (const schema of schemas) assert.doesNotThrow(() => JSON.parse(schema[1]))
      assert.ok(!/name="robots" content="noindex/i.test(html))
    }
  })
})
