/* eslint-disable react/no-unescaped-entities */
import GuideSiteHeader from '../../components/help/GuideSiteHeader';
import { GuidePageFooter, GuidePageIntro, GuideRelatedGuides } from '../../components/help/GuidePageChrome';

export const metadata = {
  title: 'HELP Borrowing Limit 2026 | How Much Can You Borrow?',
  description: 'There\'s a cap on how much you can borrow for uni in Australia. Learn the 2026 HELP loan limit, what counts toward it, and what happens when your degree costs more than the limit.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/help-borrowing-limit',
  },
  openGraph: {
    title: 'HELP Borrowing Limit 2026 | How Much Can You Borrow?',
    description: 'There\'s a cap on how much you can borrow for uni in Australia. Learn the 2026 HELP loan limit, what counts toward it, and what happens when your degree costs more than the limit.',
    url: 'https://www.helploancalculator.com/help-borrowing-limit',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'article',
  },
};

export default function GuideBorrowingLimit() {
  return (
    <div className="guide-article-page min-h-screen pb-20">
      <div className="guide-article-background" aria-hidden="true" />

      <GuideSiteHeader />

      <main className="max-w-3xl mx-auto px-4 py-8 relative z-10 app-fade-in">
        <GuidePageIntro
          code="07"
          accent="yellow"
          title="The HELP Borrowing Limit: How Much Can You Actually Borrow?"
          summary="Learn the 2026 borrowing limits, which HELP loans count toward them, how repayments restore available balance, and what happens when course fees exceed your remaining limit."
        />

        {/* Article */}
        <article className="space-y-8">
          {/* Section: There's a Cap */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">There's a Cap on How Much You Can Borrow</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              A lot of students assume they can borrow whatever their degree costs. That's not always true. The Australian Government sets a <strong className="text-white">lifetime HELP loan limit</strong>, and once you hit it, you can't borrow any more.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">In 2026, the limits are:</p>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li><strong className="text-white">$129,883</strong> for most students</li>
              <li><strong className="text-white">$186,544</strong> for students studying medicine, dentistry, veterinary science, or certain aviation courses</li>
            </ul>
            <p className="text-[#CFCFCF] leading-relaxed">
              This limit covers <strong className="text-white">all</strong> HELP loan types combined: HECS-HELP, FEE-HELP, VET Student Loans, and VET FEE-HELP. It's not per degree. It's the total you can ever borrow across your entire study history.
            </p>
          </section>

          {/* Section: What Happens When the Degree Costs More */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">What Happens When the Degree Costs More</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              Some degrees, particularly at private universities, cost more than the limit. When that happens, you need to pay the difference out of pocket during the course.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              For example, Bond University's Bachelor of Laws costs approximately <strong className="text-white">$142,720</strong> for domestic students. The FEE-HELP limit is $129,883. That leaves a gap of roughly <strong className="text-white">$13,000</strong> you'd need to cover yourself.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              This isn't uncommon at private institutions. If you're considering one, check the total degree cost against the current loan limit before you enrol so you know what you'll need to fund independently.
            </p>
          </section>

          {/* Section: Your Limit Is Renewable */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Your Limit Is Renewable</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              One thing most people don't realise: the HELP loan limit is <strong className="text-white">renewable</strong>. When you make repayments (compulsory or voluntary) toward your HELP debt, that amount gets added back to your available balance.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              So if you've borrowed $50,000 and repaid $10,000, your available balance goes back up to $89,883. This means if you want to study again later in life, you can re-access that borrowing capacity.
            </p>
            <p className="text-[#CFCFCF] leading-relaxed">
              This only applies to repayments made from the 2019-20 income year onward.
            </p>
          </section>

          {/* Section: How to Check */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">How to Check Your Available Balance</h3>
            <p className="text-[#CFCFCF] leading-relaxed">
              You can check your current HELP loan limit and available balance through{' '}
              <a href="https://myhelpbalance.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                myHELPbalance
              </a>
              . You'll need to log in with your myGov credentials.
            </p>
          </section>

          {/* Section: Sources */}
          <section className="space-y-4">
            <h3 className="text-xl font-bold font-montserrat text-[#62FFDA]">Where This Info Comes From</h3>
            <ul className="list-disc list-inside text-[#CFCFCF] leading-relaxed space-y-2 pl-2">
              <li>
                <a href="https://www.studyassist.gov.au/financial-and-study-support/how-student-loans-work/help-loan-limit" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  Study Assist: HELP Loan Limit
                </a>
              </li>
              <li>
                <a href="https://myhelpbalance.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  myHELPbalance
                </a>
              </li>
              <li>
                <a href="https://bond.edu.au/program/bachelor-of-laws/fees" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">
                  Bond University: Bachelor of Laws Fees
                </a>
              </li>
            </ul>
            <p className="text-[#CFCFCF]/60 text-sm italic leading-relaxed">
              This guide is for educational purposes only. Limits are indexed annually. Always check the current limit on Study Assist.
            </p>
          </section>
        </article>

        <GuideRelatedGuides guides={[
          { href: '/hecs-help-vs-fee-help', title: 'HECS-HELP vs FEE-HELP' },
          { href: '/hecs-repayment-thresholds-2026-27', title: 'HECS Repayment Thresholds 2026–27' },
          { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
        ]} />
        <GuidePageFooter />
      </main>
    </div>
  );
}
