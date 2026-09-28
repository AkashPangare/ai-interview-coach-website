import React from "react"
import { Link } from "react-router-dom"
import { GUIDE_INDEX_BY_SLUG } from "@/data/guideIndex"

interface RelatedGuidesProps { slugs: string[]; heading?: string }

export const RelatedGuides: React.FC<RelatedGuidesProps> = ({ slugs, heading = "Related interview guides" }) => {
  const guides = slugs.map((slug) => GUIDE_INDEX_BY_SLUG[slug]).filter(Boolean)
  if (!guides.length) return null
  return <section className="mx-auto my-12 max-w-5xl px-4 sm:px-6 lg:px-8" aria-label={heading}>
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">{guides.map((guide) => <li key={guide.slug}>
        <Link className="font-medium text-blue-700 hover:underline" to={`/guides/${guide.slug}`}>{guide.title}</Link>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{guide.summary}</p>
      </li>)}</ul>
    </div>
  </section>
}
