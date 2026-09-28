import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GUIDES } from "../src/data/guides.ts";
import { SEO_ROUTES, seoForGuide, PRODUCT_PAGE_INTROS } from "../src/config/seo.ts";
import { COMPANY_CONFIG } from "../src/config/company.ts";
import { GUIDE_CATEGORIES, GUIDE_CATEGORY_BY_ID, GUIDE_HUB_CATEGORIES } from "../src/config/guideCategories.ts";
import { generateArticleJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd, generateGuideCategoryJsonLd } from "../src/lib/structuredData.ts";
import { guideTocEntries, parseGuideMarkdown, renderGuideMarkdownHtml, renderGuideReferencesHtml } from "../src/lib/guideMarkdown.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distPath = path.resolve(projectRoot, "dist");
const templatePath = path.resolve(distPath, "index.html");

if (!fs.existsSync(templatePath)) {
  console.error("Prerender error: dist/index.html not found. Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(templatePath, "utf-8");

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function normalizePageMetadata(html, metadata) {
  const canonicalUrl = metadata.canonicalUrl;
  const singletonTags = [
    [/<title>[\s\S]*?<\/title>/gi, `<title>${escapeAttribute(metadata.title)}</title>`],
    [/<meta\s+name="description"[^>]*\/?\s*>/gi, `<meta name="description" content="${escapeAttribute(metadata.description)}" />`],
    [/<link\s+rel="canonical"[^>]*\/?\s*>/gi, `<link rel="canonical" href="${canonicalUrl}" />`],
    [/<meta\s+property="og:url"[^>]*\/?\s*>/gi, `<meta property="og:url" content="${canonicalUrl}" />`],
    [/<meta\s+property="og:title"[^>]*\/?\s*>/gi, `<meta property="og:title" content="${escapeAttribute(metadata.ogTitle)}" />`],
    [/<meta\s+property="og:description"[^>]*\/?\s*>/gi, `<meta property="og:description" content="${escapeAttribute(metadata.ogDescription)}" />`],
    [/<meta\s+property="og:type"[^>]*\/?\s*>/gi, `<meta property="og:type" content="${metadata.ogType}" />`],
    [/<meta\s+property="og:image"[^>]*\/?\s*>/gi, `<meta property="og:image" content="${metadata.socialImageUrl}" />`],
    [/<meta\s+property="og:image:width"[^>]*\/?\s*>/gi, `<meta property="og:image:width" content="${metadata.socialImageWidth}" />`],
    [/<meta\s+property="og:image:height"[^>]*\/?\s*>/gi, `<meta property="og:image:height" content="${metadata.socialImageHeight}" />`],
    [/<meta\s+property="og:image:alt"[^>]*\/?\s*>/gi, `<meta property="og:image:alt" content="${escapeAttribute(metadata.socialImageAlt)}" />`],
    [/<meta\s+name="twitter:url"[^>]*\/?\s*>/gi, `<meta name="twitter:url" content="${canonicalUrl}" />`],
    [/<meta\s+name="twitter:title"[^>]*\/?\s*>/gi, `<meta name="twitter:title" content="${escapeAttribute(metadata.twitterTitle)}" />`],
    [/<meta\s+name="twitter:description"[^>]*\/?\s*>/gi, `<meta name="twitter:description" content="${escapeAttribute(metadata.twitterDescription)}" />`],
    [/<meta\s+name="twitter:image"[^>]*\/?\s*>/gi, `<meta name="twitter:image" content="${metadata.socialImageUrl}" />`],
  ];

  for (const [pattern, replacement] of singletonTags) {
    pattern.lastIndex = 0;
    let found = false;
    html = html.replace(pattern, () => {
      if (found) return "";
      found = true;
      return replacement;
    });
    if (!found) html = html.replace("</head>", `${replacement}</head>`);
  }

  html = html.replace(/\s*<meta\s+name="robots"[^>]*\/?\s*>/gi, "");
  if (!metadata.indexable) html = html.replace("</head>", '<meta name="robots" content="noindex,follow" /></head>');
  html = html.replace(/[ \t\r\n]+<\/head>/, "\n  </head>").replace(/[ \t]+$/gm, "");
  return html;
}

function writePage(filePath, html, routeKeyOrMetadata) {
  const metadata = typeof routeKeyOrMetadata === "string" ? SEO_ROUTES[routeKeyOrMetadata] : routeKeyOrMetadata;
  fs.writeFileSync(filePath, normalizePageMetadata(html, metadata), "utf-8");
}

// Minimal guide metadata mirror for Node.js prerendering without bundling step
function generateHtml(guide) {
  let pageHtml = template;
  const schemas = [generateArticleJsonLd(guide), generateFaqJsonLd(guide), generateBreadcrumbJsonLd(guide)]
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .join("");
  pageHtml = pageHtml.replace("</head>", `${schemas}</head>`);

  const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
  const sections = guide.sections.map((section) => `
    <section id="${escapeHtml(section.id)}">
      <h2>${escapeHtml(section.title)}</h2>
      ${section.subtitle ? `<p>${escapeHtml(section.subtitle)}</p>` : ""}
      ${renderGuideMarkdownHtml(parseGuideMarkdown(section.content, section.id))}
      ${section.architectureCallout ? `<aside><h3>${escapeHtml(section.architectureCallout.title)}</h3><ul>${section.architectureCallout.points.map((point) => `<li><strong>${escapeHtml(point.label)}:</strong> ${escapeHtml(point.value)}</li>`).join("")}</ul></aside>` : ""}
      ${section.codeBlock ? `<figure>${section.codeBlock.caption ? `<figcaption>${escapeHtml(section.codeBlock.caption)}</figcaption>` : ""}<pre><code class="language-${escapeHtml(section.codeBlock.language)}">${escapeHtml(section.codeBlock.code)}</code></pre></figure>` : ""}
      ${section.keyTakeaways?.length ? `<aside><h3>Key Interview Takeaways</h3><ul>${section.keyTakeaways.map((takeaway) => `<li>${escapeHtml(takeaway)}</li>`).join("")}</ul></aside>` : ""}
    </section>
  `).join("");
  const quickAnswer = guide.quickAnswer ? `<section id="quick-answer"><h2>Quick Answer</h2><p>${escapeHtml(guide.quickAnswer)}</p></section>` : "";
  const keyTakeaways = guide.keyTakeaways?.length ? `<section id="key-takeaways"><h2>Key Takeaways</h2><ul>${guide.keyTakeaways.map((takeaway) => `<li>${escapeHtml(takeaway)}</li>`).join("")}</ul></section>` : "";
  const references = renderGuideReferencesHtml(guide.references);
  const faqs = `<section id="faqs"><h2>Frequently Asked Questions</h2>${guide.faqs.map((faq) => `<details><summary>${escapeHtml(faq.question)}</summary><p>${escapeHtml(faq.answer)}</p></details>`).join("")}</section>`;
  const toc = `<nav aria-label="Table of Contents"><h2>Table of Contents</h2><ol>${guideTocEntries(guide).map((entry) => `<li><a href="#${escapeHtml(entry.id)}">${escapeHtml(entry.title.replaceAll("`", "").replaceAll("**", ""))}</a></li>`).join("")}</ol></nav>`;
  const relatedGuides = guide.relatedGuideSlugs.map((slug) => GUIDES.find((candidate) => candidate.slug === slug)).filter(Boolean);

  // Include a semantic, no-JavaScript article representation for static crawlers.
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <article class="p-8 max-w-4xl mx-auto font-sans">
        <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/guides">Guides</a></li><li aria-current="page">${escapeHtml(guide.title)}</li></ol></nav>
        <header class="mb-8">
          <p class="text-sm font-bold text-blue-600 uppercase tracking-wider">${escapeHtml(GUIDE_CATEGORY_BY_ID[guide.primaryCategory].name)} · ${guide.readingTimeMinutes} min read</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">${escapeHtml(guide.title)}</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed">${escapeHtml(guide.summary)}</p>
          <p class="mt-4 text-sm text-slate-600">Published by ${escapeHtml(guide.author.name)} · ${escapeHtml(guide.author.role)} · Updated ${escapeHtml(guide.dateModified)}</p>
        </header>
        ${toc}
        <main>${quickAnswer}${keyTakeaways}${sections}${references}${faqs}</main>
        <nav aria-label="Related guides"><h2>Related Guides</h2><ul>${relatedGuides.map((related) => `<li><a href="/guides/${escapeHtml(related.slug)}">${escapeHtml(related.title)}</a></li>`).join("")}</ul></nav>
        <p><a href="${escapeHtml(guide.productPath)}">Continue practicing with PrepVisor</a></p>
        <section class="mt-12 p-6 rounded-2xl bg-blue-50 border border-blue-200">
          <h3 class="text-xl font-bold text-slate-900">Practice this question on PrepVisor AI Studio</h3>
          <p class="text-sm text-slate-600 mt-2">${escapeHtml(guide.cta.subtext)}</p>
          <a href="${escapeHtml(guide.cta.actionUrl)}" class="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl">${escapeHtml(guide.cta.buttonText)}</a>
        </section>
      </article>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);

  return pageHtml;
}

function generateHubHtml() {
  let pageHtml = template;
  const topicSections = GUIDE_CATEGORIES.map((category) => {
    const guides = GUIDES.filter((guide) => guide.primaryCategory === category.id);
    const hub = GUIDE_HUB_CATEGORIES.find((candidate) => candidate.id === category.id);
    return `<section><h2>${category.name}</h2><p>${category.description}</p><ul>${guides.map((guide) => `<li><a href="/guides/${guide.slug}">${guide.title}</a></li>`).join("")}</ul>${hub ? `<a href="/guides/${category.id}">Explore ${category.name} topic hub</a>` : `<a href="${category.productPath}">${category.productLinkLabel}</a>`}</section>`;
  }).join("");
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <span>Guides</span></nav>
        <h1 class="text-4xl font-black text-slate-900">Technical Interview Guides</h1>
        <p class="text-slate-600 mt-3">Browse focused guides for system design, Java and backend engineering, and data-structure and algorithm practice. Behavioral mock interview practice is available in the product.</p>
        <div class="mt-8 grid gap-6 md:grid-cols-2">${topicSections}</div>
        <div class="mt-8 space-y-4">
          ${GUIDES.map(
            (g) => `
            <div class="p-6 rounded-2xl border border-slate-200 bg-white">
              <span class="text-xs font-bold text-blue-600 uppercase">${g.category}</span>
              <h2 class="text-xl font-bold text-slate-900 mt-1"><a href="/guides/${g.slug}">${g.title}</a></h2>
              <p class="text-sm text-slate-600 mt-2">${g.metaDescription}</p>
            </div>
          `
          ).join("")}
        </div>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);

  return pageHtml;
}

