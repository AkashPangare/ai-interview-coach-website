import { useEffect } from "react"

export interface PageSeoOptions {
  title: string
  description?: string
  canonicalUrl?: string
  keywords?: string
  ogType?: "website" | "article"
  ogImage?: string
}

export function usePageSeo({
  title,
  description,
  canonicalUrl,
  keywords,
  ogType = "website",
  ogImage = "https://prepvisor.in/og-image.png",
}: PageSeoOptions) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title

    // 2. Meta Description
    if (description) {
      let descTag = document.querySelector('meta[name="description"]')
      if (!descTag) {
        descTag = document.createElement("meta")
        descTag.setAttribute("name", "description")
        document.head.appendChild(descTag)
      }
      descTag.setAttribute("content", description)

      let ogDescTag = document.querySelector('meta[property="og:description"]')
      if (ogDescTag) {
        ogDescTag.setAttribute("content", description)
      }
      let twDescTag = document.querySelector('meta[name="twitter:description"]')
      if (twDescTag) {
        twDescTag.setAttribute("content", description)
      }
    }

    // 3. Open Graph & Twitter Titles
    if (title) {
      let ogTitleTag = document.querySelector('meta[property="og:title"]')
      if (ogTitleTag) {
        ogTitleTag.setAttribute("content", title)
      }
      let twTitleTag = document.querySelector('meta[name="twitter:title"]')
      if (twTitleTag) {
        twTitleTag.setAttribute("content", title)
      }
    }

    // 4. Canonical & Open Graph URLs
    if (canonicalUrl) {
      let canonicalTag = document.querySelector('link[rel="canonical"]')
      if (!canonicalTag) {
        canonicalTag = document.createElement("link")
        canonicalTag.setAttribute("rel", "canonical")
        document.head.appendChild(canonicalTag)
      }
      canonicalTag.setAttribute("href", canonicalUrl)

      let ogUrlTag = document.querySelector('meta[property="og:url"]')
      if (ogUrlTag) {
        ogUrlTag.setAttribute("content", canonicalUrl)
      }
      let twUrlTag = document.querySelector('meta[name="twitter:url"]')
      if (twUrlTag) {
        twUrlTag.setAttribute("content", canonicalUrl)
      }
    }

    // 5. Open Graph Type
    let ogTypeTag = document.querySelector('meta[property="og:type"]')
    if (ogTypeTag) {
      ogTypeTag.setAttribute("content", ogType)
    }

    // 6. Open Graph Image
    if (ogImage) {
      let ogImageTag = document.querySelector('meta[property="og:image"]')
      if (ogImageTag) {
        ogImageTag.setAttribute("content", ogImage)
      }
      let twImageTag = document.querySelector('meta[name="twitter:image"]')
      if (twImageTag) {
        twImageTag.setAttribute("content", ogImage)
      }
    }

    // 7. Keywords
    if (keywords) {
      let keywordsTag = document.querySelector('meta[name="keywords"]')
      if (!keywordsTag) {
        keywordsTag = document.createElement("meta")
        keywordsTag.setAttribute("name", "keywords")
        document.head.appendChild(keywordsTag)
      }
      keywordsTag.setAttribute("content", keywords)
    }
  }, [title, description, canonicalUrl, keywords, ogType, ogImage])
}
