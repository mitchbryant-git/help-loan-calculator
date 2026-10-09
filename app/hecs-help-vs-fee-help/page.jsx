/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import GuideSchema from '../../components/help/GuideSchema';
import GuideSiteHeader from '../../components/help/GuideSiteHeader';
import { GuidePageFooter, GuidePageIntro, GuideRelatedGuides } from '../../components/help/GuidePageChrome';

export const metadata = {
  twitter: { card: 'summary_large_image', title: "HECS-HELP vs FEE-HELP | What's the Difference?", description: "Know which loan applies to your study, what it covers and whether extra loan fees could apply.", images: ['https://allthatsnext.com/hecs-debt-calculator/brand/help/mb01-hecs-debt-loaded-hero-v1.jpg'] },
  title: "HECS-HELP vs FEE-HELP | What's the Difference?",
  description: "Know which loan applies to your study, what it covers and whether extra loan fees could apply.",
  alternates: {
    canonical: 'https://allthatsnext.com/hecs-debt-calculator/hecs-help-vs-fee-help',
  },
  openGraph: {
    title: "HECS-HELP vs FEE-HELP | What's the Difference?",
    description: "Know which loan applies to your study, what it covers and whether extra loan fees could apply.",
    url: 'https://allthatsnext.com/hecs-debt-calculator/hecs-help-vs-fee-help',
    siteName: 'All That’s Next',
    locale: 'en_AU',
    type: 'article',
    images: [{ url: 'https://allthatsnext.com/hecs-debt-calculator/brand/help/mb01-hecs-debt-loaded-hero-v1.jpg', alt: 'HECS Debt Calculator Life Console' }],
  },
};

export default function GuideHecsVsFeeHelp() {
  return (
    <div className="guide-article-page min-h-screen pb-20">
      <div className="guide-article-background" aria-hidden="true" />

      <GuideSchema metadata={metadata} />
      <GuideSiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-8 relative z-10 app-fade-in">
        <GuidePageIntro
          code="06"
          accent="mint"
          title="HECS-HELP vs FEE-HELP: What's the Difference?"
          summary="Understand which loan applies to which kind of university place, why course prices can differ dramatically, and what both loans have in common once repayment begins."
        />

        {/* Article */}
        <article className="space-y-8">
          {/* Section: More Than One Type */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">There's More Than One Type of Student Loan</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              When people say "HECS," they usually mean any student loan from the government. But there are actually two main loan types, and which one you get makes a big difference to how much debt you end up with.
            </p>
          </section>

          {/* Section: HECS-HELP */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">HECS-HELP</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This is what most students get. It's for <strong className="text-white">Commonwealth Supported Places (CSPs)</strong> at public universities, where the government subsidises a large chunk of your tuition. You only pay the leftover portion, called the "student contribution."
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">Check the student contribution for your actual course before you enrol.</p>
          </section>

          {/* Section: FEE-HELP */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">FEE-HELP</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This is for students who <strong className="text-white">don't</strong> have a Commonwealth Supported Place. That usually means you're at a private university (like Bond or Torrens) or doing a postgraduate degree at a public uni that doesn't offer CSPs for that course.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">With FEE-HELP, you pay the full tuition cost. Check the fees for your actual course.</p>
          </section>

          {/* Section: Same Degree, Very Different Debt */}
          <section className="space-y-4"><h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Same Degree, Very Different Debt</h3><p className="text-[#CFCFCF] leading-relaxed">You need enough available HELP balance to cover your study. Check it before you commit, especially if the course costs more than you can borrow.</p><Link href="/help-borrowing-limit" className="underline underline-offset-2">Check the HELP borrowing limit</Link></section>

          {/* Section: Quick Comparison Table */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The Quick Comparison</h3>
            <div className="overflow-x-auto rounded-xl border border-white/10" tabIndex={0} role="region" aria-label="HECS-HELP and FEE-HELP comparison table">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03]">
                    <th className="text-left px-4 py-3 font-bold font-montserrat text-[#CFCFCF]/60 text-xs uppercase tracking-wider"></th>
                    <th className="text-left px-4 py-3 font-bold font-montserrat text-[#62FFDA] text-xs uppercase tracking-wider">HECS-HELP</th>
                    <th className="text-left px-4 py-3 font-bold font-montserrat text-[#8B5CF6] text-xs uppercase tracking-wider">FEE-HELP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { label: 'Who it\'s for', hecs: 'Students in Commonwealth Supported Places', fee: 'Full fee-paying students (no CSP)' },
                    { label: 'Where', hecs: 'Most undergrad degrees at public unis', fee: 'Private unis, most postgrad degrees' },
                    { label: 'Government subsidy', hecs: 'Yes', fee: 'No' },                    { label: 'Repayment rules', hecs: 'Same', fee: 'Same' },
                    { label: 'Indexation', hecs: 'Same', fee: 'Same' },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="px-4 py-3 font-bold text-white text-sm">{row.label}</td>
                      <td className="px-4 py-3 text-[#CFCFCF] text-sm">{row.hecs}</td>
                      <td className="px-4 py-3 text-[#CFCFCF] text-sm">{row.fee}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: Both Get Repaid the Same Way */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Both Get Repaid the Same Way</h3>
            <p className="text-[#CFCFCF] leading-relaxed">HECS-HELP helps cover your student contribution in a Commonwealth supported place. FEE-HELP helps cover eligible full-fee study. Some undergraduate FEE-HELP study has a loan fee, with exemptions.</p>
          </section>

          {/* Section: The Bottom Line */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The Bottom Line</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              If you're weighing up a private uni vs a public uni, make sure you understand the cost difference. Going private isn't wrong, but it's a decision worth tens of thousands of dollars. Make sure the specific program offers something genuinely worth the premium, not just a nicer campus.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Compare the numbers yourself:</strong>{' '}
              <a href="https://allthatsnext.com/hecs-debt-calculator" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Use the HECS Debt Calculator →
              </a>{' '}
              Use the actual balance you expect to borrow and explore how the repayment timeline changes.
            </p>
          </section>

          {/* Section: Sources */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Where This Info Comes From</h3>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li>
                <a href="https://www.studyassist.gov.au/financial-and-study-support/hecs-help" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  Study Assist: HECS-HELP
                </a>
              </li>
              <li>
                <a href="https://www.studyassist.gov.au/financial-and-study-support/fee-help" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  Study Assist: FEE-HELP
                </a>
              </li>
              <li>
                <a href="https://bond.edu.au/program/bachelor-of-laws/fees" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  Bond University: Bachelor of Laws Fees
                </a>
              </li>
            </ul>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              This guide is for educational purposes only. It is not financial or career advice. Always check current fees with your chosen university.
            </p>
          </section>
        <p className="text-[#CFCFCF] leading-relaxed">Both become part of your HELP debt and use the same repayment system. Check your course fees and loan eligibility before you enrol.</p></article>

        <GuideRelatedGuides guides={[
          { href: '/help-borrowing-limit', title: 'The HELP Borrowing Limit 2026' },
          { href: '/hecs-repayment-thresholds-2026-27', title: 'HECS Repayment Thresholds 2026–27' },
          { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
        ]} />
        <GuidePageFooter />
      </main>
    </div>
  );
}
