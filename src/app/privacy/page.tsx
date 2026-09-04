import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'QuickTools privacy policy — zero server uploads, 100% client-side data security.',
}

export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-zinc-300">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-yellow-400 transition-colors mb-6"
      >
        &larr; Back to all tools
      </Link>

      <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-xs text-zinc-500 mb-8">Effective Date: September 2026</p>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-white mb-2">1. Local Client-Side Architecture</h2>
          <p>
            QuickTools operates entirely within your local web browser. Files processed using our utilities
            (including images, SVGs, and PDF documents) are never uploaded to any remote server or third-party cloud.
            All processing is executed on your local machine using standard HTML5 and WebAssembly APIs.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-2">2. Data Collection and Retention</h2>
          <p>
            We do not collect, store, share, or monetize your personal files, file metadata, or generated outputs.
            Once you refresh or close your browser tab, all session memory and temporary file references are instantly cleared.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-2">3. Third-Party Advertising & Cookies</h2>
          <p>
            We display advertisements to maintain free access to our tools. Third-party vendors and ad networks use
            cookies and web beacons to serve ads based on prior visits to this and other websites across the Internet.
            You can opt out of personalized advertising by visiting your browser settings or ad network opt-out portals.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-white mb-2">4. Operator Contact</h2>
          <p>
            This site is developed and maintained by Michail Feneridis. If you have questions regarding privacy
            practices, contact us at <span className="text-yellow-400 font-mono">mikefener@gmail.com</span>.
          </p>
        </section>
      </div>
    </main>
  )
}