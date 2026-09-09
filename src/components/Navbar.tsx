import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, Terminal, X } from "lucide-react"
import { COMPANY_CONFIG } from "@/config/company"

interface NavbarProps { onOpenWaitlist: () => void }

export const Navbar: React.FC<NavbarProps> = ({ onOpenWaitlist }) => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const links = [{ to: "/", label: "Home" }, { to: "/pricing", label: "Pricing" }, { to: "/about", label: "About" }, { to: "/contact", label: "Contact" }]
  return <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"><Link to="/" className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white"><Terminal className="h-5 w-5" /></span><span className="text-lg font-bold tracking-tight">{COMPANY_CONFIG.brandName}</span></Link><nav className="hidden items-center gap-7 md:flex">{links.map(link => <Link key={link.to} to={link.to} className={`text-sm font-medium transition hover:text-blue-600 ${location.pathname === link.to ? "text-blue-600" : "text-slate-600"}`}>{link.label}</Link>)}<button onClick={onOpenWaitlist} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Join early access</button></nav><button onClick={() => setOpen(!open)} className="p-2 text-slate-600 md:hidden" aria-label="Toggle menu">{open ? <X /> : <Menu />}</button></div>{open && <nav className="space-y-1 border-t border-slate-100 bg-white px-4 py-3 md:hidden">{links.map(link => <Link key={link.to} onClick={() => setOpen(false)} to={link.to} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{link.label}</Link>)}<button onClick={() => { setOpen(false); onOpenWaitlist() }} className="mt-2 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">Join early access</button></nav>}</header>
}
