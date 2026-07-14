import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { INDEXATION_HISTORY, ATO_INDEXATION_URL, STUDY_ASSIST_REPAYMENTS_URL } from '../../lib/hecsRates';

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
              HECS Indexation 2026: The 2.8% Rate and What It Added to Your Debt
            </h1>
            <p className="text-[#CFCFCF]/50 text-xs uppercase tracking-widest font-montserrat mt-3">Updated {updatedDate}</p>
          </div>

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

        {/* More Guides */}
        <div className="mt-16 space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#CFCFCF]/60 opacity-70 text-center">More Guides</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
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
          <div>&copy; 2026 Mitch Bryant &middot; mitchbryant.com</div>
        </div>
      </main>
    </div>
  );
}
