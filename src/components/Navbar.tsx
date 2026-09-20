import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ArrowRight, LogIn } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { BrandLogo } from "./BrandLogo"
import { decorateUrlWithUtms, trackEvent } from "../lib/analytics"

interface NavbarProps {
  onOpenWaitlist?: () => void
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: "/", label: "Home" },
    { to: "/roadmap", label: "Roadmap" },
    { to: "/system-design", label: "System Design" },
    { to: "/mock-interview", label: "Mock Interview" },
    { to: "/coding-practice", label: "Coding Arena" },
    { to: "/guides", label: "Guides" },
    { to: "/pricing", label: "Pricing" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo to="/" />

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-5 lg:gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-xs font-medium tracking-tight transition-colors ${
                location.pathname === link.to ? "text-blue-600 font-semibold" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/login`)}
            onClick={() => trackEvent("landing_cta_clicked", { cta: "navbar_login", location: "desktop_navbar" })}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span>
          </a>
          <a
            href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)}
            onClick={() => trackEvent("landing_cta_clicked", { cta: "navbar_get_started", location: "desktop_navbar" })}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition shadow-xs"
          >
            <span>Start Free</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-slate-700 hover:text-slate-900 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav className="space-y-1.5 border-t border-slate-200 bg-white px-4 py-4 md:hidden shadow-xl">
          {links.map((link) => (
            <Link
              key={link.to}
              onClick={() => setOpen(false)}
              to={link.to}
              className="block rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-slate-200 space-y-2">
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/login`)}
              onClick={() => {
                setOpen(false)
                trackEvent("landing_cta_clicked", { cta: "navbar_login", location: "mobile_drawer" })
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Sign In</span>
            </a>
            <a
              href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)}
              onClick={() => {
                setOpen(false)
                trackEvent("landing_cta_clicked", { cta: "navbar_get_started", location: "mobile_drawer" })
              }}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs"
            >
              <span>Start Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
