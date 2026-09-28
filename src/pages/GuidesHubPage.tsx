import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { GUIDE_INDEX } from "@/data/guideIndex";
import {
  Clock,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  Code2,
  Calendar,
  Server,
  Binary,
} from "lucide-react";
import { decorateUrlWithUtms, trackEvent } from "@/lib/analytics";
import { usePageSeo } from "@/hooks/usePageSeo";
import { SEO_ROUTES } from "@/config/seo";
import { COMPANY_CONFIG } from "@/config/company";
import { GUIDE_CATEGORIES, GUIDE_CATEGORY_BY_ID, GUIDE_HUB_CATEGORIES } from "@/config/guideCategories";

export const GuidesHubPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  usePageSeo(SEO_ROUTES.guides);

  useEffect(() => {
    trackEvent("guides_hub_viewed", {});
  }, []);

  const categories = ["All", ...GUIDE_CATEGORIES.map((category) => category.name)];

  const filteredGuides = useMemo(() => {
    return GUIDE_INDEX.filter((guide) => {
      const matchesCategory =
        selectedCategory === "All" || GUIDE_CATEGORY_BY_ID[guide.primaryCategory].name === selectedCategory;
      const matchesSearch =
        guide.title.toLowerCase().includes(search.toLowerCase()) ||
        guide.summary.toLowerCase().includes(search.toLowerCase()) ||
        guide.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white pb-20 relative">
      {/* Header */}
      <header className="border-b border-slate-200 relative overflow-hidden py-16 sm:py-24 bg-white/70">
        {/* Ambient Hero Backdrop (Seamless Masked Dot Grid + Glow) */}
        <div className="absolute inset-0 bg-dot-grid hero-mask pointer-events-none" />
        <div className="absolute inset-0 glow-blue pointer-events-none" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Curated Engineering Study Library</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.12]">
            Technical Interview Blueprints
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Focused engineering guides on system design, Java and backend architecture, and data-structure implementation for technical interview preparation.
          </p>

          {/* Search & Category Filter */}
          <div className="mt-8 max-w-xl mx-auto space-y-4 pt-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guides by topic (e.g. TinyURL, Concurrency, Virtual Threads)..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition shadow-xs"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  aria-pressed={selectedCategory === cat}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white font-semibold shadow-xs"
                      : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-xs"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Guides Grid */}
      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <section aria-labelledby="guide-topics-heading" className="mb-10 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 id="guide-topics-heading" className="text-2xl font-semibold">Browse interview topics</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {GUIDE_CATEGORIES.map((category) => {
          const categoryGuides = GUIDE_INDEX.filter((guide) => guide.primaryCategory === category.id);
              const hasHub = GUIDE_HUB_CATEGORIES.some((hub) => hub.id === category.id);
              return <section key={category.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">{category.name}</h3>
                <p className="mt-1 text-sm text-slate-600">{category.description}</p>
                <ul className="mt-3 space-y-1 text-sm">{categoryGuides.map((guide) => <li key={guide.slug}><Link className="text-blue-700 hover:underline" to={`/guides/${guide.slug}`}>{guide.title}</Link></li>)}</ul>
                {hasHub ? <Link className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline" to={`/guides/${category.id}`}>Explore {category.name} topic hub</Link> : <Link className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline" to={category.productPath}>{category.productLinkLabel}</Link>}
              </section>
            })}
          </div>
        </section>
        {filteredGuides.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm font-mono">
            No guides found matching "{search}". Try searching for another keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredGuides.map((guide) => (
              <article
                key={guide.slug}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 hover:border-slate-300 hover:shadow-md transition-all shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-semibold">
                      {guide.primaryCategory === "system-design" ? (
                        <Layers className="h-3 w-3" />
                      ) : guide.primaryCategory === "java-backend" ? (
                        <Server className="h-3 w-3" />
                      ) : guide.primaryCategory === "dsa" ? (
                        <Binary className="h-3 w-3" />
                      ) : (
                        <Code2 className="h-3 w-3" />
                      )}
                      {GUIDE_CATEGORY_BY_ID[guide.primaryCategory].name}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {guide.readingTimeMinutes} min
                      </span>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                      <Link to={`/guides/${guide.slug}`}>{guide.title}</Link>
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {guide.summary}
                    </p>
                  </div>

                  {/* Section Topics Preview */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {guide.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated {guide.dateModified}
                  </span>
                  <Link
                    to={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Global Conversion CTA */}
        <div className="mt-14 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-blue-50 p-8 sm:p-10 text-slate-900 text-center sm:text-left sm:flex items-center justify-between gap-8 shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-blue-700 font-semibold">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span>Personalized AI Preparation</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">
              Want a customized prep roadmap for your target company?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
              Input your target role and timeline. PrepVisor generates an adaptive daily study schedule with AI-evaluated mock interviews and coding drills.
            </p>
          </div>

          <a
            href={decorateUrlWithUtms(
              `${COMPANY_CONFIG.appUrl}/register?utm_source=organic_seo&utm_medium=guides_hub&utm_campaign=bottom_banner`
            )}
            onClick={() => trackEvent("hub_bottom_cta_clicked", {})}
            className="mt-6 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition shrink-0 active:scale-[0.99]"
          >
            <span>Start Free Preparation</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </main>
    </div>
  );
};
