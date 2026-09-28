import { GUIDE_CATEGORY_BY_ID, type GuideCategoryId } from "../config/guideCategories.ts"

export function resolveGuideCategoryId(pathname: string, routeCategoryId?: string): GuideCategoryId | undefined {
  const normalizedPathname = pathname.replace(/\/+$/, "")
  const pathCategoryId = normalizedPathname.match(/^\/guides\/([^/]+)$/)?.[1]
  const candidates = [routeCategoryId?.replace(/\/+$/, ""), pathCategoryId]

  return candidates.find((candidate): candidate is GuideCategoryId =>
    Boolean(candidate && Object.prototype.hasOwnProperty.call(GUIDE_CATEGORY_BY_ID, candidate)),
  )
}
