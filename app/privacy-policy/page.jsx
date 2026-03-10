import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | HELP Loan Calculator',
  description: 'How helploancalculator.com handles your data. No personal information is collected or stored.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PrivacyPolicy() {
  return (
    <div
      className="min-h-screen font-sans selection:bg-[#0081CB] selection:text-white pb-20 transition-colors duration-500 relative overflow-x-hidden text-white bg-[#0D0D0D]"
      style={{ fontFamily: 'var(--font-lato), sans-serif' }}
    >
      {/* GLOBAL NOISE & GRADIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-[#6A3CFF] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '10s', zIndex: 0 }}></div>
        <div className="absolute bottom-0 right-[10%] w-[600px] h-[600px] bg-[#0081CB] rounded-full mix-blend-screen filter blur-[130px] opacity-20" style={{ zIndex: 0 }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#62FFDA] rounded-full mix-blend-overlay filter blur-[150px] opacity-5" style={{ zIndex: 0 }}></div>
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ zIndex: 0 }}></div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 border-white/5 bg-[#0D0D0D]/70" data-nosnippet>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#0081CB]/30 border border-white/20 overflow-hidden transition-transform hover:scale-105 active:scale-95"
            >
              <img src="/apple-touch-icon.png" alt="MB Logo" className="w-full h-full object-cover" />
            </Link>
            <span className="font-bold text-sm md:text-lg tracking-tight uppercase font-montserrat">
              HELP Loan Calculator
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 relative z-10 app-fade-in">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#0081CB] hover:text-[#62FFDA] transition-colors text-sm font-bold font-montserrat uppercase tracking-wider mb-8">
          <ArrowLeft size={16} />
          Back to Calculator
        </Link>

        {/* Article */}
        <article className="space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat text-white leading-tight">
              Privacy Policy
            </h1>
            <p className="text-[#CFCFCF]/50 text-sm font-lato">helploancalculator.com &middot; Last updated: March 2026</p>
          </div>

          {/* Section: The short version */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The short version</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This site doesn't collect your personal data. There are no accounts, no sign-ups, and no tracking cookies. Your calculator inputs stay on your device.
            </p>
          </section>

          {/* Section: What data we collect */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What data we collect</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">None.</strong> We do not collect, store, or process any personal information. There are no user accounts, no email collection forms, and no contact forms on this site.
            </p>
          </section>

          {/* Section: How the calculator works */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">How the calculator works</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              The HELP Loan Calculator runs entirely in your web browser. All calculations are performed on your device using JavaScript. Your inputs (debt amount, income, wage growth, indexation rate, age, and any life events you model) are never sent to our servers. We cannot see what you enter.
            </p>
          </section>

          {/* Section: Shareable links */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Shareable links</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              When you use the "Share" feature, a link is generated that encodes your calculator inputs as URL parameters (for example, <code className="text-[#CFCFCF] bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">?debt=50000&income=70000</code>). This data is contained entirely within the URL itself. It is not stored on our servers or in any database. Anyone who receives the link can see the values encoded in it. If you share a link, you are choosing to share those values with whomever you send it to.
            </p>
          </section>

          {/* Section: Cookies and analytics */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Cookies and analytics</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This site is hosted on Vercel. We use Google Analytics to collect anonymised usage data such as page views, session duration, referring URLs, and general geographic region. This data helps us understand how the calculator is used and improve the experience. Google Analytics uses cookies to distinguish unique users. You can opt out of Google Analytics by installing the{' '}
              <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-[#00A3FF] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Google Analytics Opt-out Browser Add-on
              </a>. No advertising cookies are used.
            </p>
          </section>

          {/* Section: External links */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">External links</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This site contains links to external websites including the Australian Taxation Office (ato.gov.au), Study Assist (studyassist.gov.au), myGov (my.gov.au), and others. We are not responsible for the privacy practices of these external sites.
            </p>
          </section>

          {/* Section: Third-party services */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Third-party services</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This site uses Google Fonts to load the Montserrat and Lato typefaces. Google may collect basic usage data through this service. You can review Google's privacy policy at{' '}
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#00A3FF] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                policies.google.com/privacy
              </a>.
            </p>
          </section>

          {/* Section: Children's privacy */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Children's privacy</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This site is designed to be used by people of all ages, including those under 18. We do not knowingly collect any personal data from anyone, including children.
            </p>
          </section>

          {/* Section: Changes to this policy */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Changes to this policy</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              We may update this policy from time to time. Any changes will be reflected on this page with an updated "Last updated" date.
            </p>
          </section>

          {/* Section: Contact */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Contact</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              If you have any questions about this policy, you can reach out at{' '}
              <a href="mailto:hello@mitchbryant.com" className="text-[#00A3FF] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                hello@mitchbryant.com
              </a>, or via TikTok and Instagram at{' '}
              <a href="https://www.tiktok.com/@itsmitchbryant" target="_blank" rel="noopener noreferrer" className="text-[#00A3FF] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                @itsmitchbryant
              </a>.
            </p>
          </section>
        </article>

        {/* More Guides */}
        <div className="mt-16 space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#CFCFCF]/60 opacity-70 text-center">More Guides</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/hecs-repayment-thresholds-2025-26', title: 'HECS Repayment Thresholds 2025-26' },
              { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
              { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
            ].map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-[#62FFDA]/30 hover:bg-white/[0.06] transition-all"
              >
                <BookOpen size={16} className="text-[#0081CB] shrink-0 group-hover:text-[#62FFDA] transition-colors" />
                <span className="text-sm font-medium text-[#CFCFCF] group-hover:text-white transition-colors font-lato">{guide.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-white/5 text-[10px] uppercase tracking-widest font-montserrat text-[#CFCFCF]/40 text-center">
          <div>&copy; 2025 Mitch Bryant &middot; mitchbryant.com</div>
        </div>
      </main>
    </div>
  );
}
