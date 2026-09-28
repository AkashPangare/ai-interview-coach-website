export type GuideCategoryId = "system-design" | "java-backend" | "dsa" | "behavioral-interviews"

export interface GuideCategoryDefinition {
  id: GuideCategoryId
  name: string
  description: string
  intro: string
  productPath: "/system-design" | "/coding-practice" | "/mock-interview"
  productLinkLabel: string
  hubSeo?: { title: string; description: string }
}

export const GUIDE_CATEGORIES: GuideCategoryDefinition[] = [
  {
    id: "system-design",
    name: "System Design",
    description: "Architecture case studies covering capacity, resilience, and distributed-service trade-offs.",
    intro: "Explore system design interview case studies that work through requirements, capacity reasoning, architecture choices, and failure handling. These guides pair well with hands-on architecture practice.",
    productPath: "/system-design",
    productLinkLabel: "Practice system design on the interactive architecture canvas",
    hubSeo: {
      title: "System Design Interview Guides & Case Studies | PrepVisor",
      description: "Explore system design interview guides for TinyURL, API rate limiting, and notification services, with architecture, capacity, and resilience considerations.",
    },
  },
  {
    id: "java-backend",
    name: "Java & Backend",
    description: "Java concurrency and backend architecture topics for technical interview preparation.",
    intro: "Review Java concurrency concepts and backend architecture patterns through focused interview guides. Use these materials to structure technical study, then continue with coding or architecture practice in PrepVisor.",
    productPath: "/coding-practice",
    productLinkLabel: "Continue with coding practice",
    hubSeo: {
      title: "Java & Backend Interview Guides | PrepVisor",
      description: "Study Java concurrency and Spring Boot and microservices interview topics with PrepVisor's focused Java and backend guides.",
    },
  },
  {
    id: "dsa",
    name: "DSA",
    description: "Data-structure implementation and coding concepts for interview practice.",
    intro: "This section currently covers an LRU cache implementation across Java, Python, and C++. Work through the data-structure design and use the coding practice workspace to continue solving problems.",
    productPath: "/coding-practice",
    productLinkLabel: "Practice coding problems",
    hubSeo: {
      title: "DSA Interview Guides & Coding Topics | PrepVisor",
      description: "Read a step-by-step LRU cache implementation guide in Java, Python, and C++, then continue with DSA coding practice.",
    },
  },
  {
    id: "behavioral-interviews",
    name: "Behavioral Interviews",
    description: "Behavioral interview practice is available in PrepVisor's mock interview tool; dedicated guides are not yet available.",
    intro: "PrepVisor includes behavioral mock interview practice, but the guide library does not yet contain a dedicated behavioral interview article. Explore the mock interview tool for product-supported practice instead.",
    productPath: "/mock-interview",
    productLinkLabel: "Explore behavioral mock interview practice",
  },
]

export const GUIDE_CATEGORY_BY_ID = Object.fromEntries(
  GUIDE_CATEGORIES.map((category) => [category.id, category]),
) as Record<GuideCategoryId, GuideCategoryDefinition>

export const GUIDE_HUB_CATEGORIES = GUIDE_CATEGORIES.filter((category) => category.hubSeo)
