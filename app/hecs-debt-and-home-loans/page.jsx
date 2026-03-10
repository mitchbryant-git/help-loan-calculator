import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'HECS Debt & Home Loans | How Student Debt Affects Borrowing Power',
  description: 'Find out how HECS-HELP debt affects your home loan borrowing power in Australia. See the 2025 APRA changes, how banks assess student debt, and what it means for first-home buyers.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/hecs-debt-and-home-loans',
  },
  openGraph: {
    title: 'HECS Debt & Home Loans | How Student Debt Affects Borrowing Power',
    description: 'Find out how HECS-HELP debt affects your home loan borrowing power in Australia. See the 2025 APRA changes, how banks assess student debt, and what it means for first-home buyers.',
    url: 'https://www.helploancalculator.com/hecs-debt-and-home-loans',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

export default function GuideHomeLoans() {
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
            HECS Debt and Home Loans: How Your Student Loan Affects Borrowing Power
          </h1>

          {/* Section: Your HECS Debt Doesn't Just Disappear */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Your HECS Debt Doesn't Just Disappear When You Want a Mortgage</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This might feel like a long way off if you're 17 and thinking about uni. But here's why it matters now: the HECS debt you take on today will affect how much a bank will lend you when you want to buy a home. Not in a hypothetical "one day" way. In a real, dollar-for-dollar way.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Understanding this upfront gives you the power to plan for it, not get blindsided by it.
            </p>
          </section>

          {/* Section: How Banks Currently Treat HECS */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">How Banks Currently Treat HECS</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              When you apply for a home loan, banks look at your <strong className="text-white">borrowing capacity</strong>, which is basically how much debt they think you can handle based on your income and existing commitments.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              HECS-HELP repayments reduce your disposable income, which means banks factor them in. Even though HECS isn't a traditional loan with interest rates and monthly bills, the compulsory repayments still come out of your pay, so lenders treat them as an ongoing commitment.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              According to{' '}
              <a href="https://www.sbs.com.au/news/article/how-does-a-hecs-debt-affect-your-home-loan-borrowing-power/htrpoqtpk" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Finspo
              </a>{' '}
              (a digital mortgage broker cited by SBS News), maximum borrowing power typically reduces by around <strong className="text-white">10 times the value of your annual HECS repayment</strong>. So if you're repaying $4,000 per year, that could mean roughly $40,000 less borrowing capacity.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              That's a meaningful number when you're trying to get into the property market.
            </p>
          </section>

          {/* Section: What Changed in 2025 */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What Changed in 2025</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              The federal government has directed APRA (Australian Prudential Regulation Authority) and ASIC to update their guidance on how lenders assess HECS debt. These changes took effect from <strong className="text-white">30 September 2025</strong>.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">Here's what's different now, based on the updated regulatory guidance:</p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Banks can now exclude HECS repayments from borrowing assessments</strong> if the debt is expected to be fully repaid within 12 months. Some lenders have also started reducing the buffer they apply for debts expected to clear within 2-5 years.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <a href="https://www.nab.com.au/personal/life-moments/home-property/buy-first-home/hecs-home-loan" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                NAB
              </a>{' '}
              has publicly stated that if your student debt is $20,000 or less, it won't impact how much you can borrow with them.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <a href="https://www.unloan.com.au/learn/how-your-hecs-debt-affects-your-home-loan" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Commonwealth Bank (CBA)
              </a>{' '}
              rolled out changes ahead of the regulatory update, excluding HELP debt from serviceability assessments if it's being repaid in under 12 months.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              These are significant shifts for first-home buyers who were previously knocked back or had their borrowing capacity cut because of student debt.
            </p>
          </section>

          {/* Section: What This Means for You */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What This Means for You Right Now</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              If you're still deciding whether to go to uni, or how much debt to take on, this is worth thinking about:
            </p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li>A <strong className="text-white">$25,000 HECS debt</strong> with a $70,000 salary means annual repayments of about $450 — relatively small impact on borrowing.</li>
              <li>A <strong className="text-white">$50,000 HECS debt</strong> with a $90,000 salary means annual repayments of about $3,450 — that could reduce your borrowing power by $30,000-$40,000 or more.</li>
              <li>The <strong className="text-white">longer your debt takes to pay off</strong>, the longer it sits on your borrowing assessment as a liability.</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              None of this means "don't go to uni." It means go in with your eyes open and understand the downstream effects.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <strong className="text-white">Model your specific scenario:</strong>{' '}
              <a href="https://www.helploancalculator.com" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Use the HELP Loan Calculator →
              </a>{' '}
              to see how long your debt will take to repay based on your expected income, and when you'd be clear of it before applying for a home loan.
            </p>
          </section>

          {/* Section: Where to Learn More */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Where to Learn More</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This guide summarises publicly available information. For the full details, go straight to the source:
            </p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li>
                <a href="https://www.nab.com.au/personal/life-moments/home-property/buy-first-home/hecs-home-loan" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  NAB — HECS and Home Loans
                </a>
              </li>
              <li>
                <a href="https://www.aussie.com.au/insights/articles/hecs-home-loan-changes/" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  Aussie — HECS Home Loan Changes 2025
                </a>
              </li>
              <li>
                <a href="https://www.sbs.com.au/news/article/how-does-a-hecs-debt-affect-your-home-loan-borrowing-power/htrpoqtpk" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  SBS News — How HECS Affects Borrowing Power
                </a>
              </li>
              <li>
                <a href="https://www.apra.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  APRA Guidance Updates
                </a>
              </li>
            </ul>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              This guide is for educational purposes only. It is not financial, legal, or mortgage advice. Always speak to a licensed mortgage broker or financial adviser about your personal circumstances.
            </p>
          </section>
        </article>

        {/* More Guides */}
        <div className="mt-16 space-y-4">
          <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#CFCFCF]/60 opacity-70 text-center">More Guides</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: '/hecs-repayment-thresholds-2025-26', title: 'HECS Repayment Thresholds 2025-26' },
              { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
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