function generateGuideCategoryHtml(category) {
  const categoryGuides = GUIDES.filter((guide) => guide.primaryCategory === category.id);
  const schemas = generateGuideCategoryJsonLd(category)
    .map((schema) => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`).join("");
  let pageHtml = template.replace("</head>", `${schemas}</head>`);
  const html = `<div id="root"></div><noscript><main class="p-8 max-w-5xl mx-auto font-sans">
    <nav aria-label="Breadcrumb"><ol><li><a href="/">Home</a></li><li><a href="/guides">Guides</a></li><li aria-current="page">${escapeHtml(category.name)}</li></ol></nav>
    <header class="my-8"><h1>${escapeHtml(category.name)} Interview Guides</h1><p>${escapeHtml(category.intro)}</p></header>
    <section aria-label="${escapeHtml(category.name)} guides">${categoryGuides.map((guide) => `<article><h2><a href="/guides/${escapeHtml(guide.slug)}">${escapeHtml(guide.title)}</a></h2><p>${escapeHtml(guide.summary)}</p></article>`).join("")}</section>
    <p><a href="${escapeHtml(category.productPath)}">${escapeHtml(category.productLinkLabel)}</a></p><p><a href="/guides">Browse all interview guides</a></p>
  </main></noscript>`;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, html);
  return pageHtml;
}

function generateSystemDesignHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-sky-600 uppercase tracking-widest">Interactive System Design Simulator</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Practice System Design Interviews on an Interactive Architecture Canvas</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">${PRODUCT_PAGE_INTROS.systemDesign}</p>
        </header>
        <section class="space-y-8">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Infinite Drag-and-Drop Cloud Topology</h2>
            <p class="text-slate-600 mt-2">Position load balancers, reverse proxies, microservices, caches, and relational or NoSQL datastores with gRPC, REST, and TCP protocols.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. Real-Time Capacity & Scale Calculations</h2>
            <p class="text-slate-600 mt-2">Compute Read/Write QPS, 5-Year persistent storage, 80/20 Pareto caching RAM, and network bandwidth saturation in real time.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">3. Automated Single Point of Failure (SPOF) Analysis</h2>
            <p class="text-slate-600 mt-2">AI Principal Architect inspects directional topology graphs to identify un-replicated databases and missing circuit breakers.</p>
          </div>
        </section>
        <nav aria-label="Related system design guides"><h2>Explore system design interview guides</h2><ul>${GUIDES.filter((guide) => guide.primaryCategory === "system-design").map((guide) => `<li><a href="/guides/${guide.slug}">${guide.title}</a></li>`).join("")}</ul></nav>
        <div class="mt-12 text-center p-8 rounded-2xl bg-sky-50 border border-sky-200">
          <h3 class="text-2xl font-bold text-slate-900">Ready to build your first architecture?</h3>
          <p class="text-slate-600 mt-2">Practice TinyURL, Rate Limiter, and Notification System on PrepVisor.</p>
          <a href="https://app.prepvisor.in/register?source=system_design_ssg" class="inline-block mt-4 px-8 py-3 bg-sky-600 text-white font-bold rounded-xl shadow-sm">Launch Free System Design Studio</a>
        </div>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateMockInterviewHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-purple-600 uppercase tracking-widest">AI Voice Mock Interviewer</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Practice Technical and Behavioral Mock Interviews</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">${PRODUCT_PAGE_INTROS.mockInterview}</p>
        </header>
        <section class="space-y-8">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Real-Time Conversational Voice Recognition</h2>
            <p class="text-slate-600 mt-2">Capture your spoken articulation in real time with browser-native low latency Speech-to-Text recognition.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. STAR Method Evaluation (Situation, Task, Action, Result)</h2>
            <p class="text-slate-600 mt-2">Aligned with Amazon Leadership Principles and Google behavioral loops, scoring technical depth and business impact.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">3. Leadership Ownership Ratio ('I' vs 'we')</h2>
            <p class="text-slate-600 mt-2">Identifies personal contributions and quantifiable metric density (latency drop, user growth, incident resolution time).</p>
          </div>
        </section>
        <nav aria-label="Related mock interview guide"><h2>Prepare for technical interview questions</h2><a href="/guides/java-concurrency-interview-questions">Top Java Concurrency Interview Questions</a></nav>
        <div class="mt-12 text-center p-8 rounded-2xl bg-purple-50 border border-purple-200">
          <h3 class="text-2xl font-bold text-slate-900">Eliminate interview day nervousness</h3>
          <p class="text-slate-600 mt-2">Start your first voice mock interview session with instant feedback.</p>
          <a href="https://app.prepvisor.in/register?source=mock_interview_ssg" class="inline-block mt-4 px-8 py-3 bg-purple-600 text-white font-bold rounded-xl shadow-sm">Start Free Voice Mock Session</a>
        </div>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateCodingPracticeHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest">DSA Coding Studio</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Practice DSA Coding Interview Problems Online</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">${PRODUCT_PAGE_INTROS.codingPractice}</p>
        </header>
        <section class="space-y-8">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Modern Java First-Class Support</h2>
            <p class="text-slate-600 mt-2">Practice with modern language features (Virtual Threads, Records, Stream API) alongside Python 3.12, C++ 20, and TypeScript.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. Live Terminal Console Output (stdout)</h2>
            <p class="text-slate-600 mt-2">Capture print statements (System.out.println, print(), console.log()) directly in your browser terminal for rapid debugging.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">3. Big-O Algorithmic Complexity Scoring</h2>
            <p class="text-slate-600 mt-2">Automatic analysis of Time and Auxiliary Space complexity benchmarks to ensure optimal performance.</p>
          </div>
        </section>
        <nav aria-label="Related coding guide"><h2>Read a data-structure implementation guide</h2><a href="/guides/lru-cache-implementation">LRU Cache Implementation: Step-by-Step in Java, Python &amp; C++</a></nav>
        <div class="mt-12 text-center p-8 rounded-2xl bg-emerald-50 border border-emerald-200">
          <h3 class="text-2xl font-bold text-slate-900">Write clean, production-grade algorithms</h3>
          <p class="text-slate-600 mt-2">Run test cases and verify complexity on PrepVisor.</p>
          <a href="https://app.prepvisor.in/register?source=coding_practice_ssg" class="inline-block mt-4 px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-sm">Launch Free Coding Studio</a>
        </div>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateHomeHtml() {
  let pageHtml = template;

  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-6xl mx-auto font-sans">
        <header class="mb-12 text-center">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">The Technical Interview Workbench</p>
          <h1 class="text-5xl font-black text-slate-900 mt-3 leading-tight">AI Interview Preparation for Software Engineers</h1>
          <p class="text-2xl font-semibold text-blue-700 mt-2">Engineered for the final round.</p>
          <p class="text-xl text-slate-600 mt-4 leading-relaxed max-w-3xl mx-auto">
            Prepare for software engineering interviews with personalized study roadmaps, DSA coding practice, system design simulations and AI mock interviews. Start free.
          </p>
          <div class="mt-8 flex justify-center gap-4">
            <a href="https://app.prepvisor.in/register?source=home_ssg" class="px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-sm">Get Your Free Interview Roadmap →</a>
            <a href="/pricing" class="px-8 py-3.5 border border-slate-300 bg-white text-slate-700 font-semibold rounded-xl">View Pricing Plans</a>
          </div>
          <p class="text-xs text-slate-500 mt-4">✓ No credit card required • ✓ Free forever tier (3 mock interviews) • ✓ Instant electronic access</p>
        </header>

        <section class="mt-16 space-y-12">
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 1: Time-Aware Daily Pacing & 1-Click Rebalance Schedule</h2>
            <p class="text-slate-600 mt-2">Dynamic day-by-day preparation curriculum calibrated around your interview date (7 to 60+ days) and commitments (1 to 4 hrs/day).</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 2: Interactive DSA Coding Arena with Terminal Stdout</h2>
            <p class="text-slate-600 mt-2">VS Code-grade Cloud IDE with Java default, Python, C++, and TypeScript. Real-time stdout console for print debugging and Big-O complexity evaluation.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 3: Infinite System Design Whiteboard with Real-Time Scale Math</h2>
            <p class="text-slate-600 mt-2">Drag-and-drop cloud architecture canvas with live back-of-the-envelope calculations for QPS, 5-Year storage, RAM, and SPOF analysis.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 4: Voice Speech-to-Text AI Mock Interviews & STAR Method Scoring</h2>
            <p class="text-slate-600 mt-2">Practice speaking out loud naturally. Real-time evaluation of Situation, Task, Action, Result, metric density, and leadership ownership.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 5: Multiple Tech Roles Supported & Custom Role Option</h2>
            <p class="text-slate-600 mt-2">Comprehensive support for multiple engineering domains and seniority levels, with a Custom Role option to tailor prep to your target job description.</p>
          </div>
          <div class="p-8 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">Pillar 6: Timed Technical Assessments & AI Evaluation Reports</h2>
            <p class="text-slate-600 mt-2">Simulate real company online assessments (OAs) under a live countdown timer. Receive instant AI grading with skill proficiency bars and targeted blind spot analysis.</p>
          </div>
        </section>

        <section class="mt-16 p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <h2 class="text-2xl font-bold text-slate-900 mb-4">Technical Interview Blueprints & Study Guides</h2>
          <ul class="grid gap-3 sm:grid-cols-2 text-sm text-slate-700 font-medium">
            <li><a href="/guides/system-design-tinyurl" class="text-blue-600 hover:underline">System Design: How to Design TinyURL (Architecture & Capacity)</a></li>
            <li><a href="/guides/system-design-rate-limiter" class="text-blue-600 hover:underline">System Design: How to Design an API Rate Limiter (Token Bucket)</a></li>
            <li><a href="/guides/system-design-notification-service" class="text-blue-600 hover:underline">System Design: How to Design a Notification System at Scale</a></li>
            <li><a href="/guides/java-concurrency-interview-questions" class="text-blue-600 hover:underline">Top 50 Java Concurrency Interview Questions (2026 Edition)</a></li>
            <li><a href="/guides/spring-boot-microservices-interview-questions" class="text-blue-600 hover:underline">Spring Boot & Microservices Interview Questions (3-6 Yrs)</a></li>
            <li><a href="/guides/lru-cache-implementation" class="text-blue-600 hover:underline">LRU Cache Implementation: Step-by-Step in Java, Python & C++</a></li>
          </ul>
        </section>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generatePricingHtml() {
  let pageHtml = template;
  const pricingCards = COMPANY_CONFIG.pricing.map((plan) => {
    const isFree = plan.priceINR === 0;
    const registerUrl = `${COMPANY_CONFIG.appUrl}/register${isFree ? "" : `?plan=${encodeURIComponent(plan.id)}`}`;
    const badge = plan.badge ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-100 px-3 py-0.5 text-[10px] font-mono uppercase tracking-wider text-slate-700">${escapeHtml(plan.badge)}</span>` : "";
    const originalPrice = plan.originalPriceINR > 0
      ? `<span class="text-xs font-mono text-slate-400 line-through">₹${plan.originalPriceINR}</span><span class="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-mono text-emerald-700">-${Math.round(((plan.originalPriceINR - plan.priceINR) / plan.originalPriceINR) * 100)}%</span>`
      : "";
    const duration = isFree ? "" : `<p class="mt-1 text-[11px] font-mono text-slate-500">One-time · ${plan.days}-day access pass</p>`;
    const inclusions = plan.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("");
    return `<article data-plan-id="${escapeHtml(plan.id)}" aria-labelledby="pricing-plan-${escapeHtml(plan.id)}" class="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6">
      ${badge}
      <div class="space-y-4"><div><h2 id="pricing-plan-${escapeHtml(plan.id)}" class="text-xl font-bold text-slate-900">${escapeHtml(plan.name)}</h2><p class="mt-1 text-xs leading-relaxed text-slate-600">${escapeHtml(plan.subtitle)}</p></div>
      <div class="border-t border-slate-100 pt-4"><div class="flex items-baseline gap-2"><span class="text-2xl font-black text-slate-900">${isFree ? "Free" : `₹${plan.priceINR}`}</span>${originalPrice}</div>${duration}<p class="mt-1 text-[10px] text-emerald-700">${isFree ? "Full feature exploration" : "Inclusive of all taxes"}</p></div>
      <ul class="space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-700">${inclusions}</ul></div>
      <a href="${escapeHtml(registerUrl)}" aria-label="${isFree ? "Start Free" : `Get started with ${escapeHtml(plan.name)}`}" class="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white">${isFree ? "Start Free" : "Get Started"}</a>
    </article>`;
  }).join("\n");
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">Transparent & Honest Pricing</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">PrepVisor Pricing Plans & Preparation Passes</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">
            Choose a preparation plan that fits your interview timeline. Instant electronic digital access with zero hidden auto-renewals.
          </p>
        </header>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">${pricingCards}</div>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateRoadmapHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-5xl mx-auto font-sans">
        <header class="mb-10 text-center">
          <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">Dynamic Daily Pacing Engine</p>
          <h1 class="text-4xl font-black text-slate-900 mt-2">Software Engineer Interview Preparation Plan</h1>
          <p class="text-lg text-slate-600 mt-4 leading-relaxed max-w-2xl mx-auto">${PRODUCT_PAGE_INTROS.roadmap}</p>
        </header>
        <section class="space-y-6">
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">1. Time-Aware Calendar Calibration</h2>
            <p class="text-slate-600 mt-2">Select from 7, 14, 30, or 60+ days with 1 to 4 hours daily commitment.</p>
          </div>
          <div class="p-6 rounded-2xl border border-slate-200 bg-white">
            <h2 class="text-2xl font-bold text-slate-900">2. 1-Click Schedule Rebalancing</h2>
            <p class="text-slate-600 mt-2">Missed a day? Tap rebalance to smoothly spread incomplete tasks without guilt or falling behind.</p>
          </div>
        </section>
        <nav aria-label="Guides for interview preparation"><h2>Guides to support technical preparation</h2><ul><li><a href="/guides/system-design-tinyurl">System design: TinyURL architecture guide</a></li><li><a href="/guides/java-concurrency-interview-questions">Java concurrency interview guide</a></li><li><a href="/guides/lru-cache-implementation">LRU cache implementation guide</a></li></ul></nav>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateAboutHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">About PrepVisor</h1>
        <p class="text-slate-600 mt-4 leading-relaxed">
          PrepVisor was founded in Bengaluru, India by Divya Rajkumar Almelkar to solve fragmented and time-blind tech interview preparation. We combine time-aware dynamic pacing, live terminal execution, distributed system design with capacity math, and voice AI behavioral mock interviews into one cohesive platform.
        </p>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateContactHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Contact PrepVisor</h1>
        <p class="text-slate-600 mt-2">Email: support@prepvisor.in | Phone: +91 7249778116</p>
        <p class="text-slate-600 mt-1">Address: Flat 201, Aurum Residencies, Maruthi Nagar, BTM Layout Stage 1, Bengaluru, Karnataka 560068, India</p>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateTermsHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Terms of Service</h1>
        <p class="text-slate-600 mt-4">Governed by the Laws of India. Operated by PrepVisor (Divya Rajkumar Almelkar, Individual).</p>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generatePrivacyHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p class="text-slate-600 mt-4">Compliant with the Digital Personal Data Protection Act (DPDP Act) 2023.</p>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateRefundHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-4xl mx-auto font-sans">
        <h1 class="text-4xl font-black text-slate-900">Cancellation & Refund Policy</h1>
        <p class="text-slate-600 mt-4">7-day refund window for first-time pass purchases under fair evaluation.</p>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

