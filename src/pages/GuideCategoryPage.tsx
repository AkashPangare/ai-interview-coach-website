import React from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowRight, ChevronRight } from "lucide-react"
import { GUIDE_INDEX } from "@/data/guideIndex"
import { GUIDE_CATEGORY_BY_ID, type GuideCategoryId } from "@/config/guideCategories"
import { SEO_ROUTES } from "@/config/seo"
import { usePageSeo } from "@/hooks/usePageSeo"

const seoKeyByCategory = {
  "system-design": "guideSystemDesign",
  "java-backend": "guideJavaBackend",
  dsa: "guideDsa",
} as const

export const GuideCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = categoryId ? GUIDE_CATEGORY_BY_ID[categoryId as GuideCategoryId] : undefined
  const seoKey = categoryId && categoryId in seoKeyByCategory
    ? seoKeyByCategory[categoryId as keyof typeof seoKeyByCategory]
    : undefined
  usePageSeo(seoKey ? SEO_ROUTES[seoKey] : SEO_ROUTES.guides)

  if (!category || !category.hubSeo) {
    return <main className="mx-auto max-w-3xl px-4 py-20"><h1 className="text-3xl font-semibold">Topic not found</h1><Link to="/guides">Browse all guides</Link></main>
  }

  const guides = GUIDE_INDEX.filter((guide) => guide.primaryCategory === category.id)
  return (
    <main className="min-h-screen bg-[#fafbfc] px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link><ChevronRight className="h-4 w-4" />
          <Link to="/guides" className="hover:text-blue-600">Guides</Link><ChevronRight className="h-4 w-4" />
          <span aria-current="page" className="text-slate-800">{category.name}</span>
        </nav>
        <header className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{category.name} Interview Guides</h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">{category.intro}</p>
        </header>
        <section aria-label={`${category.name} guides`} className="grid gap-5 md:grid-cols-2">
          {guides.map((guide) => (
            <article key={guide.slug} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h2 className="text-xl font-semibold"><Link className="hover:text-blue-600" to={`/guides/${guide.slug}`}>{guide.title}</Link></h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{guide.summary}</p>
              <Link className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600" to={`/guides/${guide.slug}`}>Read this guide <ArrowRight className="h-4 w-4" /></Link>
            </article>
          ))}
        </section>
        <div className="mt-10 flex flex-wrap gap-5 border-t border-slate-200 pt-6 text-sm">
          <Link className="font-semibold text-blue-600 hover:text-blue-700" to={category.productPath}>{category.productLinkLabel} <ArrowRight className="inline h-4 w-4" /></Link>
          <Link className="text-slate-600 hover:text-slate-900" to="/guides">Browse all interview guides</Link>
        </div>
      </div>
    </main>
  )
}
