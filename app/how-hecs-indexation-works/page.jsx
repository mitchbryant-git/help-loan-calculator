import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { INDEXATION_HISTORY, REPAYMENT_THRESHOLD, ATO_INDEXATION_URL } from '../../lib/hecsRates';

const RECENT_HISTORY = [...INDEXATION_HISTORY].reverse().map((row) => [
  String(row.year),
  row.appliedRate !== row.finalRate ? `${row.finalRate}% (reduced from ${row.appliedRate}%)` : `${row.finalRate}%`,
]);
const OLDER_HISTORY = [
  ['2020', '1.8%'],
  ['2019', '1.8%'],
  ['2018', '1.9%'],
  ['2017', '1.5%'],
  ['2016', '1.5%'],
  ['2015', '2.1%'],
  ['2014', '2.6%'],
  ['2013', '2.0%'],
];
const FULL_HISTORY = [...RECENT_HISTORY, ...OLDER_HISTORY];

export const metadata = {
  title: 'How HECS Indexation Works | CPI, WPI Cap & Historical Rates',
  description: 'Learn how HECS-HELP indexation works in Australia. See historical rates, the CPI/WPI cap reform, and why "your debt won\'t outgrow your wages" isn\'t the full story.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/how-hecs-indexation-works',
  },
  openGraph: {
    title: 'How HECS Indexation Works | CPI, WPI Cap & Historical Rates',
    description: 'Learn how HECS-HELP indexation works in Australia. See historical rates, the CPI/WPI cap reform, and why "your debt won\'t outgrow your wages" isn\'t the full story.',
    url: 'https://www.helploancalculator.com/how-hecs-indexation-works',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

export default function GuideIndexation() {
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
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat text-white leading-tight">
            How HECS Indexation Works: What It Is, Why It Matters, and What's Changed
          </h1>

          {/* Dated callout */}
          <div className="rounded-xl border border-[#62FFDA]/20 bg-[#62FFDA]/5 p-4 text-sm text-[#CFCFCF] leading-relaxed">
            <strong className="text-white">1 June 2026 update:</strong> this year's rate was 2.8%.{' '}
            <Link href="/hecs-indexation-2026" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
              Full breakdown →
            </Link>
          </div>

          {/* Section: HECS Doesn't Charge Interest */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">HECS Doesn't Charge Interest. But Your Debt Still Grows.</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This is the part that catches people off guard. HECS-HELP loans are technically "interest-free," but they're not cost-free. Every year on 1 June, your remaining debt is <strong className="text-white">indexed</strong>, which means it gets adjusted upward to keep pace with the cost of living.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Think of it this way: if you owe $30,000 and the indexation rate is 2.8% (the confirmed 1 June 2026 rate), your debt grows by $840 that year, even if you haven't spent a cent more on uni. If you're not earning enough to make compulsory repayments yet, your balance just keeps climbing.
            </p>
          </section>

          {/* Section: Why This Hits Harder */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Why This Hits Harder Than You Think</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Here's where it gets real. The repayment threshold is currently ${REPAYMENT_THRESHOLD.toLocaleString('en-AU')}. That's often framed as a positive: "you don't pay anything until you earn about $70k!" And in the short term, it's true. Less pressure on your pay while you're getting established.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              But every year you earn below that threshold, <strong className="text-white">your debt grows and nothing is being paid off</strong>. Indexation doesn't wait for you to start earning.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">Let's look at what that actually means:</p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">A $40,000 debt with no repayments for 3 years (at 3% indexation):</strong>
            </p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-1 pl-2">
              <li>After Year 1: $41,200</li>
              <li>After Year 2: $42,436</li>
              <li>After Year 3: $43,709</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              That's <strong className="text-white">$3,709 added</strong> to your balance before you've repaid a single dollar.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">A $50,000 debt with no repayments for 3 years (at 3% indexation):</strong>
            </p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-1 pl-2">
              <li>After Year 1: $51,500</li>
              <li>After Year 2: $53,045</li>
              <li>After Year 3: $54,636</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              That's <strong className="text-white">$4,636 added</strong>. Your degree just became almost $5,000 more expensive while you were simply getting your career off the ground.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              And if indexation runs at 4% (which it did in 2024)? A $50,000 debt grows to <strong className="text-white">$56,243</strong> over three years. That's more than $6,000 in growth, with zero missed payments.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              This isn't a flaw in the system. It's just how it works. But most people don't understand this when they sign up, and that's the problem.
            </p>
          </section>

          {/* Section: How the Rate Is Calculated */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">How the Rate Is Calculated</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Indexation used to be based purely on the <strong className="text-white">Consumer Price Index (CPI)</strong>, which measures how much everyday prices have gone up. When inflation spiked in 2022-23, HECS indexation spiked with it, and a lot of people saw their debt jump by thousands of dollars overnight.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              That caused a massive backlash, and in late 2024, the government passed new legislation. Now, the indexation rate is the <strong className="text-white">lower of CPI or the Wage Price Index (WPI)</strong>. The logic is simple: your debt should never grow faster than wages.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              This change was <strong className="text-white">backdated to 1 June 2023</strong>, which meant the 7.1% rate from that year was retroactively reduced to 3.2%. The 2024 rate dropped from 4.7% to 4.0%.
            </p>
          </section>

          {/* Section: "Your Debt Won't Outgrow Your Wages" */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">"Your Debt Won't Outgrow Your Wages": Not Quite</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              You'll hear this line a lot now that the WPI cap is in place. And on paper, it sounds reassuring. But it deserves a closer look.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              The Wage Price Index is calculated by the{' '}
              <a href="https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/wage-price-index-australia/latest-release" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Australian Bureau of Statistics
              </a>. The ABS surveys around 3,000 businesses across Australia and tracks price changes for approximately 20,000 individual jobs each quarter. The WPI measures the average change in the price of labour across the entire economy, covering both private and public sectors, across all industries and all states.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Here's what that means for you: <strong className="text-white">the WPI is a national average. It doesn't reflect your pay.</strong>
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              If the WPI rises 3.4% in a given year, that doesn't mean you got a 3.4% pay rise. You might have received nothing. You might have changed jobs and taken a pay cut. You might be in an industry where wages are flat. You might be working part-time, freelancing, or just starting out in a role where pay rises aren't on the table yet.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              But your HECS debt? It's <strong className="text-white">guaranteed</strong> to be indexed by that rate on 1 June. No exceptions.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              So while the cap is a genuine improvement over the old system (where debt could grow at 7.1% in a single year), the idea that "your debt can't outgrow your wages" only holds true if your personal wage growth keeps pace with the national average. For plenty of people, especially in the early years of their career, it won't.
            </p>
          </section>

          {/* Section: Historical Indexation Rates */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Historical Indexation Rates</h3>
            <p className="text-[#CFCFCF] leading-relaxed">Here's what indexation has looked like over the past decade:</p>

            <div className="rounded-xl overflow-hidden border glass-dark border-white/5">
              <div className="grid grid-cols-2 text-[10px] font-bold uppercase p-3 border-b border-[#333] bg-white/5">
                <div className="text-left">Year</div>
                <div className="text-right">Rate</div>
              </div>
              {FULL_HISTORY.map(([year, rate], i, arr) => (
                <div key={year} className={`grid grid-cols-2 text-[11px] sm:text-sm p-3 ${i < arr.length - 1 ? 'border-b border-[#333]' : ''}`}>
                  <div className="text-left font-mono text-[#CFCFCF]">{year}</div>
                  <div className="text-right text-[#CFCFCF]">{rate}</div>
                </div>
              ))}
            </div>

            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              Source:{' '}
              <a href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Australian Taxation Office
              </a>
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Rates stayed between 1-2% for years, then spiked hard in 2022-23 when inflation took off. The CPI/WPI cap now prevents those extreme spikes from happening again, but even at a "normal" 3% rate, the compounding effect over several years is significant.
            </p>
          </section>

          {/* Section: What You Can Actually Do About It */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What You Can Actually Do About It</h3>
            <p className="text-[#CFCFCF] leading-relaxed">Understanding indexation isn't about stressing over it. It's about making informed decisions:</p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li><strong className="text-white">Know what your degree will cost</strong>, not just the sticker price, but the real cost after years of indexation before and during repayment.</li>
              <li><strong className="text-white">Understand that time below the threshold has a price</strong>: the longer your debt sits without repayments, the more it grows.</li>
              <li><strong className="text-white">Don't take the "won't outgrow wages" line at face value</strong>: it's based on a national average, not your personal situation.</li>
              <li><strong className="text-white">Model your own scenario</strong>: your income path, your debt size, and your repayment timeline are unique to you.</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">See how indexation affects your specific debt over time:</strong>{' '}
              <a href="https://www.helploancalculator.com" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Use the HELP Loan Calculator →
              </a>{' '}
              Adjust the indexation rate, change your starting salary, and watch how the numbers shift year by year.
            </p>
          </section>

          {/* Section: Where This Info Comes From */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Where This Info Comes From</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Indexation rates are published by the{' '}
              <a href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Australian Taxation Office
              </a>. Information on the CPI/WPI cap is from the{' '}
              <a href="https://www.education.gov.au/helpestimator" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Department of Education
              </a>{' '}and{' '}
              <a href="https://www.studyassist.gov.au/managing-and-repaying-your-loan/loan-increases-and-indexation" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Study Assist
              </a>. WPI methodology and data are published by the{' '}
              <a href="https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/wage-price-index-australia/latest-release" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Australian Bureau of Statistics
              </a>.
            </p>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              This guide is for educational purposes only and is not financial advice. Always verify figures with the ATO.
            </p>
          </section>
        </article>

        {/* More Guides */}
        <div className="mt-16 space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#CFCFCF]/60 opacity-70 text-center">More Guides</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/hecs-indexation-2026', title: 'HECS Indexation 2026' },
              { href: '/hecs-repayment-thresholds-2026-27', title: 'HECS Repayment Thresholds 2026-27' },
              { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
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
