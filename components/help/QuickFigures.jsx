import {
  FINANCIAL_YEAR,
  formatCurrency,
  getQuickAnswer,
} from '../../lib/hecsRates';

export default function QuickFigures({ income }) {
  const answer = getQuickAnswer(income);

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6" aria-labelledby="quick-figures-title">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <h2 id="quick-figures-title" className="font-montserrat text-sm font-bold uppercase tracking-wider text-white">
          Quick Figures
        </h2>
        <span className="font-montserrat text-[10px] font-bold uppercase tracking-wider text-[#62FFDA]">
          {FINANCIAL_YEAR}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <div>
          <dt className="font-montserrat text-[10px] uppercase tracking-wider text-[#CFCFCF]/60">Annual</dt>
          <dd className="mt-1 font-mono text-lg font-bold text-white">{formatCurrency(answer.annual)}</dd>
        </div>
        <div>
          <dt className="font-montserrat text-[10px] uppercase tracking-wider text-[#CFCFCF]/60">Monthly</dt>
          <dd className="mt-1 font-mono text-lg font-bold text-white">{formatCurrency(answer.monthly)}</dd>
        </div>
        <div>
          <dt className="font-montserrat text-[10px] uppercase tracking-wider text-[#CFCFCF]/60">Weekly</dt>
          <dd className="mt-1 font-mono text-lg font-bold text-white">{formatCurrency(answer.weekly)}</dd>
        </div>
      </dl>

      <p className="mt-5 text-xs leading-relaxed text-[#CFCFCF]">
        {answer.band.shortLabel}, with an effective repayment rate of{' '}
        <strong className="text-white">{answer.effectiveRate.toFixed(1)}%</strong> of repayment income.
      </p>
    </section>
  );
}
