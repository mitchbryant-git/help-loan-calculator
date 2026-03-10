import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'HECS Repayment Thresholds 2025-26 | New Marginal System Explained',
  description: 'Understand the new 2025-26 HECS-HELP marginal repayment system. See the updated thresholds, rates, and worked examples showing exactly what you\'ll repay.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/hecs-repayment-thresholds-2025-26',
  },
  openGraph: {
    title: 'HECS Repayment Thresholds 2025-26 | New Marginal System Explained',
    description: 'Understand the new 2025-26 HECS-HELP marginal repayment system. See the updated thresholds, rates, and worked examples showing exactly what you\'ll repay.',
    url: 'https://www.helploancalculator.com/hecs-repayment-thresholds-2025-26',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

export default function GuideRepaymentThresholds() {
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
            HECS-HELP Repayment Thresholds 2025-26: How the New System Works
          </h1>

          {/* Section: How HECS Repayments Work Now */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">How HECS Repayments Work Now</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              If you've heard horror stories about someone getting a small pay rise and suddenly owing thousands more in HECS repayments, that was the old system. It's gone.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              From 1 July 2025, Australia switched to a <strong className="text-white">marginal repayment system</strong>. It works like tax brackets. You only pay the higher rate on the income <em>within</em> each bracket, not your entire income. No more "repayment cliffs" where a $1 pay rise costs you hundreds.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              The minimum repayment threshold also jumped from $54,435 to <strong className="text-white">$67,000</strong>. If you earn under that, you don't repay anything.
            </p>
          </section>

          {/* Section: The 2025-26 Repayment Rates */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The 2025-26 Repayment Rates</h3>
            <p className="text-[#CFCFCF] leading-relaxed">Here's the full breakdown:</p>

            <div className="rounded-xl overflow-hidden border glass-dark border-white/5">
              <div className="grid grid-cols-2 text-[10px] font-bold uppercase p-3 border-b border-[#333] bg-white/5">
                <div className="text-left">Repayment Income</div>
                <div className="text-right">Rate / Calculation</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] sm:text-sm p-3 border-b border-[#333]">
                <div className="text-left font-mono text-[#CFCFCF]">$0 – $67,000</div>
                <div className="text-right text-[#CFCFCF]">Nil</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] sm:text-sm p-3 border-b border-[#333]">
                <div className="text-left font-mono text-[#CFCFCF]">$67,001 – $125,000</div>
                <div className="text-right text-[#CFCFCF]">15c per $1 over $67,000</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] sm:text-sm p-3 border-b border-[#333]">
                <div className="text-left font-mono text-[#CFCFCF]">$125,001 – $179,285</div>
                <div className="text-right text-[#CFCFCF]">$8,700 + 17c per $1 over $125,000</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] sm:text-sm p-3">
                <div className="text-left font-mono text-[#CFCFCF]">$179,286+</div>
                <div className="text-right text-[#CFCFCF]">10% of total income</div>
              </div>
            </div>

            <p className="text-[#CFCFCF] leading-relaxed">
              Your "repayment income" isn't just your salary. The ATO adds up your taxable income, reportable fringe benefits, total net investment losses, and reportable super contributions. Keep that in mind.
            </p>
          </section>

          {/* Section: What This Actually Looks Like */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What This Actually Looks Like</h3>
            <p className="text-[#CFCFCF] leading-relaxed">Let's make it real with some examples.</p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Earning $70,000:</strong> You're $3,000 over the $67,000 threshold. You pay 15c per dollar on that $3,000 = <strong className="text-white">$450 per year</strong>. That's about $37 per month.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Earning $85,000:</strong> You're $18,000 over the threshold. 15c x $18,000 = <strong className="text-white">$2,700 per year</strong>. About $225 per month.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Earning $100,000:</strong> $33,000 over the threshold. 15c x $33,000 = <strong className="text-white">$4,950 per year</strong>. About $413 per month.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Earning $150,000:</strong> First bracket: 15c x $58,000 = $8,700. Second bracket: 17c x $25,000 = $4,250. Total = <strong className="text-white">$12,950 per year</strong>.
            </p>
          </section>

          {/* Section: The Part Nobody Talks About */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">The Part Nobody Talks About</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              A $67,000 threshold sounds like great news. And in the short term, it is — more money stays in your pocket while you're getting started in your career.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              But here's the catch: <strong className="text-white">while you're earning under $67,000, you're not repaying a cent, and your debt is still being indexed every single year.</strong>
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Let's say you graduate with a $40,000 HECS debt and spend three years earning $55,000-$65,000 while you build your career. At 3% indexation per year, your debt grows to roughly <strong className="text-white">$43,700</strong> before you've made a single repayment. That's almost $4,000 added to your balance just from indexation during those years below the threshold.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Now scale that up. A $50,000 debt? After three years of indexation at 3%, you're looking at closer to <strong className="text-white">$54,700</strong>. Your degree just got nearly $5,000 more expensive, and you haven't missed a payment — the system simply wasn't asking you to make one.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              The higher threshold protects you from financial strain early in your career, which is genuinely helpful. But it also means your debt has more time to grow before you start chipping away at it. Being aware of this doesn't mean you need to panic. It means you can plan for it.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Want to see exactly how long it'll take to pay off your HECS debt based on your expected income?</strong>{' '}
              <a href="https://www.helploancalculator.com" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Use the HELP Loan Calculator →
              </a>{' '}
              — model different starting salaries and see how the threshold affects your total repayment.
            </p>
          </section>

          {/* Section: Where This Info Comes From */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Where This Info Comes From</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              All repayment rates in this guide are sourced from the{' '}
              <a href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Australian Taxation Office
              </a>{' '}
              for the 2025-26 income year. Indexation rates are published by the{' '}
              <a href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
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
          <div>&copy; 2025 Mitch Bryant &middot; mitchbryant.com</div>
        </div>
      </main>
    </div>
  );
}
