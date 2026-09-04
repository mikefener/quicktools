import AdBanner from './AdBanner'

type ToolSlug =
  | 'image-converter'
  | 'image-resizer'
  | 'svg-to-png'
  | 'pdf-merger'
  | 'pdf-splitter'
  | 'qr-code-generator'
  | 'dpi-calculator'

interface ToolData {
  title: string
  description: string
  steps: string[]
  features: { title: string; desc: string }[]
  faqs: { q: string; a: string }[]
}

const toolContent: Record<ToolSlug, ToolData> = {
  'image-converter': {
    title: 'Client-Side Image Converter',
    description:
      'Convert your photos and graphics between WebP, PNG, JPG, and AVIF formats entirely inside your web browser. Files are processed locally via the HTML5 Canvas API and are never uploaded to external servers.',
    steps: [
      'Select or drag and drop your image files into the upload box.',
      'Choose your preferred target output format from the dropdown menu.',
      'Click the convert button to instantly generate and download your new image files.',
    ],
    features: [
      { title: 'Zero Cloud Uploads', desc: 'Processing happens entirely in your browser memory for total privacy.' },
      { title: 'Multiple Formats', desc: 'Easily switch between WebP, JPEG, and PNG formats without quality loss.' },
      { title: 'Fast & Free', desc: 'No queue times, registration requirements, or file count limitations.' },
    ],
    faqs: [
      {
        q: 'Are my images uploaded to your servers?',
        a: 'No. QuickTools processes all images locally inside your device browser. Your photos never leave your computer or phone.',
      },
      {
        q: 'Which image format should I choose?',
        a: 'WebP offers the best compression for websites, PNG is ideal for transparent graphics, and JPG works best for standard photography.',
      },
    ],
  },
  'image-resizer': {
    title: 'Precise In-Browser Image Resizer',
    description:
      'Resize images by exact pixel dimensions or percentages without sacrificing clarity. Ideal for preparing images for social media, blogs, web development, and email attachments.',
    steps: [
      'Upload the image you want to resize.',
      'Enter target width and height in pixels, or scale by percentage.',
      'Toggle aspect-ratio locking to avoid distortion, then download the resized output.',
    ],
    features: [
      { title: 'Aspect Ratio Lock', desc: 'Maintain natural proportions automatically while adjusting dimensions.' },
      { title: 'High Fidelity', desc: 'Bicubic sampling ensures edges remain crisp and details clear.' },
      { title: 'Private Processing', desc: 'All resizing executes client-side without remote data transmission.' },
    ],
    faqs: [
      {
        q: 'Will resizing reduce the visual quality of my photo?',
        a: 'Downscaling generally preserves sharpness. Upscaling beyond the original resolution may introduce slight blurriness depending on the source.',
      },
      {
        q: 'Is there a file size limit for resizing?',
        a: 'Because operations run on your local hardware, you can resize high-resolution images as long as your browser memory allows.',
      },
    ],
  },
  'svg-to-png': {
    title: 'Vector SVG to High-Resolution PNG Converter',
    description:
      'Render scalable vector graphics (SVG) into rasterized PNG images with transparent backgrounds at any custom scale or resolution.',
    steps: [
      'Drop your .svg file into the conversion area.',
      'Select a scale multiplier (1x, 2x, 4x) or specify custom dimensions.',
      'Export and save your transparent, high-density PNG file.',
    ],
    features: [
      { title: 'Preserves Alpha Transparency', desc: 'Transparent SVG backgrounds stay completely clear in the output PNG.' },
      { title: 'High-DPI Export', desc: 'Render 2x and 4x retina assets suitable for presentations and UI design.' },
      { title: 'Local Rendering', desc: 'Vectors are drawn to an off-screen canvas directly inside your browser engine.' },
    ],
    faqs: [
      {
        q: 'Why convert SVG to PNG?',
        a: 'Many image viewers, social networks, and legacy programs do not support vector SVG files natively; PNG ensures universal compatibility.',
      },
      {
        q: 'Can I export SVGs at ultra-high resolutions?',
        a: 'Yes. Because SVGs are mathematically calculated vectors, you can scale them up significantly before exporting without pixelation.',
      },
    ],
  },
  'pdf-merger': {
    title: 'Private Document & PDF Merger',
    description:
      'Combine multiple PDF files into a single organized document. Reorder pages and files seamlessly while keeping confidential agreements and statements strictly on your device.',
    steps: [
      'Select multiple PDF files from your device.',
      'Drag and arrange files into your preferred page order.',
      'Click Merge PDF to compile and save your unified document.',
    ],
    features: [
      { title: 'Confidential & Safe', desc: 'Legal and financial records remain private because no files leave your computer.' },
      { title: 'Drag & Drop Reordering', desc: 'Easily rearrange files before compilation to ensure correct sequencing.' },
      { title: 'No Page Watermarks', desc: 'Generates clean, professional PDF files without branding or restrictions.' },
    ],
    faqs: [
      {
        q: 'Is it safe to merge sensitive business documents here?',
        a: 'Yes. QuickTools does not transmit your PDFs to any backend server; all parsing and assembling occurs strictly in your browser tab.',
      },
      {
        q: 'Can I merge password-protected PDFs?',
        a: 'Encrypted files must be unlocked prior to merging so the browser memory can parse the underlying pages.',
      },
    ],
  },
  'pdf-splitter': {
    title: 'Client-Side PDF Page Splitter',
    description:
      'Extract individual pages, cut out unwanted sections, or break large PDF reports into smaller standalone files quickly and securely.',
    steps: [
      'Upload the PDF document you want to split.',
      'Specify page ranges (e.g., 1-3, 5) or click individual page thumbnails.',
      'Download your newly separated PDF file immediately.',
    ],
    features: [
      { title: 'Custom Range Selection', desc: 'Extract contiguous page ranges or separate individual sheets effortlessly.' },
      { title: 'Zero Data Leakage', desc: 'Medical, personal, and banking records stay strictly local on your device.' },
      { title: 'Instant Compilation', desc: 'Fast client-side extraction without waiting on remote server processing queues.' },
    ],
    faqs: [
      {
        q: 'Can I delete pages from a PDF using this tool?',
        a: 'Yes. You can extract only the specific pages you need to keep, effectively filtering out any unwanted pages.',
      },
      {
        q: 'Does splitting a PDF lower the text quality?',
        a: 'No. Vector text, embedded fonts, and source imagery remain completely unchanged during the extraction process.',
      },
    ],
  },
  'qr-code-generator': {
    title: 'Custom In-Browser QR Code Generator',
    description:
      'Generate scannable QR codes for website URLs, contact info, Wi-Fi networks, and plain text without expirations or redirect trackers.',
    steps: [
      'Enter your destination link, text, or data into the input field.',
      'Customize color schemes, background styling, or error correction levels.',
      'Save your finished QR code in high-resolution PNG format for print or web.',
    ],
    features: [
      { title: 'Permanent Codes', desc: 'Direct static QR codes with zero redirect intermediaries or expiration dates.' },
      { title: 'High Error Correction', desc: 'Configurable error correction keeps codes readable even if partially damaged.' },
      { title: 'Commercial Friendly', desc: 'Export vector-sharp codes ready for merchandise, packaging, and business cards.' },
    ],
    faqs: [
      {
        q: 'Do these QR codes ever expire?',
        a: 'No. The generated codes are direct static QR codes. They do not route through a third-party server and will work permanently.',
      },
      {
        q: 'Can I use these QR codes for commercial projects?',
        a: 'Yes. All generated codes are free for both personal and commercial use without licensing fees or watermarks.',
      },
    ],
  },
  'dpi-calculator': {
    title: 'Client-Side DPI, PPI & Print Size Calculator',
    description:
      'Calculate physical print dimensions (inches & cm) from digital pixel resolutions, or find the exact pixel dimensions required for standard poster and photo prints at 300 DPI, 150 DPI, and 72 DPI. Fully calculated in your browser without uploading files.',
    steps: [
      'Switch between "Pixels to Print" or "Print Size to Pixels" mode.',
      'Input your image dimensions and select your target DPI (300 DPI is standard for crisp printing).',
      'Optionally drop an image file to auto-detect its exact pixel resolution locally.',
    ],
    features: [
      { title: 'Print Dimension Matrix', desc: 'Instant conversions across inches, centimeters, and standard international paper sizes.' },
      { title: 'Local Image Detection', desc: 'Drop an image to read pixel width and height without uploading it anywhere.' },
      { title: 'Quality Grading', desc: 'Real-time assessment indicating whether your resolution produces high-quality or pixelated prints.' },
    ],
    faqs: [
      {
        q: 'What is DPI and why does 300 DPI matter for printing?',
        a: 'DPI stands for Dots Per Inch. 300 DPI is the industry gold standard for print production, ensuring sharp, non-pixelated results when viewed up close.',
      },
      {
        q: 'How do I calculate print size from pixels?',
        a: 'Divide your image pixel dimensions by the target DPI. For instance, a 3000 x 2400 pixel image printed at 300 DPI yields a 10 x 8 inch print.',
      },
      {
        q: 'Are my uploaded images sent to any server?',
        a: 'Never. The file header and dimensions are parsed strictly in your browser memory using HTML5 image element APIs.',
      },
    ],
  },
}

export default function ToolGuide({ slug }: { slug: ToolSlug }) {
  const content = toolContent[slug]
  if (!content) return null

  return (
    <section className="max-w-4xl mx-auto px-4 py-12 text-zinc-300">
      {/* Top Content Ad Placement */}
      <AdBanner className="mb-10" />

      {/* Overview & Instructions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">{content.title}</h2>
        <p className="text-zinc-400 leading-relaxed">{content.description}</p>

        {/* Step-by-step Guide */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">How to Use This Tool</h3>
          <ol className="space-y-3 list-decimal list-inside text-zinc-300">
            {content.steps.map((step, idx) => (
              <li key={idx} className="leading-relaxed">
                <span className="text-zinc-200">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {content.features.map((feat, idx) => (
            <div key={idx} className="bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-4">
              <h4 className="font-medium text-white text-sm mb-1">{feat.title}</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Mid-Content Ad Placement */}
        <AdBanner className="my-8" />

        {/* FAQs */}
        <div className="pt-4">
          <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-zinc-800/80 pb-4">
                <h4 className="font-semibold text-white text-sm mb-1">{faq.q}</h4>
                <p className="text-sm text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}