function generateNotFoundHtml() {
  let pageHtml = template;
  const staticContent = `
    <div id="root"></div>
    <noscript>
      <main class="p-8 max-w-4xl mx-auto text-center font-sans">
        <h1 class="text-5xl font-black text-slate-900">404</h1>
        <p class="text-xl text-slate-600 mt-4">Page Not Found</p>
        <p class="text-sm text-slate-500 mt-2">The page you were looking for doesn't exist or was moved.</p>
        <a href="/" class="inline-block mt-6 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Return to Homepage</a>
      </main>
    </noscript>
  `;
  pageHtml = pageHtml.replace(/<div id="root"><\/div>/, staticContent);
  return pageHtml;
}

// 1. Pre-render Root Homepage (dist/index.html)
writePage(templatePath, generateHomeHtml(), "home");
console.log("✓ Pre-rendered: dist/index.html (Homepage)");

// 2. Pre-render Feature Pillar Pages
const sdDir = path.resolve(distPath, "system-design");
fs.mkdirSync(sdDir, { recursive: true });
writePage(path.resolve(sdDir, "index.html"), generateSystemDesignHtml(), "systemDesign");
console.log("✓ Pre-rendered: dist/system-design/index.html");

const miDir = path.resolve(distPath, "mock-interview");
fs.mkdirSync(miDir, { recursive: true });
writePage(path.resolve(miDir, "index.html"), generateMockInterviewHtml(), "mockInterview");
console.log("✓ Pre-rendered: dist/mock-interview/index.html");

