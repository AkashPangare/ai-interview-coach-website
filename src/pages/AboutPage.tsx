import React from "react"
import { Link } from "react-router-dom"
import { Target, Award, Code, Sparkles, ArrowRight, ShieldCheck, MapPin, Mail } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { usePageSeo } from "@/hooks/usePageSeo"
import { trackEvent } from "@/lib/analytics"

interface AboutPageProps {
  onOpenWaitlist?: () => void
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  usePageSeo({
    title: "About PrepVisor — Engineering Interview Preparation Built by Engineers",
    description: "Learn why PrepVisor was created. Built by engineers in Bengaluru to solve fragmented, time-blind tech interview prep with dynamic daily pacing, live terminal execution, and distributed system design.",
    canonicalUrl: "https://prepvisor.in/about",
    keywords: "about prepvisor, interview prep platform, divya rajkumar almelkar, tech interview coach bangalore",
  })

  return (
    <div className="py-16 sm:py-24 bg-[#fafbfc] min-h-screen text-slate-900 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Ambient Hero Backdrop (Seamless Masked Dot Grid + Glow) */}
      <div className="absolute inset-x-0 top-0 h-[480px] bg-dot-grid hero-mask pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[480px] glow-blue pointer-events-none" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>About PrepVisor</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-slate-900 leading-[1.12]">
            Why We Built PrepVisor
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Making tech interview preparation structured, realistic, and respectful of your busy schedule.
          </p>
        </div>

        {/* Story Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-xl font-semibold text-slate-900">
            Our Mission & Origin Story
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Most software engineers preparing for high-stakes interviews face the exact same dilemma: they have demanding full-time jobs and only 1 to 2 hours of focused energy each evening. Traditional platforms present an overwhelming, unorganized catalog of 3,000+ isolated puzzle problems without asking when your interview is or how much time you can realistically spend.
            </p>
            <p>
              Candidates inevitably fall into two traps: either grinding random easy problems with no timeline discipline, or panic-reading static system design blogs that never test your actual ability to estimate scale, detect single points of failure, or articulate trade-offs out loud.
            </p>
            <p>
              We built <strong className="text-slate-900 font-semibold">{COMPANY_CONFIG.brandName}</strong> to solve this permanently. PrepVisor creates a personalized daily preparation curriculum tailored around your target date and available daily hours. It seamlessly bridges hands-on coding (Java with terminal stdout), interactive cloud whiteboard design with capacity math, and voice AI behavioral coaching into one cohesive, time-aware cockpit.
            </p>
          </div>

          {/* Rich Founder Profile Card */}
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 via-slate-50 to-white p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xl shadow-md">
                    DA
                  </div>
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white shadow-xs">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{COMPANY_CONFIG.proprietorName}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                      Founder & Lead Architect
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span>Bengaluru, Karnataka, India</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${COMPANY_CONFIG.contact.email}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 shadow-xs transition"
                >
                  <Mail className="h-3.5 w-3.5 text-blue-600" />
                  <span>Contact Founder</span>
                </a>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
              "We didn't build PrepVisor to add to the puzzle-grinding noise. We built it to respect engineers' time. When you sit down after a 9-hour workday, you should know exactly which 3 tasks to complete tonight to stay on track for your offer."
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Bootstrapped & Independent
              </span>
              <span>•</span>
              <span>Entity: {COMPANY_CONFIG.legalEntity}</span>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-[-0.02em] text-slate-900">What Guides Us</h2>
            <p className="text-xs text-slate-500">Simple principles behind our platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs hover:border-slate-300 hover:shadow-md transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Time-Aware Plans</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Study plans calibrated to your exact target interview date and daily study hours.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs hover:border-slate-300 hover:shadow-md transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600">
                <Code className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Hands-on Practice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive coding and system design exercises with clear, immediate feedback.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs hover:border-slate-300 hover:shadow-md transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 border border-purple-200 text-purple-600">
                <Award className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Transparent & Affordable</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simple one-time passes starting at ₹499 with zero recurring surprises.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 via-indigo-50/40 to-blue-50 p-8 sm:p-10 text-center text-slate-900 space-y-4 shadow-xs">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-slate-900">
            Start Your Interview Preparation Today
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Choose a structured preparation pass that fits your upcoming interview timeline.
          </p>
          <div className="pt-1">
            <Link
              to="/pricing"
              onClick={() =>
                trackEvent("landing_cta_clicked", {
                  cta: "about_get_started",
                  location: "about_bottom",
                })
              }
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all active:scale-[0.99] shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
