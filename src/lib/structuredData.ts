import { COMPANY_CONFIG } from "../config/company.ts"
import { absoluteSiteUrl } from "../config/seo.ts"
import type { GuideCategoryDefinition } from "../config/guideCategories.ts"
import type { Guide } from "../data/guides.ts"

export type JsonLd = Record<string, unknown>

export const SCHEMA_IDS = {
  organization: absoluteSiteUrl("/#organization"),
  website: absoluteSiteUrl("/#website"),
  softwareApplication: absoluteSiteUrl("/#software"),
} as const

export function generateCoreStructuredData(): JsonLd {
  const paidPlans = COMPANY_CONFIG.pricing.filter((plan) => plan.priceINR > 0)
  const paidPrices = paidPlans.map((plan) => plan.priceINR)
  const organization = {
    "@type": "Organization",
    "@id": SCHEMA_IDS.organization,
    name: COMPANY_CONFIG.brandName,
    url: COMPANY_CONFIG.websiteUrl,
    logo: absoluteSiteUrl("/logo.png"),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY_CONFIG.contact.phone,
      email: COMPANY_CONFIG.contact.email,
      contactType: "Customer Support",
      areaServed: "IN",
      availableLanguage: ["English"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: `${COMPANY_CONFIG.address.line1}, ${COMPANY_CONFIG.address.line2}`,
      addressLocality: COMPANY_CONFIG.address.city,
      addressRegion: COMPANY_CONFIG.address.state,
      postalCode: COMPANY_CONFIG.address.postalCode,
      addressCountry: "IN",
    },
  }
  const website = {
    "@type": "WebSite",
    "@id": SCHEMA_IDS.website,
    url: absoluteSiteUrl("/"),
    name: COMPANY_CONFIG.brandName,
    publisher: { "@id": SCHEMA_IDS.organization },
  }
  const softwareApplication = {
    "@type": "SoftwareApplication",
    "@id": SCHEMA_IDS.softwareApplication,
    name: COMPANY_CONFIG.brandName,
    operatingSystem: "Web, Cloud",
    applicationCategory: "EducationalApplication",
    description: COMPANY_CONFIG.productSchemaDescription,
    url: COMPANY_CONFIG.websiteUrl,
    publisher: { "@id": SCHEMA_IDS.organization },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: paidPrices.length ? Math.min(...paidPrices) : undefined,
      highPrice: paidPrices.length ? Math.max(...paidPrices) : undefined,
      offerCount: paidPlans.length,
    },
  }

  return { "@context": "https://schema.org", "@graph": [organization, website, softwareApplication] }
}

export function generateArticleJsonLd(guide: Guide): JsonLd {
  const canonicalUrl = absoluteSiteUrl(`/guides/${guide.slug}`)
  const schema: JsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${canonicalUrl}#article`,
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      "@type": "Organization",
      name: guide.author.name,
      "@id": SCHEMA_IDS.organization,
    },
    publisher: { "@id": SCHEMA_IDS.organization },
    dateModified: `${guide.dateModified}T08:00:00+05:30`,
    url: canonicalUrl,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    keywords: guide.keywords.join(", "),
  }
  if (guide.datePublished) schema.datePublished = `${guide.datePublished}T08:00:00+05:30`
  return schema
}

export function generateBreadcrumbJsonLd(guide: Guide): JsonLd {
  const currentUrl = absoluteSiteUrl(`/guides/${guide.slug}`)
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteSiteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Guides", item: absoluteSiteUrl("/guides") },
      { "@type": "ListItem", position: 3, name: guide.title, item: currentUrl },
    ],
  }
}

export function generateFaqJsonLd(guide: Guide): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  }
}

export function generateGuideCategoryJsonLd(category: GuideCategoryDefinition): JsonLd[] {
  const canonicalUrl = absoluteSiteUrl(`/guides/${category.id}`)
  return [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${canonicalUrl}#collection`,
      name: `${category.name} Interview Guides`,
      description: category.hubSeo?.description ?? category.description,
      url: canonicalUrl,
      isPartOf: { "@id": SCHEMA_IDS.website },
      publisher: { "@id": SCHEMA_IDS.organization },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteSiteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Guides", item: absoluteSiteUrl("/guides") },
        { "@type": "ListItem", position: 3, name: category.name, item: canonicalUrl },
      ],
    },
  ]
}