const cpDir = path.resolve(distPath, "coding-practice");
fs.mkdirSync(cpDir, { recursive: true });
writePage(path.resolve(cpDir, "index.html"), generateCodingPracticeHtml(), "codingPractice");
console.log("✓ Pre-rendered: dist/coding-practice/index.html");

// 3. Pre-render Pricing, Roadmap, About, Contact
const pricingDir = path.resolve(distPath, "pricing");
fs.mkdirSync(pricingDir, { recursive: true });
writePage(path.resolve(pricingDir, "index.html"), generatePricingHtml(), "pricing");
console.log("✓ Pre-rendered: dist/pricing/index.html");

const roadmapDir = path.resolve(distPath, "roadmap");
fs.mkdirSync(roadmapDir, { recursive: true });
writePage(path.resolve(roadmapDir, "index.html"), generateRoadmapHtml(), "roadmap");
console.log("✓ Pre-rendered: dist/roadmap/index.html");

const aboutDir = path.resolve(distPath, "about");
fs.mkdirSync(aboutDir, { recursive: true });
writePage(path.resolve(aboutDir, "index.html"), generateAboutHtml(), "about");
console.log("✓ Pre-rendered: dist/about/index.html");

const contactDir = path.resolve(distPath, "contact");
fs.mkdirSync(contactDir, { recursive: true });
writePage(path.resolve(contactDir, "index.html"), generateContactHtml(), "contact");
console.log("✓ Pre-rendered: dist/contact/index.html");

