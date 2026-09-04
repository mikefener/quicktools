export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <p className="mb-6 leading-relaxed">
        Have questions, feedback, or a feature request for QuickTools? We would love to hear from you.
      </p>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Direct Inquiries</h2>
        <p className="text-slate-600 mb-4">
          Send an email to our support inbox and we will reply as soon as possible:
        </p>
        <a 
          href="mailto:mikefener@gmail.com" 
          className="text-blue-600 font-medium hover:underline"
        >
          mikefener@gmail.com
        </a>
      </div>
    </main>
  )
}