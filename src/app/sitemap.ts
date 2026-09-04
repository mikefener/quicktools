import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://quicktoolsweb.com'

  const routes = [
    '',
    '/tools/image-converter',
    '/tools/image-resizer',
    '/tools/svg-to-png',
    '/tools/pdf-merger',
    '/tools/pdf-splitter',
    '/tools/qr-code-generator',
    '/about',
    '/privacy',
    '/terms',
    '/contact',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/tools') ? 0.8 : 0.3,
  }))
}