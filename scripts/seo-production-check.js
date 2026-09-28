const baseUrl = "https://prepvisor.in"
const routes = [
  ["/", `${baseUrl}/`],
  ["/roadmap", `${baseUrl}/roadmap`],
  ["/coding-practice", `${baseUrl}/coding-practice`],
  ["/system-design", `${baseUrl}/system-design`],
  ["/mock-interview", `${baseUrl}/mock-interview`],
  ["/pricing", `${baseUrl}/pricing`],
  ["/about", `${baseUrl}/about`],
  ["/guides", `${baseUrl}/guides`],
  ["/guides/system-design-rate-limiter", `${baseUrl}/guides/system-design-rate-limiter`],
]

async function fetchText(url) {
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(12000) })
    return { response, body: await response.text() }
  } catch (error) {
    throw new Error(`Could not reach ${url}; production SEO check did not complete (${error.message})`)
  }
}

for (const [route, expectedCanonical] of routes) {
  const { response, body } = await fetchText(`${baseUrl}${route}`)
  if (!response.ok) throw new Error(`${route} returned HTTP ${response.status}`)
  const canonical = body.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i)?.[1]
  if (canonical !== expectedCanonical) throw new Error(`${route} canonical mismatch: expected ${expectedCanonical}, got ${canonical ?? "none"}`)
  if (!/<title>[^<]+<\/title>/i.test(body)) throw new Error(`${route} has no rendered title`)
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(body)) throw new Error(`${route} has no meta description`)
  if (body.includes('name="robots" content="noindex')) throw new Error(`${route} unexpectedly has noindex`)
  if (!body.includes('property="og:image" content="https://prepvisor.in/og-image.png"')) {
    throw new Error(`${route} is missing the configured Open Graph image`)
  }
  console.log(`PASS ${route}: HTTP ${response.status}, canonical and social image verified`)
}

const { response: sitemapResponse, body: sitemap } = await fetchText(`${baseUrl}/sitemap.xml`)
if (!sitemapResponse.ok) throw new Error(`/sitemap.xml returned HTTP ${sitemapResponse.status}`)
if (!sitemap.includes("https://prepvisor.in/")) throw new Error("Sitemap does not include the production homepage")
console.log("PASS /sitemap.xml is reachable and includes the production homepage")

const { response: imageResponse } = await fetchText(`${baseUrl}/og-image.png`)
if (!imageResponse.ok) throw new Error(`/og-image.png returned HTTP ${imageResponse.status}`)
console.log("PASS /og-image.png is reachable")

const { response: unknownResponse, body: unknownBody } = await fetchText(`${baseUrl}/phase-7-check-this-route-must-not-exist`)
if (unknownResponse.status !== 404) {
  throw new Error(`Unknown route returned HTTP ${unknownResponse.status}; expected a real 404 (possible soft 404)`)
}
if (!/name="robots"[^>]*noindex/i.test(unknownBody)) console.warn("WARN unknown route is 404 but no noindex metadata was found")
console.log("PASS unknown route returns HTTP 404")
