/* eslint-disable react/no-unescaped-entities */
import { INDEXATION_HISTORY, ATO_INDEXATION_URL, STUDY_ASSIST_REPAYMENTS_URL } from '../../lib/hecsRates';
import GuideSiteHeader from '../../components/help/GuideSiteHeader';
import { GuidePageFooter, GuidePageIntro, GuideRelatedGuides } from '../../components/help/GuidePageChrome';

export const metadata = {
  title: 'HECS Indexation 2026: The 2.8% Rate Explained',
  description: 'HECS-HELP debts were indexed by 2.8% on 1 June 2026, the lowest rate since 2021. See what it added to your balance, why the rate fell, and when the next window is.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/hecs-indexation-2026',
  },
  openGraph: {
    title: 'HECS Indexation 2026: The 2.8% Rate Explained',
    description: 'HECS-HELP debts were indexed by 2.8% on 1 June 2026, the lowest rate since 2021. See what it added to your balance, why the rate fell, and when the next window is.',
    url: 'https://www.helploancalculator.com/hecs-indexation-2026',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

const updatedDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

export default function GuideIndexation2026() {
  return (
    <div className="guide-article-page min-h-screen pb-20">
      <div className="guide-article-background" aria-hidden="true" />

      <GuideSiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-8 relative z-10 app-fade-in">
        <GuidePageIntro
          code="02"
          accent="mint"
          title="HECS Indexation 2026: The 2.8% Rate and What It Added to Your Debt"
          summary="See what the 2.8% indexation rate added to different HELP balances, why the rate fell, and what the timing means for voluntary repayments."
          updated={updatedDate}
        />

        {/* Article */}
        <article className="space-y-8">
          {/* Section: What Just Happened */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What Just Happened</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              On 1 June 2026, the ATO indexed every HELP balance that had been outstanding for more than 11 months by <strong className="text-white">2.8%</strong>. That's the lowest rate since 2021, and it continues the slide from the 7.1% shock of 2023.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              No interest. No invoice. Your balance just quietly grew. Here's what that actually cost.
            </p>
          </section>

          {/* Section: What 2.8% Added to Your Balance */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What 2.8% Added to Your Balance</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              A <strong className="text-white">$20,000</strong> debt grew by <strong className="text-white">$560</strong>. A <strong className="text-white">$30,000</strong> debt grew by <strong className="text-white">$840</strong>. A <strong className="text-white">$50,000</strong> debt grew by <strong className="text-white">$1,400</strong>. Check your exact balance in myGov under the ATO section, the indexation line will be itemised.
            </p>
          </section>

          {/* Section: Why the Rate Came Down */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Why the Rate Came Down</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Since the Universities Accord reforms, indexation is the <strong className="text-white">lower of CPI or WPI</strong> for the year, a rule backdated to 1 June 2023. That cap is doing its job: when prices ran ahead of wages in 2023, debts could no longer grow faster than pay packets.
            </p>
          </section>

          {/* Section: Recent Indexation Rates */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Recent Indexation Rates</h3>

            <div className="rounded-xl overflow-hidden border glass-dark border-white/5">
              <div className="grid grid-cols-3 text-[10px] font-bold uppercase p-3 border-b border-[#333] bg-white/5">
                <div className="text-left">Year</div>
                <div className="text-left">Rate</div>
                <div className="text-right">Note</div>
              </div>
              {INDEXATION_HISTORY.map((row, i, arr) => (
                <div key={row.year} className={`grid grid-cols-3 text-[11px] sm:text-sm p-3 gap-2 ${i < arr.length - 1 ? 'border-b border-[#333]' : ''}`}>
                  <div className="text-left font-mono text-[#CFCFCF]">{row.year}</div>
                  <div className="text-left text-[#CFCFCF]">{row.finalRate}%</div>
                  <div className="text-right text-[#CFCFCF]/70 text-[10px] sm:text-xs">{row.note || '-'}</div>
                </div>
              ))}
            </div>

            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              Source: <a href={ATO_INDEXATION_URL} target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Australian Taxation Office</a>
            </p>
          </section>

          {/* Section: Missed the Window? */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Missed the Window? Here's Next Year's Play</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Voluntary repayments only beat indexation if they <strong className="text-white">clear</strong> before 1 June. The ATO doesn't count a payment until the money lands, and BPAY can take a few business days. The 2027 rate will be announced in late May 2027 once the March quarter CPI and WPI numbers are in. If you're planning a lump sum, aim for the third week of May at the latest.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Want to see what a voluntary repayment actually does to your payoff date?{' '}
              <a href="https://www.helploancalculator.com" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Model it in the calculator →
              </a>
            </p>
          </section>

          {/* Section: One More Thing: The 20% Cut */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">One More Thing: The 20% Cut</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              If your balance looks smaller than you remember, that's the one-off 20% reduction legislated in August 2025, applied automatically to balances as at 1 June 2025. Nothing to claim, but worth confirming in myGov that it landed.
            </p>
          </section>

          {/* Section: Where This Info Comes From */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Where This Info Comes From</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Indexation rates are published by the{' '}
              <a href={ATO_INDEXATION_URL} target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Australian Taxation Office
              </a>. Repayment rules are at{' '}
              <a href={STUDY_ASSIST_REPAYMENTS_URL} target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Study Assist
              </a>.
            </p>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              This guide is for educational purposes only and is not financial advice. Always verify figures with the ATO.
            </p>
          </section>
        </article>

        <GuideRelatedGuides guides={[
          { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
          { href: '/hecs-repayment-thresholds-2026-27', title: 'HECS Repayment Thresholds 2026–27' },
          { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
        ]} />
        <GuidePageFooter />
      </main>
    </div>
  );
}
