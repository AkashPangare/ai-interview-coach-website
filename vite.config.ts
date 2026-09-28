import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { SEO_ROUTES } from "./src/config/seo.js"
import { generateCoreStructuredData } from "./src/lib/structuredData.js"

function seoShellPlugin() {
  return {
    name: "prepvisor-seo-shell",
    transformIndexHtml(html: string) {
      const metadata = SEO_ROUTES.home
      const replacements: Record<string, string> = {
        __SEO_TITLE__: metadata.title,
        __SEO_DESCRIPTION__: metadata.description,
        __SEO_CANONICAL_URL__: metadata.canonicalUrl,
        __SEO_OG_TYPE__: metadata.ogType,
        __SEO_OG_TITLE__: metadata.ogTitle,
        __SEO_OG_DESCRIPTION__: metadata.ogDescription,
        __SEO_TWITTER_TITLE__: metadata.twitterTitle,
        __SEO_TWITTER_DESCRIPTION__: metadata.twitterDescription,
        __SEO_SOCIAL_IMAGE_URL__: metadata.socialImageUrl,
        __SEO_SOCIAL_IMAGE_WIDTH__: String(metadata.socialImageWidth),
        __SEO_SOCIAL_IMAGE_HEIGHT__: String(metadata.socialImageHeight),
        __SEO_SOCIAL_IMAGE_ALT__: metadata.socialImageAlt,
      }
      for (const [placeholder, value] of Object.entries(replacements)) {
        html = html.replaceAll(placeholder, value.replaceAll("&", "&amp;").replaceAll('"', "&quot;"))
      }
      return html.replace(
        "__SEO_STRUCTURED_DATA__",
        `<script type="application/ld+json">${JSON.stringify(generateCoreStructuredData())}</script>`,
      )
    },
  }
}

export default defineConfig({
  plugins: [tailwindcss(), react(), seoShellPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
