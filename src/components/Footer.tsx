import React from "react"
import { Link } from "react-router-dom"
import { COMPANY_CONFIG } from "@/config/company"
import { BrandLogo } from "./BrandLogo"
import { decorateUrlWithUtms, trackEvent } from "../lib/analytics"

export const Footer: React.FC = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 text-sm sm:flex-row sm:items-start sm:justify-between sm:px-6 lg:px-8">
      <div className="space-y-3 max-w-xs">
        <BrandLogo to="/" />
        <p className="text-xs leading-relaxed text-slate-600">
          The technical interview workbench. Calibrated daily pacing, live DSA terminal stdout, and interactive system design whiteboard.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 text-xs text-slate-600">
        <div>
          <p className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Studios</p>
          <ul className="space-y-2">
            <li><Link to="/system-design" className="hover:text-blue-600 transition-colors">System Design</Link></li>
            <li><Link to="/mock-interview" className="hover:text-blue-600 transition-colors">Voice Mock AI</Link></li>
            <li><Link to="/coding-practice" className="hover:text-blue-600 transition-colors">DSA Coding Arena</Link></li>
            <li><Link to="/roadmap" className="hover:text-blue-600 transition-colors">Daily Pacing</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Resources</p>
          <ul className="space-y-2">
            <li><Link to="/guides" className="hover:text-blue-600 font-medium transition-colors">Guides & Blueprints</Link></li>
            <li><Link to="/pricing" className="hover:text-blue-600 transition-colors">Pricing & Passes</Link></li>
            <li><Link to="/about" className="hover:text-blue-600 transition-colors">About PrepVisor</Link></li>
            <li><Link to="/contact" className="hover:text-blue-600 transition-colors">Contact & Support</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Legal</p>
          <ul className="space-y-2">
            <li><Link to="/refund-policy" className="hover:text-blue-600 transition-colors">Refund Policy</Link></li>
            <li><Link to="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">Account</p>
          <ul className="space-y-2">
            <li>
              <a
                href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/login`)}
                onClick={() => trackEvent("landing_cta_clicked", { cta: "footer_login", location: "footer" })}
                className="hover:text-blue-600 transition-colors"
              >
                Candidate Sign In
              </a>
            </li>
            <li>
              <a
                href={decorateUrlWithUtms(`${COMPANY_CONFIG.appUrl}/register`)}
                onClick={() => trackEvent("landing_cta_clicked", { cta: "footer_register", location: "footer" })}
                className="hover:text-blue-600 font-medium transition-colors"
              >
                Create Free Account
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-500 space-y-1">
      <p>© {new Date().getFullYear()} {COMPANY_CONFIG.brandName}. All rights reserved.</p>
      <p className="text-[11px] text-slate-500">
        Operated by {COMPANY_CONFIG.legalEntity} · Bengaluru, Karnataka 560068, India.
      </p>
    </div>
  </footer>
)
