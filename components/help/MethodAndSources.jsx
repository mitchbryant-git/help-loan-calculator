import { ExternalLink, FileCheck2, ShieldCheck } from 'lucide-react';

import {
  ATO_INDEXATION_URL,
  ATO_RATES_URL,
  FINANCIAL_YEAR,
  REPAYMENT_BANDS,
  STUDY_ASSIST_REPAYMENTS_URL,
} from '../../lib/hecsRates';

const sources = [
  {
    label: 'Study Assist — loan repayments',
    href: STUDY_ASSIST_REPAYMENTS_URL,
    detail: '2026–27 threshold and marginal repayment formula',
  },
  {
    label: 'ATO — repayment thresholds and rates',
    href: ATO_RATES_URL,
    detail: 'Official current and historical repayment rules',
  },
  {
    label: 'ATO — indexation rates',
    href: ATO_INDEXATION_URL,
    detail: 'Official annual study-loan indexation history',
  },
];

export default function MethodAndSources({ indexationRate, wageGrowth }) {
  return (
    <section className="mb-colour-card overflow-hidden rounded-[28px] border border-black/15" style={{ '--card-accent': 'var(--mb-mint)' }} aria-labelledby="method-title">
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-[var(--mb-mint)]/20 text-[var(--mb-mint-deep)]">
              <FileCheck2 size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-impact text-[9px] uppercase tracking-[0.12em] text-[var(--mb-mint-deep)]">Transparent by design</p>
              <h2 id="method-title" className="mt-1 font-anybody text-2xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">How this estimate works</h2>
            </div>
          </div>

          <ol className="mt-6 space-y-4">
            {[
              ['Start with your inputs', 'The projection begins with your current HELP balance, repayment income, first working year and age.'],
              ['Project each year', `Income grows by your chosen ${wageGrowth}% assumption. Extra repayments and life events are applied, then ${indexationRate}% indexation and the estimated compulsory repayment.`],
              ['Stop when the balance reaches zero', 'The table and timeline show the resulting annual path for up to 50 years. Calculations retain cents internally; the interface rounds to whole dollars.'],
            ].map(([title, copy], index) => (
              <li key={title} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--mb-ink)] font-mono text-xs font-bold text-white">{index + 1}</span>
                <div>
                  <h3 className="font-impact text-[10px] uppercase tracking-[0.1em] text-[var(--mb-ink)]">{title}</h3>
                  <p className="mt-1 font-instrument text-sm leading-relaxed text-[var(--mb-muted)]">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-3xl bg-[var(--mb-readout)] p-5 text-white sm:p-6" aria-label="Model assumptions">
          <div className="flex items-center gap-2 text-[var(--mb-yellow)]">
            <ShieldCheck size={18} aria-hidden="true" />
            <h3 className="font-impact text-[10px] uppercase tracking-[0.12em]">Important assumptions</h3>
          </div>
          <ul className="mt-4 space-y-3 font-instrument text-sm leading-relaxed text-white/68">
            <li>The {FINANCIAL_YEAR} thresholds and marginal rates are held constant across the projection.</li>
            <li>The indexation rate is a planning assumption. The real rate changes each year.</li>
            <li>Timing is simplified to one annual cycle. Real balances, withholding and tax assessments can differ.</li>
            <li>Repayment income can include more than salary, including reportable benefits, investment losses and reportable super contributions.</li>
          </ul>
          <p className="mt-5 border-t border-white/10 pt-4 font-instrument text-xs leading-relaxed text-white/48">
            Educational estimate only—not personal financial, legal or tax advice. Confirm your position with the ATO or a qualified professional before acting.
          </p>
        </aside>
      </div>

      <div className="border-t border-black/10 p-5 sm:p-6 lg:p-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-impact text-[9px] uppercase tracking-[0.12em] text-[var(--mb-sky)]">Current calculation rules</p>
            <h3 className="mt-1 font-anybody text-xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">{FINANCIAL_YEAR} repayment bands</h3>
          </div>
          <span className="font-instrument text-xs text-[var(--mb-muted)]">Checked 22 July 2026</span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-black/15">
          <div className="grid grid-cols-[0.9fr_1.1fr] bg-[var(--mb-ink)] px-4 py-3 font-impact text-[9px] uppercase tracking-[0.1em] text-white/55 sm:px-5">
            <div>Repayment income</div>
            <div className="text-right">Repayment calculation</div>
          </div>
          {REPAYMENT_BANDS.map((band, index) => (
            <div key={band.id} className={`grid grid-cols-[0.9fr_1.1fr] gap-3 px-4 py-3.5 font-instrument text-xs sm:px-5 sm:text-sm ${index % 2 ? 'bg-black/[0.025]' : 'bg-white/55'} ${index ? 'border-t border-black/10' : ''}`}>
              <div className="font-mono font-bold text-[var(--mb-ink)]">{band.rangeLabel}</div>
              <div className="text-right leading-relaxed text-[var(--mb-muted)]">{band.calcLabel}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {sources.map((source) => (
            <a
              key={source.href}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-black/15 bg-[var(--mb-cream)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--mb-sky)]/45 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)]"
            >
              <span className="flex items-start justify-between gap-3 font-impact text-[10px] uppercase leading-relaxed tracking-[0.08em] text-[var(--mb-ink)]">
                {source.label}
                <ExternalLink size={14} className="mt-0.5 shrink-0 text-[var(--mb-sky)]" aria-hidden="true" />
              </span>
              <span className="mt-2 block font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">{source.detail}</span>
            </a>
          ))}
        </div>

        <p className="mt-6 font-instrument text-[11px] leading-relaxed text-[var(--mb-muted)]">
          To the extent permitted by law, Mitch Bryant accepts no responsibility for loss arising from reliance on this estimate. Actual compulsory repayments are determined by the ATO after your tax return is lodged.
        </p>
      </div>
    </section>
  );
}
