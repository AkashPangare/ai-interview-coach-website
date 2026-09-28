# Public-site performance baseline

Phase 6 uses the production build output as a repeatable bundle-size report. These are emitted asset sizes, not measured Core Web Vitals.

Before optimization, the build emitted one JavaScript chunk at 650,280 bytes (635.0 KiB; 177.3 kB gzip) and one CSS file at 66,470 bytes (64.9 KiB; 10.8 kB gzip). The browser entry imported all route pages, and the guide hub/category/detail modules all reached the full guide-data module.

After optimization, record both the entry chunk and route-on-demand chunks. For public landing pages, the entry chunk should not regress above the optimized baseline without review. The homepage's route chunk and its emitted icon dependencies should be considered when measuring the first visit; do not compare the entry chunk alone as if it were all initial JavaScript.

Phase 6 measured output (2026-09-28):

| Asset/category | Before | After | Change |
| --- | ---: | ---: | ---: |
| Entry JS | 650,280 B / 177.3 kB gzip | 263,757 B / 84.0 kB gzip | −59.4% raw |
| Homepage first-visit JS (entry + route and preload dependencies) | 650,280 B / 177.3 kB gzip | 338,687 B / 102.2 kB gzip | −47.9% raw |
| Largest emitted JS chunk | 650,280 B | 263,757 B (entry) | −59.4% raw |
| Homepage route chunk | bundled into entry | 59,427 B / 12.7 kB gzip | route isolated |
| Guide detail route chunk (all guide bodies) | bundled into entry | 128,875 B / 43.3 kB gzip | route isolated |
| Total emitted JavaScript | 650,280 B | 670,837 B | +3.2% raw |
| JS chunk count | 1 | 45 | +44 |
| CSS | 66,470 B / 10.8 kB gzip | 66,733 B / 10.8 kB gzip | +0.4% raw |

The first-visit figures sum emitted JavaScript files fetched by the entry plus the homepage dynamic import's preload list. Gzip numbers are sums of compressed asset sizes and exclude HTTP headers and transfer-protocol effects. The total-JS increase comes from split chunks and individually emitted small tree-shaken icon modules; total output is not a proxy for first-visit download size. The guide detail chunk currently includes the six guide bodies together, and is requested only after navigation to a guide detail route.

Run `npm run build` and inspect the per-file raw and gzip sizes printed by Vite. The build currently has no automatic fail threshold: review regressions alongside route-specific transfer needs and static-prerender checks. Total emitted JavaScript is not the same as initial JavaScript.

No Lighthouse or field Core Web Vitals results are claimed by this report. Measure LCP, CLS, and INP/TBT in a controlled browser or production environment before claiming user-experience improvement.
