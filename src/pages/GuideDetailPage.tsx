import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getGuideBySlug,
  GUIDES,
  generateArticleJsonLd,
  generateFaqJsonLd,
} from "@/data/guides";
import {
  Clock,
  Calendar,
  User,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { decorateUrlWithUtms, trackEvent } from "@/lib/analytics";
import { COMPANY_CONFIG } from "@/config/company";

export const GuideDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const guide = slug ? getGuideBySlug(slug) : undefined;

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // SEO: Update Title, Meta tags, and inject Schema.org JSON-LD
  useEffect(() => {
    if (!guide) return;

    // Document Title
    document.title = `${guide.seoTitle} | PrepVisor`;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", guide.metaDescription);

    // Meta Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute("content", guide.keywords.join(", "));

    // Open Graph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", guide.title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", guide.metaDescription);

    // JSON-LD Scripts (Article & FAQPage)
    const articleScriptId = "schema-article-jsonld";
    let articleScript = document.getElementById(articleScriptId);
    if (!articleScript) {
      articleScript = document.createElement("script");
      articleScript.id = articleScriptId;
      articleScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(articleScript);
    }
    articleScript.textContent = JSON.stringify(generateArticleJsonLd(guide));

    const faqScriptId = "schema-faq-jsonld";
    let faqScript = document.getElementById(faqScriptId);
    if (!faqScript) {
      faqScript = document.createElement("script");
      faqScript.id = faqScriptId;
      faqScript.setAttribute("type", "application/ld+json");
      document.head.appendChild(faqScript);
    }
    faqScript.textContent = JSON.stringify(generateFaqJsonLd(guide));

    // Track Pageview telemetry
    trackEvent("guide_viewed", {
      slug: guide.slug,
      category: guide.category,
      title: guide.title,
    });

    return () => {
      // Clean up injected schema on unmount
      articleScript?.remove();
      faqScript?.remove();
    };
  }, [guide]);

  if (!guide) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-4 border border-amber-200 shadow-xs">
          <BookOpen className="h-8 w-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-[-0.02em]">Guide Not Found</h1>
        <p className="mt-2 text-slate-600 text-sm max-w-md mx-auto">
          The requested technical interview guide could not be located. Browse our curated library of system design and coding case studies.
        </p>
        <button
          onClick={() => navigate("/guides")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 transition"
        >
          <span>Browse All Guides</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const otherGuides = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <article className="min-h-screen bg-[#fafbfc] text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Breadcrumbs & Meta Bar */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link to="/guides" className="hover:text-blue-600 transition">
              Technical Guides
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-800 truncate max-w-[200px] sm:max-w-none font-semibold">
              {guide.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header Container */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
              <Sparkles className="h-3 w-3 text-blue-600" />
              {guide.category}
            </span>
            <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              {guide.difficulty} Level
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              {guide.readingTimeMinutes} min read
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Updated {guide.lastUpdated}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.15]">
            {guide.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
            {guide.summary}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <User className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{guide.author.name}</div>
                <div className="text-[11px] text-slate-500">{guide.author.role}</div>
              </div>
            </div>

            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition cursor-pointer"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              <span>{copiedLink ? "Link Copied!" : "Share Guide"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content & Table of Contents Layout */}
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Article Body */}
          <main className="lg:col-span-8 space-y-12">
            {guide.sections.map((section, idx) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-slate-900">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="text-sm font-medium text-slate-500 mt-1">{section.subtitle}</p>
                  )}
                </div>

                <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line font-normal">
                  {section.content}
                </div>

                {/* Optional Architecture Callout Card */}
                {section.architectureCallout && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 shadow-xs space-y-3 my-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <span>{section.architectureCallout.title}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2.5 text-xs">
                      {section.architectureCallout.points.map((pt, pidx) => (
                        <div
                          key={pidx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 gap-1 shadow-xs"
                        >
                          <span className="font-semibold text-slate-800">{pt.label}</span>
                          <span className="font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">
                            {pt.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Syntax Highlighted Code Snippet */}
                {section.codeBlock && (
                  <div className="rounded-2xl border border-slate-800 bg-[#06070a] overflow-hidden shadow-xl my-4 text-white">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-[#0c0e17] border-b border-slate-800 text-xs text-slate-400">
                      <span className="font-mono uppercase font-bold text-amber-400">
                        {section.codeBlock.language}
                      </span>
                      {section.codeBlock.caption && (
                        <span className="text-[11px] text-slate-400 truncate max-w-[280px]">
                          {section.codeBlock.caption}
                        </span>
                      )}
                      <button
                        onClick={() => handleCopyCode(section.codeBlock!.code, section.id)}
                        className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition cursor-pointer"
                      >
                        {copiedCodeId === section.id ? (
                          <Check className="h-3 w-3 text-emerald-400" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedCodeId === section.id ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                    <pre className="p-4 text-xs font-mono overflow-x-auto text-slate-200 leading-relaxed">
                      <code>{section.codeBlock.code}</code>
                    </pre>
                  </div>
                )}

                {/* Optional Key Takeaways Callout */}
                {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-2">
                    <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5 text-amber-600" />
                      <span>Key Interview Takeaways</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {section.keyTakeaways.map((k, kidx) => (
                        <li key={kidx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Mid-Article Practice Callout after Section 2 */}
                {idx === 1 && (
                  <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50 p-6 shadow-xs my-8 text-center sm:text-left sm:flex items-center justify-between gap-6">
                    <div className="space-y-1 mb-4 sm:mb-0">
                      <span className="inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white mb-1.5">
                        Interactive PrepVisor Studio
                      </span>
                      <h3 className="text-base font-semibold text-slate-900">
                        Don't just read the answer — test yourself now
                      </h3>
                      <p className="text-xs text-slate-600 max-w-md">
                        Draw the architecture or code the solution in our AI studio to receive automated scoring and SPOF feedback.
                      </p>
                    </div>
                    <a
                      href={decorateUrlWithUtms(guide.cta.actionUrl)}
                      onClick={() =>
                        trackEvent("guide_mid_cta_clicked", {
                          slug: guide.slug,
                          cta: "mid_banner",
                        })
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition shrink-0"
                    >
                      <span>Try Interactive Studio</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </section>
            ))}

            {/* High-Conversion Footer CTA Banner */}
            <div className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-8 text-white shadow-xl space-y-5 relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white border border-white/30 backdrop-blur-xs">
                <Sparkles className="h-3.5 w-3.5 text-white" />
                <span>{guide.cta.badge}</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-[-0.02em] text-white">
                  {guide.cta.heading}
                </h2>
                <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
                  {guide.cta.subtext}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={decorateUrlWithUtms(guide.cta.actionUrl)}
                  onClick={() =>
                    trackEvent("guide_footer_cta_clicked", {
                      slug: guide.slug,
                      cta: "footer_card",
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-slate-100 transition active:scale-95"
                >
                  <span>{guide.cta.buttonText}</span>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </a>
                <p className="text-[11px] text-blue-100/80 mt-2.5">
                  Free tier available · Instant setup · No credit card required
                </p>
              </div>
            </div>

            {/* Frequently Asked Questions (FAQ Section matching FAQPage Schema) */}
            <section id="faqs" className="scroll-mt-24 space-y-4 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-[-0.02em]">
                  Frequently Asked Questions
                </h2>
              </div>
              <p className="text-xs text-slate-600">
                Common interviewer traps and high-frequency follow-up questions for this topic.
              </p>

              <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                {guide.faqs.map((faq, fidx) => {
                  const isOpen = expandedFaqIndex === fidx;
                  return (
                    <div
                      key={fidx}
                      className="transition-colors"
                    >
                      <button
                        onClick={() => setExpandedFaqIndex(isOpen ? null : fidx)}
                        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-slate-900 hover:bg-slate-50/80 transition cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-blue-600 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-400 shrink-0 ml-2" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200 pt-3 bg-slate-50/40">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </main>

          {/* Sticky Sidebar: Table of Contents & Related Guides */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents Box */}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  <span>Table of Contents</span>
                </div>
                <nav className="space-y-1.5 text-xs">
                  {guide.sections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block py-1 text-slate-600 hover:text-blue-600 hover:translate-x-1 transition-transform truncate"
                    >
                      {sec.title}
                    </a>
                  ))}
                  <a
                    href="#faqs"
                    className="block py-1 text-blue-600 hover:text-blue-700 hover:translate-x-1 transition-transform font-semibold"
                  >
                    Frequently Asked Questions
                  </a>
                </nav>
              </div>

              {/* Sidebar Mini CTA */}
              <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-center space-y-2.5 shadow-xs">
                <span className="p-1 rounded-md bg-blue-100 text-blue-700 text-[10px] font-bold inline-block">
                  Practice Mode
                </span>
                <div className="text-xs font-bold text-slate-900">
                  Ready to test your interview readiness?
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Get a personalized study roadmap with targeted practice problems.
                </p>
                <a
                  href={decorateUrlWithUtms(
                    `${COMPANY_CONFIG.appUrl}/register?utm_source=organic_seo&utm_medium=guide_sidebar&utm_campaign=${guide.slug}`
                  )}
                  onClick={() =>
                    trackEvent("guide_sidebar_cta_clicked", {
                      slug: guide.slug,
                      cta: "sidebar_card",
                    })
                  }
                  className="inline-flex w-full items-center justify-center gap-1 rounded-xl bg-blue-600 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow-xs"
                >
                  <span>Start Free Prep</span>
                  <ArrowRight className="h-3 w-3" />
                </a>
              </div>

              {/* Related Technical Guides */}
              {otherGuides.length > 0 && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Next Recommended Guides
                  </div>
                  <div className="space-y-2.5">
                    {otherGuides.map((og) => (
                      <Link
                        key={og.slug}
                        to={`/guides/${og.slug}`}
                        className="block group p-3 rounded-xl hover:bg-slate-50 border border-slate-100 transition"
                      >
                        <div className="text-[10px] uppercase font-bold text-blue-600 mb-1">
                          {og.category} · {og.readingTimeMinutes}m read
                        </div>
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                          {og.title}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
};
