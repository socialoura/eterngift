// Single source of truth for the storefront product ID mapping.
// DB `products` table uses numeric IDs (Prisma schema); the frontend uses slugs.
// Add an entry here when a new product is seeded.

export const PRODUCT_ID_TO_SLUG: Record<number, string> = {
  1: 'eternal-rose-bear',
  2: 'eternal-rose-box',
}

export const PRODUCT_SLUG_TO_ID: Record<string, number> = Object.fromEntries(
  Object.entries(PRODUCT_ID_TO_SLUG).map(([id, slug]) => [slug, Number(id)])
)

export function productIdToSlug(id: number): string {
  return PRODUCT_ID_TO_SLUG[id] ?? `product-${id}`
}

export function productSlugToId(slug: string): number | null {
  return PRODUCT_SLUG_TO_ID[slug] ?? null
}
