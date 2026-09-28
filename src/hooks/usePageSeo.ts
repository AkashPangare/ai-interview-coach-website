import { useEffect } from "react"
import type { ResolvedSeoMetadata } from "@/config/seo"

function setMeta(selector: string, attributes: Record<string, string>, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement("meta")
    Object.entries(attributes).forEach(([name, value]) => tag?.setAttribute(name, value))
    document.head.appendChild(tag)
  }
  tag.setAttribute("content", content)
}

export function applyPageSeo(metadata: ResolvedSeoMetadata) {
    document.title = metadata.title
    setMeta('meta[name="description"]', { name: "description" }, metadata.description)
    setMeta('meta[property="og:title"]', { property: "og:title" }, metadata.ogTitle)
    setMeta('meta[property="og:description"]', { property: "og:description" }, metadata.ogDescription)
    setMeta('meta[property="og:type"]', { property: "og:type" }, metadata.ogType)
    setMeta('meta[property="og:url"]', { property: "og:url" }, metadata.canonicalUrl)
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, metadata.twitterTitle)
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, metadata.twitterDescription)
    setMeta('meta[name="twitter:url"]', { name: "twitter:url" }, metadata.canonicalUrl)

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement("link")
      canonical.rel = "canonical"
      document.head.appendChild(canonical)
    }
    canonical.href = metadata.canonicalUrl

    if (metadata.keywords) setMeta('meta[name="keywords"]', { name: "keywords" }, metadata.keywords)
    const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (!metadata.indexable) {
      setMeta('meta[name="robots"]', { name: "robots" }, "noindex,follow")
    } else {
      robots?.remove()
    }
}

export function usePageSeo(metadata: ResolvedSeoMetadata) {
  useEffect(() => applyPageSeo(metadata), [metadata])
}
