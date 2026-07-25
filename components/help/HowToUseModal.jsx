import { useEffect, useRef } from 'react';
import { ListChecks, X } from 'lucide-react';

const steps = [
  ['Enter your starting point', 'Add your current HELP debt and repayment income. Repayment income can be different from salary, so use your best annual estimate.'],
  ['Set the assumptions', 'Adjust income growth, indexation, first working year and age only if you have a better planning assumption.'],
  ['Read the baseline result', 'Start with the estimated payoff year, total repaid, indexation and compulsory repayment before adding extra complexity.'],
  ['Test real-life changes', 'Use What could change? to add an extra repayment, promotion, career break or pay reduction.'],
  ['Inspect the path', 'Compare the timeline, then open the year-by-year breakdown when you want the annual detail.'],
  ['Check the evidence', 'Read the method, assumptions and official sources before using the estimate to support a decision.'],
];

export default function HowToUseModal({ open, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[var(--mb-ink)]/72 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="mx-auto my-4 w-full max-w-xl rounded-[30px] border border-black/15 bg-[var(--mb-cream)] p-5 shadow-2xl sm:my-10 sm:p-7" role="dialog" aria-modal="true" aria-labelledby="how-to-title">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--mb-sky)]/15 text-[var(--mb-sky)]">
              <ListChecks size={20} aria-hidden="true" />
            </span>
            <div>
              <p className="font-impact text-[9px] uppercase tracking-[0.12em] text-[var(--mb-sky-deep)]">Six simple steps</p>
              <h2 id="how-to-title" className="mt-1 font-anybody text-2xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">How to use the calculator</h2>
            </div>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-black/15 bg-white text-[var(--mb-ink)] transition hover:bg-[var(--mb-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)]" aria-label="Close instructions">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <ol className="mt-6 space-y-3">
          {steps.map(([title, copy], index) => (
            <li key={title} className="flex gap-3 rounded-2xl border border-black/10 bg-[var(--mb-paper)] p-4">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[var(--mb-ink)] font-mono text-xs font-bold text-white">{index + 1}</span>
              <div>
                <h3 className="font-impact text-[10px] uppercase tracking-[0.08em] text-[var(--mb-ink)]">{title}</h3>
                <p className="mt-1 font-instrument text-sm leading-relaxed text-[var(--mb-muted)]">{copy}</p>
              </div>
            </li>
          ))}
        </ol>

        <button type="button" onClick={onClose} className="mt-6 w-full rounded-2xl bg-[var(--mb-ink)] px-5 py-4 font-impact text-[10px] uppercase tracking-[0.1em] text-white transition hover:bg-[var(--mb-mint-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)]">
          Start planning
        </button>
      </div>
    </div>
  );
}
