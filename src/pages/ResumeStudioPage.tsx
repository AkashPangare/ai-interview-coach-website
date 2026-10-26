import { Link } from "react-router-dom"
import { ArrowRight, BriefcaseBusiness, ClipboardCheck, FileText, ScanSearch, Sparkles, Target } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { SEO_ROUTES } from "@/config/seo"
import { usePageSeo } from "@/hooks/usePageSeo"
import { decorateUrlWithUtms, trackEvent } from "@/lib/analytics"

const steps = [
  {
    icon: BriefcaseBusiness,
    title: "Build your career profile",
    description: "Upload an existing resume or enter your experience, education, skills and achievements manually. Review the details before using them to create a resume.",
  },
  {
    icon: FileText,
    title: "Create a resume for a role",
    description: "Generate and edit resume versions for a target job. Choose a template and export a PDF when the wording reflects your real experience.",
  },
  {
    icon: Target,
    title: "Compare against a job description",
    description: "See which stated requirements are evidenced in a saved resume version, which are partly supported and which need attention.",
  },
]

const checks = [
  {
    icon: ScanSearch,
    title: "Resume Quality Check",
    description: "Review extractable PDF text, structure, formatting checks and content suggestions. The quality score describes these checks, not your odds of passing an employer's ATS.",
  },
  {
    icon: ClipboardCheck,
    title: "Recruiter content review",
    description: "Get an evidence backed first impression, strengths, unclear claims and suggestions to make your contributions easier to understand.",
  },
]

export function ResumeStudioPage() {
  usePageSeo(SEO_ROUTES.resumeStudio)

  const registerUrl = decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register?source=resume_studio`)

  return (
    <div className="bg-[#fafbfc] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 py-20 sm:py-28">
        <div className="absolute inset-0 bg-dot-grid hero-mask pointer-events-none" />
        <div className="absolute inset-0 glow-blue pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-xs">
              <Sparkles className="h-4 w-4" /> Resume Studio
            </span>
            <h1 className="text-4xl font-semibold tracking-[-0.03em] leading-tight sm:text-5xl lg:text-6xl">
              Build a resume that tells your story clearly
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Keep your career details in one place, create tailored resume versions, and see how each version supports the requirements of a job. When you are ready, bring those gaps into interview preparation.
            </p>
            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <a href={registerUrl} onClick={() => trackEvent("landing_cta_clicked", { cta: "resume_studio_start", location: "resume_studio_hero" })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Open PrepVisor <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                See how it works
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Your resume workflow</span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">From career profile to targeted resume</h2>
            <p className="text-sm leading-relaxed text-slate-600">Start with the details you know, then review every version before sharing it.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-xs">
                <div className="mb-5 flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon className="h-5 w-5" /></span>
                  <span className="text-xs font-mono text-slate-400">0{index + 1}</span>
                </div>
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 py-20">
        <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">Review before you apply</span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Understand what the resume says</h2>
            <p className="text-sm leading-relaxed text-slate-600">The job match and the standalone resume checks answer different questions. Use the findings to improve clarity and add only experience you can verify.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {checks.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <Icon className="mb-4 h-6 w-6 text-blue-600" />
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            ))}
          </div>
          <p className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-sm leading-relaxed text-slate-700">
            Job match scores are estimates of requirement coverage in the selected job description. They are separate from resume quality checks and do not predict a hiring decision.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white py-20">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-center lg:px-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">A connected next step</span>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Turn resume gaps into interview practice</h2>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">You can use Resume Studio on its own or use a matched resume and job description to start a focused interview preparation plan. Interview Prep also works independently when you already know what to practice.</p>
          </div>
          <Link to="/roadmap" className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100">
            Explore Interview Prep <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