// 4. Pre-render Terms, Privacy, Refund
const termsDir = path.resolve(distPath, "terms");
fs.mkdirSync(termsDir, { recursive: true });
writePage(path.resolve(termsDir, "index.html"), generateTermsHtml(), "terms");
console.log("✓ Pre-rendered: dist/terms/index.html");

const privacyDir = path.resolve(distPath, "privacy");
fs.mkdirSync(privacyDir, { recursive: true });
writePage(path.resolve(privacyDir, "index.html"), generatePrivacyHtml(), "privacy");
console.log("✓ Pre-rendered: dist/privacy/index.html");

const refundDir = path.resolve(distPath, "refund-policy");
fs.mkdirSync(refundDir, { recursive: true });
writePage(path.resolve(refundDir, "index.html"), generateRefundHtml(), "refundPolicy");
console.log("✓ Pre-rendered: dist/refund-policy/index.html");

// 5. Pre-render 404.html (for static hosting servers & CDNs)
writePage(path.resolve(distPath, "404.html"), generateNotFoundHtml(), "notFound");
console.log("✓ Pre-rendered: dist/404.html");

// 6. Generate /guides/index.html
const hubDir = path.resolve(distPath, "guides");
fs.mkdirSync(hubDir, { recursive: true });
writePage(path.resolve(hubDir, "index.html"), generateHubHtml(), "guides");
console.log("✓ Pre-rendered: dist/guides/index.html");

