import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'The Real Cost of Starting Uni Before You\'re Ready | HECS Debt Scenarios',
  description: 'What happens financially when you jump into a degree before you\'re sure? See real scenarios comparing the cost of switching degrees, dropping out, or taking a gap year first.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/real-cost-of-starting-uni-before-youre-ready',
  },
  openGraph: {
    title: 'The Real Cost of Starting Uni Before You\'re Ready | HECS Debt Scenarios',
    description: 'What happens financially when you jump into a degree before you\'re sure? See real scenarios comparing the cost of switching degrees, dropping out, or taking a gap year first.',
    url: 'https://www.helploancalculator.com/real-cost-of-starting-uni-before-youre-ready',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

export default function GuideStartingEarly() {
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
            The Real Cost of Starting Uni Before You're Ready
          </h1>

          {/* Section: Nobody Tells You This in Year 12 */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Nobody Tells You This in Year 12</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Every year, thousands of students accept a uni offer because it feels like the next logical step. The pressure to "figure it out" at 17 is real, whether it's coming from school, parents, or just the fear of being left behind while everyone else moves on.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              But here's a question worth sitting with: <strong className="text-white">what does it actually cost if you start a degree and realise it's not right?</strong>
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Not in a vague "it'll be fine" way. In actual dollars, added to your HECS debt, indexed every year, and repaid over the next decade or more of your working life.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              This guide isn't here to tell you whether to go to uni or take a gap year. That's your call. It's here to show you what the numbers look like so you can make that call with full visibility.
            </p>
          </section>

          {/* Section: How Much Does a Degree Actually Cost? */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">How Much Does a Degree Actually Cost?</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              For Australian students in a Commonwealth Supported Place (CSP), the government covers a portion of your tuition. You pay the rest, known as the "student contribution." This amount depends on what you study.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              As a rough guide, here's what a full degree typically costs in student contributions (the part that becomes your HECS debt):
            </p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li><strong className="text-white">Arts, humanities, education:</strong> ~$16,000 - $20,000 for a 3-year degree</li>
              <li><strong className="text-white">Science, engineering, IT:</strong> ~$30,000 - $40,000 for a 3-4 year degree</li>
              <li><strong className="text-white">Commerce, business, law:</strong> ~$40,000 - $55,000 for a 3-4 year degree</li>
              <li><strong className="text-white">Medicine, dentistry, vet science:</strong> $50,000+ over 4-6 years</li>
            </ul>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              These are indicative ranges based on 2025 student contribution bands. Actual costs vary by university and degree structure. Check{' '}
              <a href="https://www.studyassist.gov.au/financial-and-study-support/commonwealth-supported-places/student-contribution-amounts" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Study Assist
              </a>{' '}
              for current rates.
            </p>
          </section>

          {/* Scenario 1 */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Scenario 1: You Start, Switch, and Finish</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              This is one of the most common outcomes. You start a degree, do a year, realise it's not for you, and switch to something else.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              Let's say you do one year of a Commerce degree (~$14,000 in HECS) before switching to IT. Depending on how many credits transfer, you might get some units recognised. But often, you're starting close to scratch.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed"><strong className="text-white">The cost of that detour:</strong></p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li>~$14,000 in HECS from Year 1 that didn't contribute to your final degree</li>
              <li>That $14,000 gets indexed every year while you finish your new degree and start earning</li>
              <li>At 3% indexation over 5 years, that wasted year becomes ~$16,200 before you've repaid any of it</li>
              <li>Plus your actual degree cost on top</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              You're now carrying a larger debt that takes longer to pay off.
            </p>
          </section>

          {/* Scenario 2 */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Scenario 2: You Start and Drop Out</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Some students don't switch. They stop entirely. According to government data, around 1 in 5 domestic students don't complete their degree. That doesn't make them failures. It means the degree wasn't right, or the timing wasn't right. But the HECS debt from the subjects they completed doesn't disappear.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              If you complete one year of a Commerce degree and leave, you still owe ~$14,000. That debt gets indexed annually and you'll start repaying it once you earn above $67,000, regardless of whether you have a degree or not.
            </p>
          </section>

          {/* Scenario 3 */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Scenario 3: You Take a Year to Work, Then Start</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              What if you took a gap year, worked, saved some money, and figured out what you actually wanted to study? There's no financial penalty for starting uni at 19 instead of 18. Your HECS access doesn't expire. Your CSP eligibility doesn't change.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">What you gain:</p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li><strong className="text-white">A year of income</strong> (even at $50,000, that's $50,000 you wouldn't have had)</li>
              <li><strong className="text-white">Time to research</strong> what degree actually aligns with how you want to live</li>
              <li><strong className="text-white">Clarity</strong> that reduces the chance of switching or dropping out</li>
              <li><strong className="text-white">A later start to your HECS debt</strong>, which means fewer years of indexation before you pay it off</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">What you trade off:</p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li>You enter the workforce with a degree one year later</li>
              <li>You may start earning at a graduate-level salary one year later</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              Whether that trade-off is worth it depends entirely on your situation. But it's not the disaster some people make it out to be.
            </p>
          </section>

          {/* Section: Run Your Own Numbers */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Run Your Own Numbers</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              These scenarios are generalisations. Your degree, your income path, and your timeline will be different. That's exactly why we built the calculator.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              <a href="https://www.helploancalculator.com" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors font-bold underline underline-offset-2">
                Use the HELP Loan Calculator →
              </a>{' '}
              to model your specific situation:
            </p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li>Enter different debt amounts to compare a 3-year vs 4-year path</li>
              <li>Use the <strong className="text-white">gap year feature</strong> to see what happens if you delay repayments for a year</li>
              <li>Adjust your expected income and see how it changes the payoff timeline</li>
              <li>Add voluntary repayments to see how you could clear it faster</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              The point isn't to scare you off uni. It's to make sure you go in knowing exactly what you're signing up for, so you can own the decision.
            </p>
          </section>

          {/* Section: This Is Your Call */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">This Is Your Call</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Going to uni straight out of school is the right move for a lot of people. So is taking time to figure things out first. Neither path is wrong. The wrong move is making a $30,000-$50,000 decision without understanding the numbers behind it.
            </p>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              This guide is for educational purposes only. It is not financial or career advice. Degree costs are indicative and based on 2025 student contribution bands published by{' '}
              <a href="https://www.studyassist.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                Study Assist
              </a>. Always check with your specific university for exact fees.
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
