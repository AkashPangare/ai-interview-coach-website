import React from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Home,
  Layers,
  Code2,
  Mic,
  BookOpen,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { usePageSeo } from "@/hooks/usePageSeo"
import { COMPANY_CONFIG } from "@/config/company"

export const NotFoundPage: React.FC = () => {
  usePageSeo({
    title: "404 - Page Not Found | PrepVisor",
    description: "The page you are looking for does not exist on PrepVisor. Explore our System Design simulator, DSA coding studio, or voice mock interviews.",
  })

  const quickLinks = [
    {
      to: "/",
      title: "Homepage",
      desc: "Overview of PrepVisor workbench & dynamic pacing",
      icon: Home,
      color: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      to: "/system-design",
      title: "System Design Simulator",
      desc: "Infinite cloud whiteboard with real-time scale math",
      icon: Layers,
      color: "text-sky-600 bg-sky-50 border-sky-200",
    },
    {
      to: "/coding-practice",
      title: "DSA Coding Arena",
      desc: "Cloud IDE with live terminal stdout in Java, Python, C++",
      icon: Code2,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
    {
      to: "/mock-interview",
      title: "AI Voice Mock Interview",
      desc: "Conversational STAR framework scoring with audio analysis",
      icon: Mic,
      color: "text-purple-600 bg-purple-50 border-purple-200",
    },
    {
      to: "/guides",
      title: "Interview Study Guides",
      desc: "In-depth blueprints on TinyURL, Rate Limiter, and JVM internals",
      icon: BookOpen,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    },
    {
      to: "/pricing",
      title: "Preparation Passes",
      desc: "One-time prepaid passes with zero recurring auto-renewals",
      icon: CreditCard,
      color: "text-amber-600 bg-amber-50 border-amber-200",
    },
  ]

  return (
    <div className="py-20 sm:py-28 bg-[#fafbfc] min-h-screen text-slate-900 bg-dot-grid relative flex flex-col justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] glow-blue pointer-events-none opacity-30" />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10 relative z-10 text-center">
        {/* Error Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3.5 py-1 text-xs font-mono font-semibold text-red-700 shadow-xs">
          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
          <span>404 · Page Not Found</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Lost your way?
          </h1>
          <p className="text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            The page you requested doesn't exist, was renamed, or has moved. Here are the core areas of the platform to get you back on track:
          </p>
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {quickLinks.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-3.5 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className={`p-2.5 rounded-lg border shrink-0 ${item.color} transition-transform group-hover:scale-105`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-xs transition active:scale-[0.99] w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Homepage</span>
          </Link>
          <a
            href={`mailto:${COMPANY_CONFIG.contact.email}`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3 text-sm font-medium text-slate-700 shadow-xs transition w-full sm:w-auto"
          >
            <span>Report Broken Link</span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
