import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Share2, X } from 'lucide-react';

import { FINANCIAL_YEAR, formatCurrency } from '../../lib/hecsRates';

function buildShareUrl(inputs, events) {
  const params = new URLSearchParams();
  params.set('d', String(inputs.startingDebt));
  params.set('i', String(inputs.startingIncome));
  params.set('g', String(inputs.wageGrowth));
  params.set('x', String(inputs.indexationRate));
  params.set('y', String(inputs.firstYear));
  params.set('a', String(inputs.startingAge));

  const encodedEvents = [
    ...events.promotions.map((event) => ({ t: 'p', y: Number(event.year), pct: Number(event.percent) })),
    ...events.voluntary.map((event) => ({ t: 'v', y: Number(event.year), amt: Number(event.amount) })),
    ...events.breaks.map((event) => ({ t: 'b', sy: Number(event.startYear), d: Number(event.duration) })),
    ...events.reductions.map((event) => ({ t: 'r', y: Number(event.year), pct: Number(event.percent) })),
  ];

  if (encodedEvents.length) params.set('e', JSON.stringify(encodedEvents));
  return `https://helploancalculator.com/?${params.toString()}`;
}

function eventLabels(events) {
  return [
    ...events.promotions.map((event) => `Income +${event.percent}% in ${event.year}`),
    ...events.voluntary.map((event) => `${formatCurrency(event.amount)} extra in ${event.year}`),
    ...events.breaks.map((event) => `${event.duration}-year break from ${event.startYear}`),
    ...events.reductions.map((event) => `Income −${event.percent}% in ${event.year}`),
  ];
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

export default function ShareResult({
  open,
  onClose,
  inputs,
  promotions,
  voluntary,
  breaks,
  reductions,
  timelineData,
  totalPaid,
  totalIndexation,
  isDebtFree,
  finalYear,
  finalAge,
}) {
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const cardRef = useRef(null);
  const closeButtonRef = useRef(null);
  const events = { promotions, voluntary, breaks, reductions };
  const labels = eventLabels(events);

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

  const url = buildShareUrl(inputs, events);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My HELP loan estimate',
          text: isDebtFree ? `My estimated HELP payoff year is ${finalYear}.` : 'See my HELP loan projection.',
          url,
        });
        setStatus('Shared');
      } else {
        await copyText(url);
        setStatus('Link copied');
      }
    } catch (error) {
      if (error?.name !== 'AbortError') setStatus('Could not share');
    }
  };

  const handleCopy = async () => {
    try {
      await copyText(url);
      setStatus('Link copied');
    } catch {
      setStatus('Could not copy');
    }
  };

  const handleSave = async () => {
    if (!cardRef.current || isSaving) return;
    setIsSaving(true);
    setStatus('');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#fffaf1',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const objectUrl = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = 'my-help-loan-estimate.png';
        anchor.click();
        URL.revokeObjectURL(objectUrl);
        setStatus('Image saved');
      }, 'image/png');
    } catch {
      setStatus('Could not save image');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-[var(--mb-ink)]/72 p-3 backdrop-blur-sm sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="mx-auto my-3 w-full max-w-lg rounded-[30px] border border-white/15 bg-[var(--mb-cream)] p-4 shadow-2xl sm:my-8 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="share-result-title">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-impact text-[9px] uppercase tracking-[0.12em] text-[var(--mb-mint-deep)]">Keep or send your plan</p>
            <h2 id="share-result-title" className="mt-1 font-anybody text-2xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">Share your HELP estimate</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-black/15 bg-white text-[var(--mb-ink)] transition hover:bg-[var(--mb-paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)]" aria-label="Close share window">
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div ref={cardRef} className="overflow-hidden rounded-[26px] border border-black/15 bg-[var(--mb-paper)] shadow-[0_16px_38px_rgba(16,24,32,0.12)]">
          <div className="border-b border-black/10 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <span className="font-impact text-[10px] uppercase tracking-[0.12em] text-[var(--mb-ink)]">MB-01 · HELP module</span>
              <span className="rounded-full bg-[var(--mb-mint)]/20 px-3 py-1 font-impact text-[8px] uppercase tracking-[0.1em] text-[var(--mb-mint-deep)]">{FINANCIAL_YEAR}</span>
            </div>
            <p className="mt-7 font-instrument text-xs font-bold uppercase tracking-[0.12em] text-[var(--mb-muted)]">Estimated payoff</p>
            <p className="mt-1 font-anybody text-5xl font-extrabold leading-none tracking-[-0.06em] text-[var(--mb-ink)]">
              {isDebtFree ? `${timelineData.length} years` : '50+ years'}
            </p>
            <p className="mt-3 font-instrument text-sm text-[var(--mb-muted)]">
              {isDebtFree ? `Debt-free in ${finalYear}, around age ${finalAge}.` : 'The model does not clear the balance within 50 years.'}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-white/10">
            <div className="bg-[var(--mb-readout)] p-5 text-white">
              <dt className="font-impact text-[8px] uppercase tracking-[0.1em] text-white/45">Starting debt</dt>
              <dd className="mt-2 font-mono text-xl font-bold">{formatCurrency(inputs.startingDebt)}</dd>
            </div>
            <div className="bg-[var(--mb-readout)] p-5 text-white">
              <dt className="font-impact text-[8px] uppercase tracking-[0.1em] text-white/45">Repayment income</dt>
              <dd className="mt-2 font-mono text-xl font-bold text-[var(--mb-sky)]">{formatCurrency(inputs.startingIncome)}</dd>
            </div>
            <div className="bg-[var(--mb-readout)] p-5 text-white">
              <dt className="font-impact text-[8px] uppercase tracking-[0.1em] text-white/45">Total repaid</dt>
              <dd className="mt-2 font-mono text-xl font-bold text-[var(--mb-mint)]">{formatCurrency(totalPaid)}</dd>
            </div>
            <div className="bg-[var(--mb-readout)] p-5 text-white">
              <dt className="font-impact text-[8px] uppercase tracking-[0.1em] text-white/45">Indexation added</dt>
              <dd className="mt-2 font-mono text-xl font-bold text-[var(--mb-pink)]">{formatCurrency(totalIndexation)}</dd>
            </div>
          </dl>

          {labels.length ? (
            <div className="border-t border-black/10 p-5">
              <p className="font-impact text-[8px] uppercase tracking-[0.1em] text-[var(--mb-muted)]">Scenarios included</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {labels.map((label) => <li key={label} className="rounded-full border border-black/10 bg-[var(--mb-cream)] px-3 py-1.5 font-instrument text-[10px] font-semibold text-[var(--mb-ink)]">{label}</li>)}
              </ul>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 border-t border-black/10 px-5 py-4 font-instrument text-[10px] text-[var(--mb-muted)]">
            <span>Educational estimate</span>
            <strong className="text-[var(--mb-ink)]">helploancalculator.com</strong>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button type="button" onClick={handleShare} className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-[var(--mb-ink)] px-4 py-3.5 font-impact text-[10px] uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--mb-mint-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)] sm:col-span-1">
            <Share2 size={16} aria-hidden="true" /> Share
          </button>
          <button type="button" onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-4 py-3.5 font-impact text-[10px] uppercase tracking-[0.1em] text-[var(--mb-ink)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)]">
            <Copy size={16} aria-hidden="true" /> Copy link
          </button>
          <button type="button" onClick={handleSave} disabled={isSaving} className="flex items-center justify-center gap-2 rounded-2xl border border-black/15 bg-white px-4 py-3.5 font-impact text-[10px] uppercase tracking-[0.1em] text-[var(--mb-ink)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)] disabled:cursor-wait disabled:opacity-55">
            <Download size={16} aria-hidden="true" /> {isSaving ? 'Saving…' : 'Save image'}
          </button>
        </div>

        <p className="mt-3 min-h-5 text-center font-instrument text-xs font-semibold text-[var(--mb-mint-deep)]" role="status" aria-live="polite">
          {status ? <span className="inline-flex items-center gap-1.5"><Check size={14} aria-hidden="true" />{status}</span> : null}
        </p>
      </div>
    </div>
  );
}
