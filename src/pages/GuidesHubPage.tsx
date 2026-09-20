import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { GUIDES } from "@/data/guides";
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

export const GuidesHubPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  usePageSeo({
    title: "Technical Interview Study Guides & Architecture Blueprints | PrepVisor",
    description: "Free comprehensive engineering interview guides. Master System Design architectures, Java concurrency internals, and coding patterns with real-world case studies.",
    canonicalUrl: "https://prepvisor.in/guides",
    keywords: "system design interview guide, java concurrency interview questions, technical interview study guides, spring boot microservices interview, lru cache implementation",
  });

  useEffect(() => {
    trackEvent("guides_hub_viewed", {});
  }, []);

  const categories = [
    "All",
    "System Design",
    "Java",
    "Backend Architecture",
    "Data Structures",
  ];

  const filteredGuides = useMemo(() => {
    return GUIDES.filter((guide) => {
      const matchesCategory =
        selectedCategory === "All" || guide.category === selectedCategory;
      const matchesSearch =
        guide.title.toLowerCase().includes(search.toLowerCase()) ||
        guide.summary.toLowerCase().includes(search.toLowerCase()) ||
        guide.keywords.some((k) => k.toLowerCase().includes(search.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white pb-20 bg-dot-grid relative">
      {/* Ambient Radial Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] glow-blue pointer-events-none opacity-40" />

      {/* Header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md py-16 sm:py-24 relative z-10">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1 text-xs font-mono uppercase tracking-wider text-blue-600 shadow-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Curated Engineering Study Library</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900">
            Technical Interview Blueprints
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            In-depth, peer-reviewed engineering guides on complex system design architectures, JVM internals, and coding patterns designed to help you clear senior technical rounds.
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
                  onClick={() => setSelectedCategory(cat)}
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
                      {guide.category === "System Design" ? (
                        <Layers className="h-3 w-3" />
                      ) : guide.category === "Backend Architecture" ? (
                        <Server className="h-3 w-3" />
                      ) : guide.category === "Data Structures" ? (
                        <Binary className="h-3 w-3" />
                      ) : (
                        <Code2 className="h-3 w-3" />
                      )}
                      {guide.category}
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
                    {guide.sections.slice(0, 3).map((sec) => (
                      <span
                        key={sec.id}
                        className="text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5"
                      >
                        {sec.title.split(". ")[1] || sec.title}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Updated {guide.lastUpdated}
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
        <div className="mt-14 rounded-2xl border border-slate-200 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 p-8 sm:p-10 text-slate-900 text-center sm:text-left sm:flex items-center justify-between gap-8 shadow-xs">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-blue-700 font-semibold">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span>Personalized AI Preparation</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900">
              Want a customized prep roadmap for your target company?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
              Input your target role and timeline. PrepVisor generates an adaptive daily study schedule with AI-evaluated mock interviews and coding drills.
            </p>
          </div>

          <a
            href={decorateUrlWithUtms(
              "https://app.prepvisor.in/register?utm_source=organic_seo&utm_medium=guides_hub&utm_campaign=bottom_banner"
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
