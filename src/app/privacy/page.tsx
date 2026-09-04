export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 text-slate-800">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mb-8">Last updated: September 2026</p>

      <section className="space-y-6 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
          <p>
            QuickTools does not require user registration. Files uploaded to our utilities (such as images and PDFs) are processed securely and are never permanently stored, shared, or monitored.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Cookies and Web Beacons</h2>
          <p>
            We use standard cookies to ensure website functionality, analyze basic traffic metrics, and deliver relevant advertisements.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. Google AdSense and Third-Party Advertising</h2>
          <p className="mb-2">
            Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
          </p>
          <p className="mb-2">
            Google&apos;s use of advertising cookies enables it and its partners to serve ads to our users based on their visits to our site and/or other sites across the web.
          </p>
          <p>
            Users may opt out of personalized advertising by visiting{' '}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Google Ads Settings
            </a>{' '}
            or by visiting{' '}
            <a
              href="https://www.aboutads.info"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              aboutads.info
            </a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. Contact</h2>
          <p>
            For privacy-related questions, contact us at support@quicktoolsweb.com.
          </p>
        </div>
      </section>
    </main>
  )
}