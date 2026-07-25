import Link from 'next/link';
import { ChevronDown, CircleHelp } from 'lucide-react';

import {
  FINANCIAL_YEAR,
  REPAYMENT_BANDS,
  REPAYMENT_THRESHOLD,
  calculateCompulsoryRepayment,
  formatCurrency,
} from '../../lib/hecsRates';

const linkClass = 'font-semibold text-[var(--mb-sky-deep)] underline decoration-[var(--mb-sky)]/30 underline-offset-2 transition hover:text-[var(--mb-mint-deep)]';

const faqs = [
  {
    q: "What's the difference between HECS and HELP?",
    a: (
      <>
        <p>HELP is the Australian Government&apos;s overall student-loan system. HECS-HELP is the most common loan within it, used for student contributions in Commonwealth Supported Places.</p>
        <p className="mt-3">Other types include FEE-HELP for eligible full-fee study, SA-HELP for student services and amenities fees, and OS-HELP for eligible overseas study expenses. These balances form part of your accumulated HELP debt and use the same compulsory-repayment system.</p>
        <a href="https://www.studyassist.gov.au/helping-you-understand/how-student-loans-work" target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-3 inline-block`}>See how student loans work on Study Assist</a>
      </>
    ),
  },
  {
    q: 'When do I start repaying my HELP debt?',
    a: (
      <p>You start making compulsory repayments when your repayment income exceeds <strong className="text-[var(--mb-ink)]">${REPAYMENT_THRESHOLD.toLocaleString('en-AU')}</strong> in {FINANCIAL_YEAR}. Repayment income can include taxable income, reportable fringe benefits, net investment losses, reportable super contributions and exempt foreign-employment income. The ATO works out the final amount after you lodge your tax return.</p>
    ),
  },
  {
    q: 'Does HECS-HELP charge interest?',
    a: (
      <p>No interest is charged, but eligible debt is indexed each year to maintain its real value. The 1 June 2026 indexation rate was 2.8%. The rate can change each year, so this calculator lets you change the long-term assumption. <Link href="/how-hecs-indexation-works" className={linkClass}>Learn how indexation works.</Link></p>
    ),
  },
  {
    q: 'How much will my compulsory repayment be?',
    a: (
      <p>It depends on your repayment income. Under the {FINANCIAL_YEAR} marginal system, you pay nothing up to ${REPAYMENT_BANDS[0].max.toLocaleString('en-AU')}, then 15 cents for each dollar over that threshold, with a further 17-cent band and a 10% total-income cap. At $85,000, the estimate is {formatCurrency(calculateCompulsoryRepayment(85000))} for the year. <Link href="/hecs-repayment-thresholds-2026-27" className={linkClass}>See the full thresholds.</Link></p>
    ),
  },
  {
    q: 'Can HELP debt affect my home-loan borrowing power?',
    a: (
      <p>Yes. Lenders generally include compulsory HELP repayments when assessing your expenses and borrowing capacity, although lender policies can differ and may change. <Link href="/hecs-debt-and-home-loans" className={linkClass}>Read the detailed home-loan guide.</Link></p>
    ),
  },
  {
    q: 'Can I make voluntary repayments?',
    a: (
      <p>Yes. You can make voluntary repayments to the ATO at any time. They reduce your debt but do not replace a compulsory repayment that may be assessed on your income. Use What could change? above to test how the timing could change your projection.</p>
    ),
  },
  {
    q: 'How do I check my HELP balance?',
    a: (
      <p>Sign in to <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer" className={linkClass}>myGov</a>, open the linked ATO service and find your loan accounts. Your account may not immediately show very recent study charges or repayments.</p>
    ),
  },
  {
    q: "What happens if I don't finish my degree?",
    a: (
      <p>Any valid HELP charges already added to your account generally remain even if you leave the course. They can continue to be indexed and become repayable when your income reaches the threshold. <Link href="/real-cost-of-starting-uni-before-youre-ready" className={linkClass}>Explore the cost of starting before you are ready.</Link></p>
    ),
  },
  {
    q: 'What if I move overseas?',
    a: (
      <p>You may still need to report your worldwide income and make repayments when it exceeds the relevant threshold. Check the <a href="https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/overseas-repayments" target="_blank" rel="noopener noreferrer" className={linkClass}>ATO overseas-repayment guidance</a> for your reporting obligations.</p>
    ),
  },
  {
    q: 'What happens to HELP debt when someone dies?',
    a: (
      <p>A compulsory repayment for the period before death may still be included in the final tax assessment. After that, the remaining accumulated HELP debt is cancelled and is not recovered from the estate.</p>
    ),
  },
];

export default function HelpFaq() {
  return (
    <section className="mb-colour-card rounded-[28px] border border-black/15 p-5 sm:p-6 lg:p-8" style={{ '--card-accent': 'var(--mb-yellow)' }} aria-labelledby="faq-title">
      <div className="mb-6 flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--mb-yellow)]/25 text-[var(--mb-ink)]">
          <CircleHelp size={20} aria-hidden="true" />
        </span>
        <div>
          <p className="font-impact text-[9px] uppercase tracking-[0.12em] text-[var(--mb-muted)]">Common questions</p>
          <h2 id="faq-title" className="mt-1 font-anybody text-2xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">HELP debt, without the jargon</h2>
        </div>
      </div>

      <div className="divide-y divide-black/10 border-y border-black/10">
        {faqs.map((item) => (
          <details key={item.q} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-instrument text-sm font-bold text-[var(--mb-ink)] marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)] sm:text-base">
              <span>{item.q}</span>
              <ChevronDown size={18} className="shrink-0 text-[var(--mb-muted)] transition group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="max-w-3xl pb-5 pr-7 font-instrument text-sm leading-7 text-[var(--mb-muted)]">{item.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}
