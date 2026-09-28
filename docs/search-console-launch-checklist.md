# Search Console launch checklist

Repository checks do not prove how the deployed host responds. Complete the post-deploy checks against `https://prepvisor.in` after deployment. This checklist does not promise or guarantee ranking changes.

## Pre-deploy

- [ ] Run `npm test` and confirm all tests pass.
- [ ] Run `npm run build` and review the production output.
- [ ] Validate `dist/sitemap.xml`: all listed locations are unique, use the canonical `https://prepvisor.in` host, and match generated page canonicals; no 404, private, query-string, or noncanonical URL is included.
- [ ] Validate exactly one title, description, canonical, OG title/description/URL/type, Twitter title/description/URL, and social image per indexable HTML route; confirm there is no accidental `noindex`.
- [ ] Confirm the social image exists at `dist/og-image.png`, is 1200×630, and its absolute production URL is used by OG/Twitter metadata.
- [ ] Parse JSON-LD on the homepage, category hubs, and a guide. Confirm expected Organization/WebSite/SoftwareApplication, CollectionPage/BreadcrumbList, and TechArticle/BreadcrumbList/FAQPage types as applicable; do not add invented ratings, reviews, credentials, or prices.
- [ ] Review `public/robots.txt` for crawl access to public pages and the absolute sitemap URL. Do not use robots.txt as access control.
- [ ] Review `public/_redirects` against the active hosting provider. Its current catch-all rewrite can produce a 200 response for unknown paths on compatible hosts; do not assume the deploy host honors this file or provides a real 404 without testing.
- [ ] No Google/Bing verification token is currently configured in the repository. Once the owner supplies the real token, add it in the site `<head>` through the shared HTML template; alternatively verify domain ownership with the provider’s DNS method. Never commit a placeholder token.

## Post-deploy

- [ ] Verify `https://prepvisor.in/` loads over HTTPS and selects `https://prepvisor.in/` as canonical.
- [ ] Submit `https://prepvisor.in/sitemap.xml` in Google Search Console (and the relevant webmaster tools if used).
- [ ] Inspect the homepage, `/system-design`, `/coding-practice`, `/mock-interview`, and `/guides/system-design-rate-limiter` in URL Inspection.
- [ ] Verify rendered HTML and the canonical selected by the search engine; confirm title, description, robots directive, JSON-LD, and OG/Twitter image.
- [ ] Request indexing only for eligible, published URLs where inspection indicates it is appropriate; do not request indexing for the 404 page or private application content.
- [ ] Confirm HTTPS/canonical host selection and test redirects: HTTP→HTTPS, `www`→`prepvisor.in`, trailing-slash variants, `/route` vs `/route/`, unknown paths, and case variants where relevant.
- [ ] Confirm unknown paths return an actual HTTP 404 status, not just a client-side not-found page or a 200 rewrite.

## Monitor

- [ ] Indexed pages and excluded pages.
- [ ] Canonical mismatches and duplicate URL reports.
- [ ] Crawl errors and sitemap processing errors.
- [ ] Search queries, impressions, clicks, CTR, and average position.
- [ ] Core Web Vitals and page experience reports.

## Optional manual production smoke check

After deployment, run `npm run seo:production-check`. It checks selected live routes, canonicals, the sitemap and social image, plus the HTTP status of a deliberately nonexistent URL. It requires network access and is intentionally not part of the normal build or test suite.
