import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ArrowRight, LogIn } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"
import { BrandLogo } from "./BrandLogo"

interface NavbarProps {
  onOpenWaitlist?: () => void
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const links = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <BrandLogo to="/" />

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition hover:text-blue-600 ${
                location.pathname === link.to ? "text-blue-600" : "text-slate-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href={`${COMPANY_CONFIG.appUrl}/login`}
            className="inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition"
          >
            <LogIn className="h-4 w-4" />
            <span>Log In</span>
          </a>
          <a
            href={`${COMPANY_CONFIG.appUrl}/register`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-slate-600 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav className="space-y-1.5 border-t border-slate-100 bg-white px-4 py-4 md:hidden shadow-lg">
          {links.map((link) => (
            <Link
              key={link.to}
              onClick={() => setOpen(false)}
              to={link.to}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-slate-100 space-y-2">
            <a
              href={`${COMPANY_CONFIG.appUrl}/login`}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </a>
            <a
              href={`${COMPANY_CONFIG.appUrl}/register`}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}
