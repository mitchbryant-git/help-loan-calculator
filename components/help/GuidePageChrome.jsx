import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, BookOpen, Calculator } from 'lucide-react';

const ACCENTS = {
  sky: 'var(--mb-sky)',
  mint: 'var(--mb-mint)',
  yellow: 'var(--mb-yellow)',
  pink: 'var(--mb-pink)',
};

export function GuidePageIntro({
  code,
  title,
  summary,
  accent = 'mint',
  updated,
}) {
  return (
    <>
      <Link href="/" className="guide-back-link">
        <ArrowLeft size={15} aria-hidden="true" />
        Back to calculator
      </Link>

      <header
        className="guide-intro"
        style={{ '--guide-accent': ACCENTS[accent] || ACCENTS.mint }}
      >
        <div className="guide-intro__system-bar">
          <span>MB-01 // RESOURCE LIBRARY</span>
          <span><i aria-hidden="true" /> GUIDE FILE {code}</span>
        </div>

        <div className="guide-intro__body">
          <div className="guide-intro__title">
            <p>Know the system. Plan your move.</p>
            <h1>{title}</h1>
            <div className="guide-intro__meta">
              <span>HELP guide</span>
              <span>{updated ? `Updated ${updated}` : '2026 edition'}</span>
              <span>Educational only</span>
            </div>
          </div>

          <aside className="guide-intro__summary">
            <span className="guide-intro__summary-icon" aria-hidden="true">
              <BookOpen size={20} />
            </span>
            <div>
              <strong>Quick briefing</strong>
              <p>{summary}</p>
            </div>
          </aside>
        </div>

        <div className="guide-intro__colour-rail" aria-hidden="true">
          <i /><i /><i /><i />
        </div>
      </header>
    </>
  );
}

export function GuideRelatedGuides({ guides }) {
  return (
    <section className="guide-related" aria-labelledby="guide-related-title">
      <div className="guide-related__heading">
        <div>
          <p>Resource library</p>
          <h2 id="guide-related-title">Keep exploring</h2>
        </div>
        <Link href="/#guides">
          See all guides
          <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="guide-related__grid">
        {guides.map((guide, index) => (
          <Link href={guide.href} key={guide.href} className="guide-related__card">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{guide.title}</strong>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function GuidePageFooter() {
  return (
    <footer className="guide-footer">
      <div className="guide-footer__brand">
        <span>MB-01</span>
        <div>
          <strong>HECS Debt Calculator</strong>
          <small>Built by All That&apos;s Next</small>
        </div>
      </div>

      <p>Educational information only · Not financial advice</p>

      <Link href="/#calculator">
        <Calculator size={15} aria-hidden="true" />
        Open calculator
      </Link>
    </footer>
  );
}
