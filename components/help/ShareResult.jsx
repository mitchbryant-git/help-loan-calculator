import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Share2, X } from 'lucide-react';

import { FINANCIAL_YEAR, formatCurrency } from '../../lib/hecsRates';
import { buildShareUrl } from '../../lib/help/share-plan.mjs';

const SCENARIO_TYPES = {
  promotion: { colour: '#F8D018', symbol: '↑' },
  voluntary: { colour: '#08D8B8', symbol: '$' },
  break: { colour: '#0068D8', symbol: 'II' },
  reduction: { colour: '#F84878', symbol: '↓' },
};

function scenarioLabels(events) {
  return [
    ...events.promotions.map((event, index) => ({
      id: `promotion-${event.year}-${index}`,
      kind: 'promotion',
      label: `Income +${event.percent}% in ${event.year}`,
    })),
    ...events.voluntary.map((event, index) => ({
      id: `voluntary-${event.year}-${index}`,
      kind: 'voluntary',
      label: `${formatCurrency(event.amount)} extra in ${event.year}`,
    })),
    ...events.breaks.map((event, index) => ({
      id: `break-${event.startYear}-${index}`,
      kind: 'break',
      label: `${event.duration}-year break from ${event.startYear}`,
    })),
    ...events.reductions.map((event, index) => ({
      id: `reduction-${event.year}-${index}`,
      kind: 'reduction',
      label: `Income −${event.percent}% in ${event.year}`,
    })),
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
  const scenarios = scenarioLabels(events);
  const handleClose = useCallback(() => {
    setStatus('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleClose, open]);

  if (!open) return null;

  const url = buildShareUrl(inputs, events);
  const payoffLength = isDebtFree ? `${timelineData.length} years` : '50+ years';

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My HECS debt estimate',
          text: isDebtFree ? `My estimated HECS debt payoff year is ${finalYear}.` : 'See my HECS debt projection.',
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
        backgroundColor: '#fff9f2',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('Image export failed');

      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = 'my-hecs-debt-estimate.png';
      anchor.click();
      URL.revokeObjectURL(objectUrl);
      setStatus('Image saved');
    } catch {
      setStatus('Could not save image');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="share-modal"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <div className="share-centre" role="dialog" aria-modal="true" aria-labelledby="share-result-title">
        <header className="share-centre__header">
          <div className="share-centre__heading">
            <span className="share-centre__number" aria-hidden="true">EX</span>
            <div>
              <p>MB-01 export module</p>
              <h2 id="share-result-title">Share your HECS debt estimate</h2>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="share-centre__close"
            aria-label="Close share centre"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="share-centre__body">
          <p className="share-centre__intro">
            Send someone a live, editable calculator link or save this result card as an image.
          </p>

          <div ref={cardRef} className="share-pass">
            <div className="share-pass__system-bar">
              <span>MB-01 // HECS // RESULT FILE</span>
              <span><i /> Projection generated</span>
            </div>

            <div className="share-pass__hero">
              <div>
                <p>Estimated loan payoff</p>
                <strong>{payoffLength}</strong>
                <span>
                  {isDebtFree
                    ? `Debt-free in ${finalYear}, around age ${finalAge}.`
                    : 'Balance remains after the 50-year projection.'}
                </span>
              </div>
              <div className="share-pass__year">
                <span>Target year</span>
                <strong>{isDebtFree ? finalYear : '50+'}</strong>
              </div>
            </div>

            <dl className="share-pass__metrics">
              {[
                ['Starting debt', formatCurrency(inputs.startingDebt), 'sky'],
                ['Repayment income', formatCurrency(inputs.startingIncome), 'yellow'],
                ['Total repaid', formatCurrency(totalPaid), 'mint'],
                ['Indexation added', formatCurrency(totalIndexation), 'pink'],
              ].map(([label, value, tone]) => (
                <div key={label} className={`share-pass__metric share-pass__metric--${tone}`}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            {scenarios.length ? (
              <div className="share-pass__scenarios">
                <p>Optional events included</p>
                <ul>
                  {scenarios.map((scenario) => {
                    const config = SCENARIO_TYPES[scenario.kind];
                    return (
                      <li key={scenario.id} style={{ '--scenario-colour': config.colour }}>
                        <i>{config.symbol}</i>
                        {scenario.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : (
              <div className="share-pass__baseline">
                <span>Baseline projection</span>
                No optional life events included
              </div>
            )}

            <div className="share-pass__footer">
              <span>{FINANCIAL_YEAR} settings</span>
              <span>Educational estimate only</span>
              <strong>allthatsnext.com/hecs-debt-calculator</strong>
            </div>

            <div className="share-pass__stripes" aria-hidden="true">
              <i /><i /><i /><i />
            </div>
          </div>

          <div className="share-centre__actions">
            <button type="button" onClick={handleShare} className="share-action share-action--mint">
              <Share2 size={18} aria-hidden="true" />
              <span><small>Send it</small>Share result</span>
            </button>
            <button type="button" onClick={handleCopy} className="share-action share-action--yellow">
              <Copy size={18} aria-hidden="true" />
              <span><small>Keep it live</small>Copy link</span>
            </button>
            <button type="button" onClick={handleSave} disabled={isSaving} className="share-action share-action--sky">
              <Download size={18} aria-hidden="true" />
              <span><small>Make it visual</small>{isSaving ? 'Saving…' : 'Save image'}</span>
            </button>
          </div>

          <p className="share-centre__status" role="status" aria-live="polite">
            {status ? (
              <span><Check size={15} aria-hidden="true" />{status}</span>
            ) : (
              'Anyone with the link can see the figures and optional events included in this plan.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
