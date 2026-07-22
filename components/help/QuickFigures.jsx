import {
  FINANCIAL_YEAR,
  formatCurrency,
  getQuickAnswer,
} from '../../lib/hecsRates';

export default function QuickFigures({ income }) {
  const answer = getQuickAnswer(income);

  return (
    <section
      className="rounded-[24px] border border-black/15 bg-[var(--mb-paper)] p-5 shadow-[0_10px_28px_rgba(16,24,32,0.07)] sm:p-6"
      aria-labelledby="quick-figures-title"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 id="quick-figures-title" className="font-impact text-xs uppercase tracking-[0.12em] text-[var(--mb-ink)]">
          Quick Figures
        </h2>
        <span className="rounded-full bg-[var(--mb-mint)]/20 px-3 py-1 font-instrument text-[10px] font-bold uppercase tracking-wider text-[var(--mb-mint-deep)]">
          {FINANCIAL_YEAR}
        </span>
      </div>

      <dl className="grid grid-cols-3 overflow-hidden rounded-2xl border border-black/15 bg-[var(--mb-cream)]">
        <div className="p-3 sm:p-4">
          <dt className="font-instrument text-[9px] font-bold uppercase tracking-wider text-[var(--mb-muted)] sm:text-[10px]">Annual</dt>
          <dd className="mt-1 font-mono text-base font-bold text-[var(--mb-ink)] sm:text-xl">{formatCurrency(answer.annual)}</dd>
        </div>
        <div className="border-x border-black/15 p-3 sm:p-4">
          <dt className="font-instrument text-[9px] font-bold uppercase tracking-wider text-[var(--mb-muted)] sm:text-[10px]">Monthly</dt>
          <dd className="mt-1 font-mono text-base font-bold text-[var(--mb-ink)] sm:text-xl">{formatCurrency(answer.monthly)}</dd>
        </div>
        <div className="p-3 sm:p-4">
          <dt className="font-instrument text-[9px] font-bold uppercase tracking-wider text-[var(--mb-muted)] sm:text-[10px]">Weekly</dt>
          <dd className="mt-1 font-mono text-base font-bold text-[var(--mb-ink)] sm:text-xl">{formatCurrency(answer.weekly)}</dd>
        </div>
      </dl>

      <p className="mt-5 font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">
        {answer.band.shortLabel}, with an effective repayment rate of{' '}
        <strong className="text-[var(--mb-ink)]">{answer.effectiveRate.toFixed(1)}%</strong> of repayment income.
      </p>
    </section>
  );
}
