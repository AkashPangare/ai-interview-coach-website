import React from "react"
import { Link } from "react-router-dom"
import { Target, Award, Code, Sparkles, ArrowRight } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

interface AboutPageProps {
  onOpenWaitlist?: () => void
}

export const AboutPage: React.FC<AboutPageProps> = () => {
  return (
    <div className="py-14 sm:py-20 bg-white min-h-screen text-slate-700">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>About PrepVisor</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Why We Built PrepVisor
          </h1>
          <p className="text-sm text-slate-600">
            Making tech interview preparation structured, realistic, and respectful of your busy schedule.
          </p>
        </div>

        {/* Story Card */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8 space-y-5 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900">
            Our Mission
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Most software engineers preparing for interviews face the same dilemma: they have a full-time job and limited free time each day. Traditional platforms present an overwhelming list of hundreds of problems without asking how many weeks you have until your interview or how much time you can realistically spend.
            </p>
            <p>
              We built <strong className="text-slate-900">{COMPANY_CONFIG.brandName}</strong> to solve this. PrepVisor creates a personalized daily preparation agenda tailored to your target date and daily study availability. It combines coding practice, system design concepts, and mock interview practice into one cohesive experience.
            </p>
          </div>

          {/* Founder Box */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-lg shrink-0">
              DA
            </div>
            <div className="space-y-0.5 text-center sm:text-left">
              <h3 className="text-sm font-bold text-slate-900">{COMPANY_CONFIG.proprietorName}</h3>
              <p className="text-xs text-blue-600 font-medium">Founder of PrepVisor</p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">What Guides Us</h2>
            <p className="text-xs text-slate-500">Simple principles behind our platform</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Time-Aware Plans</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Study plans calibrated to your exact target interview date and daily study hours.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Code className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hands-on Practice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive coding and system design exercises with clear, immediate feedback.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                <Award className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Transparent & Affordable</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Simple one-time passes starting at ₹299 ($6 USD) with zero recurring surprises.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Start Your Interview Preparation Today
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Choose a structured preparation pass that fits your upcoming interview timeline.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
