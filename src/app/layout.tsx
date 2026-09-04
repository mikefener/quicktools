import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Script from 'next/script'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://quicktoolsweb.com'),
  title: {
    default: 'QuickTools Web — Free & Private Browser Utilities',
    template: '%s | QuickTools Web',
  },
  description:
    'Fast, client-side tools for PDF editing, image conversion, and text processing. Files never leave your device.',
  keywords: [
    'client-side tools',
    'image converter',
    'image resizer',
    'svg to png',
    'pdf merger',
    'pdf splitter',
    'qr code generator',
    'private web tools',
    'free online utilities',
  ],
  authors: [{ name: 'Michail Feneridis' }],
  creator: 'Michail Feneridis',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://quicktoolsweb.com',
    siteName: 'QuickTools Web',
    title: 'QuickTools Web — Free & Private Browser Utilities',
    description:
      'Fast, private client-side utilities. Compress images, split/merge PDFs, and create QR codes without uploading data.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickTools Web — Free & Private Browser Utilities',
    description: '100% client-side web tools. Zero server storage, complete privacy.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'QuickTools Web',
    url: 'https://quicktoolsweb.com',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Michail Feneridis',
    },
    description:
      'Fast, client-side tools for PDF editing, image conversion, and text processing. Files never leave your device.',
  }

  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID

  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google AdSense Script */}
        {adsenseId && (
          <Script
            id="adsbygoogle-init"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          />
        )}
      </head>
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen flex flex-col justify-between`}>
        {/* Navigation Bar */}
        <nav className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-bold text-base tracking-tight hover:opacity-90">
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
              <span>QuickTools</span>
            </Link>

            <div className="flex items-center gap-1 sm:gap-2 text-xs font-medium overflow-x-auto">
              <Link
                href="/tools/image-converter"
                className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                Converter
              </Link>
              <Link
                href="/tools/image-resizer"
                className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                Resizer
              </Link>
              <Link
                href="/tools/svg-to-png"
                className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                SVG to PNG
              </Link>
              <Link
                href="/tools/pdf-merger"
                className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                PDF Merger
              </Link>
              <Link
                href="/tools/pdf-splitter"
                className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                PDF Splitter
              </Link>
              <Link
                href="/tools/qr-code-generator"
                className="px-2.5 py-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors whitespace-nowrap"
              >
                QR Code
              </Link>
            </div>
          </div>
        </nav>

        {/* Dynamic Page Content */}
        <div className="flex-1">{children}</div>

        {/* Global Legal & Copyright Footer */}
        <footer className="border-t border-zinc-800 bg-zinc-950 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-400"></span>
              <span className="font-semibold text-zinc-300">QuickTools</span>
              <span>— 100% Client-Side Privacy. Zero server uploads.</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400 flex-wrap justify-center">
              <Link href="/privacy" className="hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-yellow-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-yellow-400 transition-colors">
                Contact Us
              </Link>
              <span>&copy; {new Date().getFullYear()} Michail Feneridis. All rights reserved.</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}