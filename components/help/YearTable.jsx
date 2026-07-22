import { useState } from 'react';
import { CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';

import { formatCurrency } from '../../lib/hecsRates';

function EventNotes({ notes = [] }) {
  if (!notes.length) return null;

  return (
    <ul className="mt-2 space-y-1" aria-label="Life events this year">
      {notes.map((note, index) => (
        <li key={`${note}-${index}`} className="font-instrument text-[11px] font-semibold leading-snug text-[var(--mb-sky)]">
          {note}
        </li>
      ))}
    </ul>
  );
}

function Value({ children, colour = 'text-white' }) {
  return <dd className={`mt-1 font-mono text-sm font-bold ${colour}`}>{children}</dd>;
}

export default function YearTable({ timelineData }) {
  const [isOpen, setIsOpen] = useState(false);
  const regionId = 'year-by-year-breakdown';

  if (!timelineData.length) return null;

  return (
    <section className="overflow-hidden rounded-[28px] border border-black/15 bg-[var(--mb-paper)] shadow-[0_14px_36px_rgba(16,24,32,0.08)]" aria-labelledby="year-table-title">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--mb-sky)] sm:p-6"
        aria-expanded={isOpen}
        aria-controls={regionId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--mb-sky)]/12 text-[var(--mb-sky)]">
            <CalendarDays size={18} aria-hidden="true" />
          </span>
          <span>
            <span id="year-table-title" className="block font-impact text-xs uppercase tracking-[0.12em] text-[var(--mb-ink)]">Year-by-year breakdown</span>
            <span className="mt-1 block font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">See the income, indexation, repayments and closing balance behind your estimate.</span>
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-2 font-impact text-[9px] uppercase tracking-[0.1em] text-[var(--mb-muted)]">
          <span className="hidden sm:inline">{isOpen ? 'Hide details' : `Show ${timelineData.length} years`}</span>
          {isOpen ? <ChevronUp size={20} aria-hidden="true" /> : <ChevronDown size={20} aria-hidden="true" />}
        </span>
      </button>

      {isOpen ? (
        <div id={regionId} className="border-t border-black/10 bg-[var(--mb-readout)]">
          <div className="space-y-3 p-4 sm:hidden">
            {timelineData.map((row) => (
              <article key={row.year} className={`rounded-2xl border border-white/10 bg-white/[0.045] p-4 ${row.isBreak ? 'opacity-65' : ''}`}>
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-mono text-base font-bold text-white">{row.year}</h3>
                    {row.age ? <p className="font-instrument text-[11px] text-white/50">Age {row.age}</p> : null}
                  </div>
                  <div className="text-right">
                    <p className="font-impact text-[9px] uppercase tracking-[0.1em] text-white/45">Closing balance</p>
                    <p className="mt-1 font-mono text-base font-bold text-[var(--mb-mint)]">{formatCurrency(row.endBalance)}</p>
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <dt className="font-impact text-[8px] uppercase tracking-[0.1em] text-white/45">Income</dt>
                    <Value>{formatCurrency(row.taxableIncome)}</Value>
                  </div>
                  <div>
                    <dt className="font-impact text-[8px] uppercase tracking-[0.1em] text-white/45">Indexation</dt>
                    <Value colour="text-[var(--mb-pink)]">{row.indexation > 0 ? `+${formatCurrency(row.indexation)}` : '—'}</Value>
                  </div>
                  <div>
                    <dt className="font-impact text-[8px] uppercase tracking-[0.1em] text-white/45">Compulsory</dt>
                    <Value colour="text-[var(--mb-sky)]">{row.compulsory > 0 ? `−${formatCurrency(row.compulsory)}` : '—'}</Value>
                  </div>
                </dl>

                {row.voluntary > 0 ? <p className="mt-3 font-instrument text-[11px] font-semibold text-[var(--mb-yellow)]">Extra repayment: −{formatCurrency(row.voluntary)}</p> : null}
                <EventNotes notes={row.notes} />
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto sm:block">
            <table className="w-full min-w-[760px] text-left">
              <caption className="sr-only">Projected HELP debt by year</caption>
              <thead className="border-b border-white/10 bg-black/10 font-impact text-[9px] uppercase tracking-[0.1em] text-white/45">
                <tr>
                  <th scope="col" className="px-5 py-4">Year</th>
                  <th scope="col" className="px-5 py-4 text-right">Income</th>
                  <th scope="col" className="px-5 py-4 text-right">Indexation</th>
                  <th scope="col" className="px-5 py-4 text-right">Compulsory</th>
                  <th scope="col" className="px-5 py-4 text-right">Extra</th>
                  <th scope="col" className="px-5 py-4 text-right">Closing balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {timelineData.map((row) => (
                  <tr key={row.year} className={`align-top transition hover:bg-white/[0.035] ${row.isBreak ? 'opacity-65' : ''}`}>
                    <th scope="row" className="px-5 py-4 font-mono text-sm font-bold text-white">
                      {row.year}
                      {row.age ? <span className="mt-0.5 block font-instrument text-[11px] font-normal text-white/45">Age {row.age}</span> : null}
                    </th>
                    <td className="px-5 py-4 text-right font-mono text-sm font-bold text-white">
                      {formatCurrency(row.taxableIncome)}
                      <EventNotes notes={row.notes} />
                    </td>
                    <td className="px-5 py-4 text-right font-mono text-sm font-bold text-[var(--mb-pink)]">{row.indexation > 0 ? `+${formatCurrency(row.indexation)}` : '—'}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm font-bold text-[var(--mb-sky)]">{row.compulsory > 0 ? `−${formatCurrency(row.compulsory)}` : '—'}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm font-bold text-[var(--mb-yellow)]">{row.voluntary > 0 ? `−${formatCurrency(row.voluntary)}` : '—'}</td>
                    <td className="px-5 py-4 text-right font-mono text-sm font-bold text-[var(--mb-mint)]">{formatCurrency(row.endBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
