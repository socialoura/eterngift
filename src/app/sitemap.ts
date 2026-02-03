import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eterngift.com'
  const locales = ['en', 'fr', 'es', 'de', 'it']
  const lastModified = new Date()

  const staticPages = [
    '',
    '/collections',
    '/products',
    '/products/eternal-rose-bear',
    '/products/eternal-rose-box',
    '/faq',
    '/contact',
  ]

  const routes: MetadataRoute.Sitemap = []

  // Add localized versions of each page
  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified,
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1 : page.includes('products') ? 0.9 : 0.7,
      })
    }
  }

  return routes
}
