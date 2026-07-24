import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { formatCurrency } from '../../lib/hecsRates';

const YEAR_ACCENTS = [
  'var(--mb-sky)',
  'var(--mb-mint)',
  'var(--mb-yellow)',
  'var(--mb-pink)',
];

function signedCurrency(value, sign) {
  if (value <= 0) return '—';
  return `${sign}${formatCurrency(value)}`;
}

function EventNotes({ notes = [] }) {
  if (!notes.length) return null;

  return (
    <ul className="year-table__events" aria-label="Life events this year">
      {notes.map((note, index) => (
        <li key={`${note}-${index}`}>{note}</li>
      ))}
    </ul>
  );
}

function MobileMetric({ label, value, tone }) {
  return (
    <div className={`year-table__mobile-metric year-table__mobile-metric--${tone}`}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export default function YearTable({ timelineData }) {
  const [isOpen, setIsOpen] = useState(false);
  const regionId = 'year-by-year-breakdown';

  if (!timelineData.length) return null;

  return (
    <section
      className="year-table mb-colour-card overflow-hidden"
      style={{ '--card-accent': 'var(--mb-sky)' }}
      aria-labelledby="year-table-title"
    >
      <button
        type="button"
        className="year-table__toggle"
        aria-expanded={isOpen}
        aria-controls={regionId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="year-table__heading">
          <span className="year-table__number" aria-hidden="true">05</span>
          <span>
            <span className="year-table__eyebrow">Projection ledger</span>
            <span id="year-table-title" className="year-table__title">Year-by-year breakdown</span>
            <span className="year-table__description">
              Follow the income, indexation, repayments and closing balance behind your estimate.
            </span>
          </span>
        </span>

        <span className="year-table__toggle-label">
          <span>{isOpen ? 'Hide years' : `${timelineData.length} years`}</span>
          <span className="year-table__toggle-icon">
            {isOpen ? <ChevronUp size={19} aria-hidden="true" /> : <ChevronDown size={19} aria-hidden="true" />}
          </span>
        </span>
      </button>

      {isOpen ? (
        <div id={regionId} className="year-table__content">
          <div className="year-table__mobile-list sm:hidden">
            {timelineData.map((row, index) => (
              <article
                key={row.year}
                className="year-table__year-card"
                style={{ '--year-accent': YEAR_ACCENTS[index % YEAR_ACCENTS.length] }}
                aria-labelledby={`year-${row.year}`}
              >
                <header className="year-table__year-card-header">
                  <div>
                    <p className="year-table__year-kicker">Projection year</p>
                    <h3 id={`year-${row.year}`} className="year-table__year">
                      {row.year}
                    </h3>
                    {row.age ? <p className="year-table__age">Age {row.age}</p> : null}
                  </div>

                  <div className="year-table__balance">
                    <p>Closing balance</p>
                    <strong>{formatCurrency(row.endBalance)}</strong>
                  </div>
                </header>

                <dl className="year-table__mobile-metrics">
                  <MobileMetric
                    label="Income"
                    value={formatCurrency(row.taxableIncome)}
                    tone="ink"
                  />
                  <MobileMetric
                    label="Indexation added"
                    value={signedCurrency(row.indexation, '+')}
                    tone="pink"
                  />
                  <MobileMetric
                    label="Compulsory repaid"
                    value={signedCurrency(row.compulsory, '−')}
                    tone="blue"
                  />
                  <MobileMetric
                    label="Extra repaid"
                    value={signedCurrency(row.voluntary, '−')}
                    tone="yellow"
                  />
                </dl>

                <EventNotes notes={row.notes} />
              </article>
            ))}
          </div>

          <div className="year-table__desktop-wrap hidden sm:block">
            <table className="year-table__desktop">
              <caption className="sr-only">Projected HELP debt by year</caption>
              <thead>
                <tr>
                  <th scope="col">Year and age</th>
                  <th scope="col">Income</th>
                  <th scope="col">Indexation added</th>
                  <th scope="col">Compulsory repaid</th>
                  <th scope="col">Extra repaid</th>
                  <th scope="col">Closing balance</th>
                </tr>
              </thead>
              <tbody>
                {timelineData.map((row, index) => (
                  <tr key={row.year} style={{ '--row-accent': YEAR_ACCENTS[index % YEAR_ACCENTS.length] }}>
                    <th scope="row">
                      <span className="year-table__desktop-year">{row.year}</span>
                      {row.age ? <span className="year-table__desktop-age">Age {row.age}</span> : null}
                    </th>
                    <td>
                      <span className="year-table__desktop-value">{formatCurrency(row.taxableIncome)}</span>
                      <EventNotes notes={row.notes} />
                    </td>
                    <td>
                      <span className="year-table__desktop-value year-table__desktop-value--pink">
                        {signedCurrency(row.indexation, '+')}
                      </span>
                    </td>
                    <td>
                      <span className="year-table__desktop-value year-table__desktop-value--blue">
                        {signedCurrency(row.compulsory, '−')}
                      </span>
                    </td>
                    <td>
                      <span className="year-table__desktop-value year-table__desktop-value--yellow">
                        {signedCurrency(row.voluntary, '−')}
                      </span>
                    </td>
                    <td className="year-table__desktop-balance">
                      <span>{formatCurrency(row.endBalance)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="year-table__legend" aria-label="How to read the yearly figures">
            <span><i className="year-table__legend-dot year-table__legend-dot--pink" /> Added to debt</span>
            <span><i className="year-table__legend-dot year-table__legend-dot--blue" /> Compulsory repayment</span>
            <span><i className="year-table__legend-dot year-table__legend-dot--yellow" /> Optional repayment</span>
            <span><i className="year-table__legend-dot year-table__legend-dot--mint" /> Balance remaining</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}
