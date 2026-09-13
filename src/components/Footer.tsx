import React from "react"
import { Link } from "react-router-dom"
import { Terminal } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

export const Footer: React.FC = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <div>
        <Link to="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white">
            <Terminal className="h-4 w-4" />
          </span>
          {COMPANY_CONFIG.brandName}
        </Link>
        <p className="mt-2 max-w-sm text-xs leading-relaxed text-slate-500">
          Clear, structured preparation for your next tech interview.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
        <Link to="/pricing" className="hover:text-blue-600">Pricing</Link>
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        <Link to="/refund-policy" className="hover:text-blue-600">Refund Policy</Link>
        <Link to="/privacy" className="hover:text-blue-600">Privacy</Link>
        <Link to="/terms" className="hover:text-blue-600">Terms</Link>
        <a href={`${COMPANY_CONFIG.appUrl}/login`} className="hover:text-blue-600 font-semibold">Log In</a>
        <a href={`${COMPANY_CONFIG.appUrl}/register`} className="hover:text-blue-600 font-semibold">Sign Up</a>
      </div>
    </div>
    <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-500 space-y-1">
      <p>© {new Date().getFullYear()} {COMPANY_CONFIG.brandName}. All rights reserved.</p>
      <p className="text-[11px] text-slate-400">
        Operated by {COMPANY_CONFIG.legalEntity} · Bengaluru, Karnataka 560068, India.
      </p>
    </div>
  </footer>
)
