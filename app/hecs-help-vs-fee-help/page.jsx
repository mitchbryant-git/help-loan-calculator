/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import GuideSiteHeader from '../../components/help/GuideSiteHeader';
import { GuidePageFooter, GuidePageIntro, GuideRelatedGuides } from '../../components/help/GuidePageChrome';

export const metadata = {
  title: 'HECS-HELP vs FEE-HELP | What\'s the Difference?',
  description: 'Understand the difference between HECS-HELP and FEE-HELP in Australia. Which loan you get, why it matters, and how it changes what you\'ll owe.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/hecs-help-vs-fee-help',
  },
  openGraph: {
    title: 'HECS-HELP vs FEE-HELP | What\'s the Difference?',
    description: 'Understand the difference between HECS-HELP and FEE-HELP in Australia. Which loan you get, why it matters, and how it changes what you\'ll owe.',
    url: 'https://www.helploancalculator.com/hecs-help-vs-fee-help',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

export default function GuideHecsVsFeeHelp() {
  return (
    <div className="guide-article-page min-h-screen pb-20">
      <div className="guide-article-background" aria-hidden="true" />

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
            <p className="text-[#CFCFCF] leading-relaxed">
              A typical 3-year degree on HECS-HELP costs between <strong className="text-white">$16,000 and $55,000</strong> depending on what you study. No hidden fees. You borrow $30,000, you owe $30,000 (before indexation).
            </p>
          </section>

          {/* Section: FEE-HELP */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">FEE-HELP</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This is for students who <strong className="text-white">don't</strong> have a Commonwealth Supported Place. That usually means you're at a private university (like Bond or Torrens) or doing a postgraduate degree at a public uni that doesn't offer CSPs for that course.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              There's no government subsidy, so you're paying the full cost of tuition. FEE-HELP debts are almost always <strong className="text-white">significantly larger</strong> than HECS-HELP debts for a similar degree.
            </p>
          </section>

          {/* Section: Same Degree, Very Different Debt */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Same Degree, Very Different Debt</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Here's where it hits home. A law degree at a public university like the University of Queensland in a CSP would cost roughly <strong className="text-white">$40,000 to $50,000</strong> in student contributions through HECS-HELP.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              A law degree at Bond University costs approximately <strong className="text-white">$142,720</strong> through FEE-HELP.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Same career outcome. The debt is 3x larger.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Bond runs on an accelerated system so you finish faster, which is a genuine advantage. But the raw cost difference is massive, and it's worth understanding before you commit.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              There's also a <strong className="text-white">lifetime borrowing limit</strong> on all HELP loans. In some cases, the degree costs more than you're even allowed to borrow.{' '}
              <Link href="/help-borrowing-limit" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Learn more about the HELP borrowing limit →
              </Link>
            </p>
          </section>

          {/* Section: Quick Comparison Table */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The Quick Comparison</h3>
            <div className="overflow-x-auto rounded-xl border border-white/10">
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
                    { label: 'Government subsidy', hecs: 'Yes', fee: 'No' },
                    { label: 'Typical debt (3-year degree)', hecs: '$16,000 to $55,000', fee: '$60,000 to $150,000+' },
                    { label: 'Repayment rules', hecs: 'Same', fee: 'Same' },
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
            <p className="text-[#CFCFCF] leading-relaxed">
              Once the debt exists, the ATO treats them identically. Same thresholds, same marginal rates, same indexation. The only difference is how much you start with.
            </p>
          </section>

          {/* Section: The Bottom Line */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The Bottom Line</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              If you're weighing up a private uni vs a public uni, make sure you understand the cost difference. Going private isn't wrong, but it's a decision worth tens of thousands of dollars. Make sure the specific program offers something genuinely worth the premium, not just a nicer campus.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Compare the numbers yourself:</strong>{' '}
              <a href="https://www.helploancalculator.com" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Use the HELP Loan Calculator →
              </a>{' '}
              Try $45,000 (public uni, HECS-HELP) vs $130,000 (private uni, FEE-HELP) and see how the repayment timeline changes.
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
        </article>

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
