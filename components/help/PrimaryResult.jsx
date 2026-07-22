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
      className="overflow-hidden rounded-[28px] border border-black/15 bg-[var(--mb-paper)] shadow-[0_16px_40px_rgba(16,24,32,0.10)]"
      aria-labelledby="primary-result-title"
    >
      <div className="grid lg:grid-cols-[1.25fr_0.75fr]">
        <div className="p-6 sm:p-8">
          <div className="mb-5 flex items-center gap-2 text-[var(--mb-mint-deep)]">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--mb-mint)] shadow-[0_0_0_4px_rgba(25,230,193,0.18)]" />
            <p className="font-impact text-[11px] uppercase tracking-[0.14em]">Your payoff summary</p>
          </div>

          <p className="font-instrument text-xs font-bold uppercase tracking-[0.15em] text-[var(--mb-muted)]">
            Loan paid off in
          </p>
          <h2
            id="primary-result-title"
            key={`${isDebtFree}-${finalYear}-${firstYear}`}
            className="mt-2 font-anybody text-[clamp(3.25rem,9vw,6.5rem)] font-extrabold leading-[0.86] tracking-[-0.065em] text-[var(--mb-ink)]"
          >
            {isDebtFree ? `${years} years` : '50+ years'}
          </h2>

          {isDebtFree ? (
            <p className="mt-6 max-w-xl font-instrument text-base leading-relaxed text-[var(--mb-muted)]">
              On these assumptions, you could clear the debt in <strong className="text-[var(--mb-ink)]">{finalYear}</strong>
              {finalAge ? <> at about age <strong className="text-[var(--mb-ink)]">{finalAge}</strong></> : null}.
              Change an assumption or add a life event to see how the path moves.
            </p>
          ) : (
            <div className="mt-6 flex max-w-xl items-start gap-3 rounded-2xl border border-[var(--mb-pink)]/30 bg-[var(--mb-pink)]/8 p-4 text-[var(--mb-ink)]">
              <AlertCircle className="mt-0.5 shrink-0 text-[var(--mb-pink)]" size={20} />
              <p className="font-instrument text-sm leading-relaxed">
                The model does not clear the loan within 50 years. Try adjusting income growth or exploring life-event scenarios.
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10 p-px lg:grid-cols-1">
          <div className="bg-[var(--mb-readout)] p-5 text-white sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-impact text-[10px] uppercase tracking-[0.13em] text-white/60">Total repaid</p>
              <CircleDollarSign size={19} className="text-[var(--mb-mint)]" />
            </div>
            <p className="font-mono text-2xl font-bold tracking-tight text-[var(--mb-mint)] sm:text-3xl">
              {formatCurrency(totalPaid)}
            </p>
          </div>

          <div className="bg-[var(--mb-readout)] p-5 text-white sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="font-impact text-[10px] uppercase tracking-[0.13em] text-white/60">Total indexation</p>
              <ArrowDownRight size={19} className="text-[var(--mb-pink)]" />
            </div>
            <p className="font-mono text-2xl font-bold tracking-tight text-[var(--mb-pink)] sm:text-3xl">
              {formatCurrency(totalIndexation)}
            </p>
          </div>

          <div className="col-span-2 flex items-center gap-3 bg-[var(--mb-readout)] px-5 py-4 text-white/70 lg:col-span-1">
            <CalendarDays size={17} className="text-[var(--mb-yellow)]" />
            <p className="font-instrument text-xs leading-relaxed">
              Estimate only. Your actual repayment income and future government settings may differ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
