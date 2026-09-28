import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import { matchRoutes } from "react-router-dom"
import { SEO_ROUTES } from "../src/config/seo.ts"
import { resolveGuideCategoryId } from "../src/lib/guideRouting.ts"

const appSource = fs.readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8")
const appRoutes = [...appSource.matchAll(/<Route\s+path="([^"]+)"/g)].map(([, path]) => ({ path }))

test("guide hubs resolve with and without trailing slashes and keep non-slash canonicals", () => {
  const hubs = [
    ["/guides/system-design", "system-design", SEO_ROUTES.guideSystemDesign],
    ["/guides/system-design/", "system-design", SEO_ROUTES.guideSystemDesign],
    ["/guides/java-backend/", "java-backend", SEO_ROUTES.guideJavaBackend],
    ["/guides/dsa/", "dsa", SEO_ROUTES.guideDsa],
  ] as const

  for (const [pathname, categoryId, metadata] of hubs) {
    assert.equal(resolveGuideCategoryId(pathname), categoryId, `${pathname} resolves to its category`)
    assert.equal(resolveGuideCategoryId(pathname, `${categoryId}/`), categoryId, `${pathname} tolerates a trailing slash in route params`)
    assert.equal(metadata.canonicalUrl, `https://prepvisor.in/guides/${categoryId}`)
    assert.equal(metadata.canonicalUrl.endsWith("/"), false)
    assert.equal(matchRoutes(appRoutes, pathname)?.at(-1)?.route.path, `/guides/${categoryId}`)
  }
})

test("product and guide routes continue matching trailing-slash variants", () => {
  const cases = [
    ["/system-design/", "/system-design"],
    ["/coding-practice/", "/coding-practice"],
    ["/guides/system-design-rate-limiter/", "/guides/:slug"],
  ] as const

  for (const [pathname, expectedRoute] of cases) {
    assert.equal(matchRoutes(appRoutes, pathname)?.at(-1)?.route.path, expectedRoute, `${pathname} keeps matching ${expectedRoute}`)
  }
})

test("guide category resolution rejects unknown paths and IDs", () => {
  assert.equal(resolveGuideCategoryId("/guides/unknown/"), undefined)
  assert.equal(resolveGuideCategoryId("/system-design/"), undefined)
  assert.equal(resolveGuideCategoryId("/guides/system-design/", "unknown/"), "system-design")
})
