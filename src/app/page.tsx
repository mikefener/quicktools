import Link from 'next/link'

const tools = [
  {
    title: 'Time Zone Planner',
    description: 'Visual 24-hour overlap planner to coordinate remote team meetings across global time zones.',
    href: '/tools/timezone-planner',
    tag: 'Remote',
    badge: 'New',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'DPI & Print Calculator',
    description: 'Calculate physical print sizes, target DPI, and exact pixel dimensions for crisp printing.',
    href: '/tools/dpi-calculator',
    tag: 'Print',
    badge: '300 DPI',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4H7v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
    ),
  },
  {
    title: 'Image Converter',
    description: 'Convert and compress between PNG, JPG, WebP, and AVIF formats client-side.',
    href: '/tools/image-converter',
    tag: 'Image',
    badge: 'Popular',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Image Resizer',
    description: 'Scale pixel dimensions and compress image sizes with aspect-ratio locking.',
    href: '/tools/image-resizer',
    tag: 'Image',
    badge: 'Scale',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
      </svg>
    ),
  },
  {
    title: 'SVG to PNG Exporter',
    description: 'Render vector SVGs into high-resolution transparent PNG images up to 8x.',
    href: '/tools/svg-to-png',
    tag: 'Vector',
    badge: 'Export',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    title: 'PDF Merger',
    description: 'Combine multiple PDF documents into a single file securely in your browser.',
    href: '/tools/pdf-merger',
    tag: 'PDF',
    badge: 'Fast',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
      </svg>
    ),
  },
  {
    title: 'PDF Splitter & Extractor',
    description: 'Extract specific pages or page ranges from any PDF with zero server uploads.',
    href: '/tools/pdf-splitter',
    tag: 'PDF',
    badge: 'Extract',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    ),
  },
  {
    title: 'QR Code Generator',
    description: 'Create customizable vector and raster QR codes instantly for links or plain text.',
    href: '/tools/qr-code-generator',
    tag: 'Utility',
    badge: 'Instant',
    icon: (
      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-zinc-950 text-white flex flex-col justify-between">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-10 pb-8 w-full text-center sm:text-left">
        <div className="inline-block text-[11px] font-mono font-medium text-yellow-400/90 bg-yellow-400/10 border border-yellow-400/20 px-2.5 py-0.5 rounded-full mb-3">
          100% Client-Side Processing
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
          Free Browser Utilities. <br />
          <span className="text-yellow-400">Files Never Leave Your Device.</span>
        </h1>
        <p className="text-zinc-400 mt-3 max-w-xl text-sm leading-relaxed">
          High-performance media conversion, timezone planning, print calculators, and PDF tools running entirely on your local hardware. Instant execution with no file size limits or server queues.
        </p>
      </section>

      {/* Tools Grid */}
      <section className="max-w-5xl mx-auto px-6 pb-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-900 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700/50 group-hover:border-yellow-500/30">
                    {tool.icon}
                  </div>
                  <span className="text-[11px] font-medium text-yellow-400 font-mono">
                    {tool.badge}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="text-xs font-semibold text-yellow-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch tool &rarr;
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}