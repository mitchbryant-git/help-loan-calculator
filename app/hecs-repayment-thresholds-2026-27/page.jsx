import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { REPAYMENT_BANDS, ATO_RATES_URL, STUDY_ASSIST_REPAYMENTS_URL, ATO_INDEXATION_URL } from '../../lib/hecsRates';

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
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight font-montserrat text-white leading-tight">
              HECS-HELP Repayment Thresholds 2026-27: What You Pay This Year
            </h1>
            <p className="text-[#CFCFCF]/50 text-xs uppercase tracking-widest font-montserrat mt-3">Updated {updatedDate}</p>
          </div>

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

        {/* More Guides */}
        <div className="mt-16 space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#CFCFCF]/60 opacity-70 text-center">More Guides</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: '/hecs-indexation-2026', title: 'HECS Indexation 2026' },
              { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
              { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
              { href: '/real-cost-of-starting-uni-before-youre-ready', title: 'The Real Cost of Starting Uni Early' },
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
          <div>&copy; 2026 Mitch Bryant &middot; mitchbryant.com</div>
        </div>
      </main>
    </div>
  );
}
