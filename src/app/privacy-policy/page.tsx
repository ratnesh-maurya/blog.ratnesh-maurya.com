import { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbStructuredData } from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'Privacy Policy — Ratn Labs',
  description: 'Privacy policy for Ratn Labs (blog.ratnesh-maurya.com). How we collect, use, and protect your information.',
  alternates: { canonical: 'https://blog.ratnesh-maurya.com/privacy-policy' },
  robots: { index: true, follow: true },
};

const sections = [
  {
    title: 'What we collect',
    body: [
      'Page view counts and upvote counts are stored anonymously in MongoDB Atlas. No personally identifiable information (PII) is linked to these metrics — we record only the post slug and a count.',
      'If you use the newsletter signup form, your email address is processed by Buttondown, our third-party email provider. We do not store your email on our own servers. See Buttondown\'s privacy policy at buttondown.email/privacy.',
      'We use basic analytics (view counts) built into the blog itself. We do not use Google Analytics, Meta Pixel, or any third-party advertising trackers.',
    ],
  },
  {
    title: 'Cookies and local storage',
    body: [
      'We store a theme preference ("light" or "dark") in your browser\'s localStorage so your chosen appearance persists across visits. This is not transmitted to our servers.',
      'We store whether you have upvoted a specific post (using the post slug as a key) in localStorage to prevent duplicate upvotes. This is not transmitted to our servers and is fully local to your device.',
      'We do not set any tracking or advertising cookies.',
    ],
  },
  {
    title: 'Third-party services',
    body: [
      'Vercel — This site is hosted on Vercel, which may log your IP address and request metadata as part of normal server operation. See vercel.com/legal/privacy-policy.',
      'MongoDB Atlas — Anonymous view and upvote counts are stored on MongoDB Atlas (MongoDB, Inc.). See mongodb.com/legal/privacy-policy.',
      'GitHub — The source code of this blog is hosted publicly on GitHub. No user data is stored there.',
      'Buttondown — If you subscribe to the newsletter, your email is stored with Buttondown. You can unsubscribe at any time using the link in any email we send.',
    ],
  },
  {
    title: 'Data retention',
    body: [
      'Anonymous view and upvote counts are retained indefinitely as they are aggregated metrics with no personal data attached.',
      'Newsletter subscriptions are retained until you unsubscribe. You can request deletion of your email from Buttondown at any time.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'Since we collect no personally identifiable information on our own servers (only anonymous counters), there is no personal data for us to export, correct, or delete on your behalf.',
      'If you subscribed to the newsletter, you can unsubscribe using the link in any email, or contact us at the email address below and we will remove you.',
      'If you are in the EU/EEA, UK, or California, you may have additional rights under GDPR, UK GDPR, or CCPA. Given that we collect no PII, these rights are largely satisfied by design.',
    ],
  },
  {
    title: 'External links',
    body: [
      'This blog contains links to external websites. We are not responsible for the privacy practices or content of those sites. We recommend reading their privacy policies before submitting any personal information.',
    ],
  },
  {
    title: 'Changes to this policy',
    body: [
      'We may update this privacy policy from time to time. Changes will be posted on this page with an updated "last revised" date. Continued use of the site after changes constitutes acceptance.',
    ],
  },
  {
    title: 'Contact',
    body: [
      'If you have questions about this privacy policy, reach out via LinkedIn (linkedin.com/in/ratnesh-maurya) or Twitter/X (@ratnesh_maurya_).',
    ],
  },
];

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [
    { name: 'Home', url: 'https://blog.ratnesh-maurya.com' },
    { name: 'Privacy Policy', url: 'https://blog.ratnesh-maurya.com/privacy-policy' },
  ];

  return (
    <>
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
            <p className="text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-muted)' }}>
              Legal
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3"
              style={{ color: 'var(--text-primary)' }}>
              Privacy Policy
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Applies to blog.ratnesh-maurya.com · Last revised: February 2026
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* TL;DR */}
          <div className="rounded-xl p-5 mb-10"
            style={{ backgroundColor: 'var(--accent-50)', border: '1px solid var(--accent-200)' }}>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--accent-600)' }}>
              TL;DR
            </p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              We collect anonymous page view and upvote counts. We don&apos;t use ad trackers, don&apos;t sell data, and don&apos;t store any personal information on our servers. If you subscribe to the newsletter, your email is handled by Buttondown.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {sections.map((section, i) => (
              <section key={section.title}>
                <h2 className="text-base font-bold mb-4 flex items-center gap-2"
                  style={{ color: 'var(--text-primary)' }}>
                  <span className="text-xs font-mono w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'var(--accent-50)', color: 'var(--accent-500)' }}>
                    {i + 1}
                  </span>
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.body.map((para, j) => (
                    <p key={j} className="text-sm leading-relaxed"
                      style={{ color: 'var(--text-secondary)' }}>
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Bottom nav */}
          <div className="mt-12 pt-8 flex flex-wrap gap-4"
            style={{ borderTop: '1px solid var(--border)' }}>
            <Link href="/"
              className="text-sm font-medium" style={{ color: 'var(--accent-500)' }}>
              ← Back to blog
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
