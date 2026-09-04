export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-200">
      <h1 className="text-3xl font-bold mb-6 text-white">About QuickTools</h1>
      
      <section className="space-y-6 leading-relaxed">
        <p>
          QuickTools is an independent web utility platform created by Michail Feneridis. Our mission is to provide fast, completely private, browser-based utilities for everyday digital tasks.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-white">100% Client-Side Privacy</h2>
          <p>
            Unlike traditional online file converters and editors that upload your sensitive documents to remote servers, QuickTools performs operations locally inside your web browser using modern WebAssembly and JavaScript APIs. Your documents, photos, and files never leave your device.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-white">Our Utilities</h2>
          <p>
            We offer a growing suite of free tools including image converters, image resizers, SVG to PNG converters, PDF mergers, PDF splitters, and QR code generators. All tools are free to use without registration or watermarks.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2 text-white">Contact & Inquiries</h2>
          <p>
            For feedback, bug reports, or feature requests, contact us anytime at support@quicktoolsweb.com.
          </p>
        </div>
      </section>
    </main>
  )
}