import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

test("Website Pillar Pages & SEO Architecture Suite", async (t) => {
  await t.test("1. sitemap.xml registers all feature pillar pages and primary routes", () => {
    const sitemapPath = path.resolve(projectRoot, "public/sitemap.xml");
    assert.ok(fs.existsSync(sitemapPath), "public/sitemap.xml must exist");

    const content = fs.readFileSync(sitemapPath, "utf-8");
    assert.ok(content.includes("https://prepvisor.in/system-design"), "Must include /system-design");
    assert.ok(content.includes("https://prepvisor.in/mock-interview"), "Must include /mock-interview");
    assert.ok(content.includes("https://prepvisor.in/coding-practice"), "Must include /coding-practice");
    assert.ok(content.includes("https://prepvisor.in/roadmap"), "Must include /roadmap");
    assert.ok(content.includes("https://prepvisor.in/pricing"), "Must include /pricing");
    assert.ok(content.includes("https://prepvisor.in/guides"), "Must include /guides");
  });

  await t.test("2. manifest.json and robots.txt exist with valid configurations", () => {
    const manifestPath = path.resolve(projectRoot, "public/manifest.json");
    assert.ok(fs.existsSync(manifestPath), "public/manifest.json must exist");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    assert.equal(manifest.short_name, "PrepVisor");
    assert.ok(manifest.icons && manifest.icons.length > 0, "Must have icons defined");

    const robotsPath = path.resolve(projectRoot, "public/robots.txt");
    assert.ok(fs.existsSync(robotsPath), "public/robots.txt must exist");
    const robots = fs.readFileSync(robotsPath, "utf-8");
    assert.ok(robots.includes("Sitemap: https://prepvisor.in/sitemap.xml"), "robots.txt must declare sitemap");
  });

  await t.test("3. index.html contains canonical tag, preconnects, and safe schemas without fake ratings", () => {
    const indexPath = path.resolve(projectRoot, "index.html");
    const content = fs.readFileSync(indexPath, "utf-8");

    assert.ok(content.includes('<link rel="canonical" href="https://prepvisor.in/" />'), "Must contain canonical tag");
    assert.ok(content.includes('SoftwareApplication'), "Must contain SoftwareApplication schema");
    assert.ok(content.includes('Organization'), "Must contain Organization schema");
    assert.ok(content.includes('WebSite'), "Must contain WebSite schema");
    assert.ok(content.includes('fonts.googleapis.com'), "Must preconnect Google Fonts");
    assert.ok(content.includes('app.prepvisor.in'), "Must preconnect app origin");
    assert.ok(content.includes('/manifest.json'), "Must link manifest.json");
    assert.ok(!content.includes('aggregateRating'), "Must not contain fabricated aggregateRating");
  });

  await t.test("4. Pre-rendered build outputs exist for all pillars, pages, and 404", () => {
    const distPath = path.resolve(projectRoot, "dist");
    if (!fs.existsSync(distPath)) return;

    assert.ok(fs.existsSync(path.resolve(distPath, "index.html")), "dist/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "system-design/index.html")), "dist/system-design/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "mock-interview/index.html")), "dist/mock-interview/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "coding-practice/index.html")), "dist/coding-practice/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "pricing/index.html")), "dist/pricing/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "roadmap/index.html")), "dist/roadmap/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "about/index.html")), "dist/about/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "contact/index.html")), "dist/contact/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "terms/index.html")), "dist/terms/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "privacy/index.html")), "dist/privacy/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "refund-policy/index.html")), "dist/refund-policy/index.html must exist");
    assert.ok(fs.existsSync(path.resolve(distPath, "404.html")), "dist/404.html must exist");

    const roadmapContent = fs.readFileSync(path.resolve(distPath, "roadmap/index.html"), "utf-8");
    assert.ok(roadmapContent.includes("https://prepvisor.in/roadmap"), "Roadmap page must have canonical URL");
    assert.ok(roadmapContent.includes("Dynamic Daily Pacing Engine"), "Roadmap headline pre-rendered");

    const pricingContent = fs.readFileSync(path.resolve(distPath, "pricing/index.html"), "utf-8");
    assert.ok(pricingContent.includes("https://prepvisor.in/pricing"), "Pricing page must have canonical URL");
    assert.ok(pricingContent.includes("PrepVisor Pricing Plans"), "Pricing headline pre-rendered");

    const notFoundContent = fs.readFileSync(path.resolve(distPath, "404.html"), "utf-8");
    assert.ok(notFoundContent.includes("Page Not Found"), "404 page pre-rendered headline");
  });
});