const hubSeoKeyById = {
  "system-design": "guideSystemDesign",
  "java-backend": "guideJavaBackend",
  dsa: "guideDsa",
};
for (const category of GUIDE_HUB_CATEGORIES) {
  const categoryDir = path.resolve(distPath, "guides", category.id);
  fs.mkdirSync(categoryDir, { recursive: true });
  writePage(path.resolve(categoryDir, "index.html"), generateGuideCategoryHtml(category), hubSeoKeyById[category.id]);
  console.log(`✓ Pre-rendered: dist/guides/${category.id}/index.html`);
}

// 7. Generate each guide static page
for (const guide of GUIDES) {
  const guideDir = path.resolve(distPath, "guides", guide.slug);
  fs.mkdirSync(guideDir, { recursive: true });
  writePage(path.resolve(guideDir, "index.html"), generateHtml(guide), seoForGuide(guide));
  console.log(`✓ Pre-rendered: dist/guides/${guide.slug}/index.html`);
}

const sitemapPaths = [
  ...Object.values(SEO_ROUTES).filter((metadata) => metadata.indexable && metadata.pathname !== "*").map((metadata) => metadata.canonicalUrl),
  ...GUIDES.map((guide) => seoForGuide(guide).canonicalUrl),
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(sitemapPaths)].map((url) => `  <url><loc>${url.replaceAll("&", "&amp;")}</loc></url>`).join("\n")}\n</urlset>\n`;
fs.writeFileSync(path.resolve(distPath, "sitemap.xml"), sitemapXml, "utf-8");
console.log("✓ Generated dist/sitemap.xml from shared SEO routes and guide configuration");

console.log("🚀 Programmatic SEO & Full Site Static Pre-rendering Complete!");
