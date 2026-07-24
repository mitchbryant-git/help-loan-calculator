import { AlertCircle, ArrowDownRight, CalendarDays, CircleDollarSign } from 'lucide-react';

import { formatCurrency } from '../../lib/hecsRates';

export default function PrimaryResult({
  isDebtFree,
  finalYear,
  firstYear,
  finalAge,
  totalPaid,
  totalIndexation,
}) {
  const years = finalYear - firstYear + 1;

  return (
    <section
      className="mb-colour-card overflow-hidden rounded-[28px] border border-black/15"
      style={{ '--card-accent': 'var(--mb-mint)' }}
      aria-labelledby="primary-result-title"
    >
      <div className="p-5 sm:p-6">
        <div className="-mx-5 -mt-5 mb-5 flex items-center gap-2 rounded-t-[14px] border-b-2 border-black bg-[var(--mb-mint)] px-5 py-3 text-[var(--mb-ink)] sm:-mx-6 sm:-mt-6 sm:px-6">
          <span className="h-2.5 w-2.5 rounded-sm border border-black bg-[var(--mb-paper)]" />
          <p className="font-impact text-[10px] uppercase tracking-[0.14em]">02 · Your payoff summary</p>
        </div>

        <p className="font-instrument text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--mb-muted)]">
          Loan paid off in
        </p>
        <h2
          id="primary-result-title"
          key={`${isDebtFree}-${finalYear}-${firstYear}`}
          className="mt-1.5 font-anybody text-[clamp(3.25rem,6vw,5rem)] font-extrabold leading-[0.88] tracking-[-0.065em] text-[var(--mb-ink)]"
        >
          {isDebtFree ? `${years} years` : '50+ years'}
        </h2>

        {isDebtFree ? (
          <p className="mt-4 max-w-xl font-instrument text-sm leading-relaxed text-[var(--mb-muted)]">
            Clear by <strong className="text-[var(--mb-ink)]">{finalYear}</strong>
            {finalAge ? <> at about age <strong className="text-[var(--mb-ink)]">{finalAge}</strong></> : null}. Change an assumption or life event to see how the path moves.
          </p>
        ) : (
          <div className="mt-4 flex max-w-xl items-start gap-3 rounded-2xl border border-[var(--mb-pink)]/30 bg-[var(--mb-pink)]/8 p-3 text-[var(--mb-ink)]">
            <AlertCircle className="mt-0.5 shrink-0 text-[var(--mb-pink)]" size={18} />
            <p className="font-instrument text-xs leading-relaxed">
              The model does not clear the loan within 50 years. Try adjusting income growth or exploring life-event scenarios.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/10 p-px">
        <div className="bg-[var(--mb-readout)] p-4 text-white sm:px-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-impact text-[9px] uppercase tracking-[0.13em] text-white/60">Total repaid</p>
            <CircleDollarSign size={16} className="text-[var(--mb-mint)]" />
          </div>
          <p className="font-mono text-xl font-bold tracking-tight text-[var(--mb-mint)] sm:text-2xl">
            {formatCurrency(totalPaid)}
          </p>
        </div>

        <div className="bg-[var(--mb-readout)] p-4 text-white sm:px-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="font-impact text-[9px] uppercase tracking-[0.13em] text-white/60">Total indexation</p>
            <ArrowDownRight size={16} className="text-[var(--mb-pink)]" />
          </div>
          <p className="font-mono text-xl font-bold tracking-tight text-[var(--mb-pink)] sm:text-2xl">
            {formatCurrency(totalIndexation)}
          </p>
        </div>

        <div className="col-span-2 flex items-center gap-3 bg-[var(--mb-readout)] px-4 py-3 text-white/70 sm:px-5">
          <CalendarDays size={15} className="shrink-0 text-[var(--mb-yellow)]" />
          <p className="font-instrument text-[11px] leading-relaxed">
            Estimate only. Actual repayment income and future government settings may differ.
          </p>
        </div>
      </div>
    </section>
  );
}