/* eslint-disable react/no-unescaped-entities */
import { REPAYMENT_BANDS, ATO_RATES_URL, STUDY_ASSIST_REPAYMENTS_URL, ATO_INDEXATION_URL } from '../../lib/hecsRates';
import GuideSiteHeader from '../../components/help/GuideSiteHeader';
import { GuidePageFooter, GuidePageIntro, GuideRelatedGuides } from '../../components/help/GuidePageChrome';

export const metadata = {
  title: 'HECS Repayment Thresholds 2026-27 | $69,528 Threshold Explained',
  description: 'The HECS-HELP repayment threshold is $69,528 for the 2026-27 financial year. See the full rates table, worked examples, and what it means for your repayments.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/hecs-repayment-thresholds-2026-27',
  },
  openGraph: {
    title: 'HECS Repayment Thresholds 2026-27 | $69,528 Threshold Explained',
    description: 'The HECS-HELP repayment threshold is $69,528 for the 2026-27 financial year. See the full rates table, worked examples, and what it means for your repayments.',
    url: 'https://www.helploancalculator.com/hecs-repayment-thresholds-2026-27',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

const updatedDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

export default function GuideRepaymentThresholds2026() {
  return (
    <div className="guide-article-page min-h-screen pb-20">
      <div className="guide-article-background" aria-hidden="true" />

      <GuideSiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-8 relative z-10 app-fade-in">
        <GuidePageIntro
          code="01"
          accent="sky"
          title="HECS-HELP Repayment Thresholds 2026–27: What You Pay This Year"
          summary="Understand the $69,528 starting threshold, the new marginal repayment formula, and how much compulsory repayment different incomes produce."
          updated={updatedDate}
        />

        {/* Article */}
        <article className="space-y-8">
          {/* Section: The Short Version */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The Short Version</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              For the 2026-27 financial year, the minimum repayment threshold is <strong className="text-white">$69,528</strong>. If your repayment income is at or below $69,528, you make no compulsory repayment. Above it, the marginal system introduced in 2025-26 keeps doing its thing: you only pay on the income above the threshold, never on your whole salary.
            </p>
          </section>

          {/* Section: The 2026-27 Repayment Rates */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The 2026-27 Repayment Rates</h3>

            <div className="rounded-xl overflow-hidden border glass-dark border-white/5">
              <div className="grid grid-cols-2 text-[10px] font-bold uppercase p-3 border-b border-[#333] bg-white/5">
                <div className="text-left">Repayment Income</div>
                <div className="text-right">Rate</div>
              </div>
              {REPAYMENT_BANDS.map((band, i, arr) => (
                <div key={band.id} className={`grid grid-cols-2 text-[11px] sm:text-sm p-3 ${i < arr.length - 1 ? 'border-b border-[#333]' : ''}`}>
                  <div className="text-left font-mono text-[#CFCFCF]">{band.rangeLabel}</div>
                  <div className="text-right text-[#CFCFCF]">{band.calcLabel}</div>
                </div>
              ))}
            </div>

            <p className="text-[#CFCFCF] leading-relaxed">
              Your repayment income isn't just your salary. The ATO adds your taxable income, reportable fringe benefits, total net investment losses, and reportable super contributions. Worth remembering if you salary package.
            </p>
          </section>

          {/* Section: What This Looks Like in Real Money */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What This Looks Like in Real Money</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Earning $72,000:</strong> You're $2,472 over the threshold. 15c per dollar on that = <strong className="text-white">$370.80 for the year</strong>. About $31 a month.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Earning $80,000:</strong> $10,472 over. 15c x $10,472 = <strong className="text-white">$1,570.80 for the year</strong>. About $131 a month.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Earning $100,000:</strong> $30,472 over. 15c x $30,472 = <strong className="text-white">$4,570.80 for the year</strong>. About $381 a month.
            </p>
          </section>

          {/* Section: Why the Threshold Moved */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Why the Threshold Moved</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              The threshold rises most years in line with wage growth, so the line between paying nothing and paying something keeps pace with typical incomes. It moved from $67,000 in 2025-26 to $69,528 this year: on $80,000, that shift alone is worth $379.20 less in compulsory repayments than the same salary would have paid last year, with no pay rise involved.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Feels like a win, and short term it is. But there's a flip side.
            </p>
          </section>

          {/* Section: The Catch */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The Catch</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Smaller compulsory repayments mean your balance hangs around longer. And every year it's still there, it gets indexed. The 1 June 2026 indexation rate was 2.8%, so a $30,000 balance grew by $840 this year alone. Lower repayments now can quietly mean more indexation over the life of the loan.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              That's not a reason to panic. It's a reason to know your timeline. <strong className="text-white">Want to see exactly when you'll be debt free?</strong>{' '}
              <a href="https://www.helploancalculator.com" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Use the HELP Loan Calculator →
              </a>{' '}
              Model a pay rise, a voluntary repayment, or a gap year and watch the payoff date move.
            </p>
          </section>

          {/* Section: Where This Info Comes From */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Where This Info Comes From</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              The 2026-27 threshold and rates are sourced from the{' '}
              <a href={ATO_RATES_URL} target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Australian Taxation Office
              </a>{' '}and{' '}
              <a href={STUDY_ASSIST_REPAYMENTS_URL} target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Study Assist
              </a>. Indexation rates are published by the{' '}
              <a href={ATO_INDEXATION_URL} target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                ATO here
              </a>.
            </p>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              This guide is for educational purposes only and is not financial advice. Always verify figures with the ATO.
            </p>
          </section>
        </article>

        <GuideRelatedGuides guides={[
          { href: '/hecs-indexation-2026', title: 'HECS Indexation 2026' },
          { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
          { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
          { href: '/real-cost-of-starting-uni-before-youre-ready', title: 'The Real Cost of Starting Uni Early' },
        ]} />
        <GuidePageFooter />
      </main>
    </div>
  );
}
