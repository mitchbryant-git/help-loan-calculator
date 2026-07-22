import { ChevronDown, Info, SlidersHorizontal } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';

import { CURRENT_INDEXATION_TOOLTIP } from '../../lib/hecsRates';

function InfoHint({ text, label }) {
  return (
    <details className="group relative ml-1.5 inline-block">
      <summary
        className="flex h-4 w-4 cursor-pointer list-none items-center justify-center rounded-full border border-[var(--mb-sky)] text-[var(--mb-sky)] marker:hidden"
        aria-label={`About ${label}`}
      >
        <Info size={10} strokeWidth={2.5} />
      </summary>
      <div className="absolute left-1/2 top-6 z-30 w-64 -translate-x-1/2 rounded-xl bg-[var(--mb-ink)] p-3 font-instrument text-xs font-normal normal-case leading-relaxed tracking-normal text-white shadow-xl sm:left-0 sm:translate-x-0">
        {text}
      </div>
    </details>
  );
}

function NumberField({ label, value, onChange, suffix, help, nudge }) {
  const id = useId();

  return (
    <div>
      <div className="mb-2 flex items-center">
        <label htmlFor={id} className="font-instrument text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--mb-muted)]">
          {label}
        </label>
        {help ? <InfoHint text={help} label={label} /> : null}
      </div>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue === '' ? '' : Number(nextValue));
          }}
          className="w-full rounded-2xl border border-black/20 bg-white px-4 py-3.5 pr-10 font-mono text-lg font-bold text-[var(--mb-ink)] outline-none transition focus:border-[var(--mb-mint-deep)] focus:ring-4 focus:ring-[var(--mb-mint)]/20"
        />
        {suffix ? (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-instrument text-sm font-bold text-[var(--mb-muted)]">
            {suffix}
          </span>
        ) : null}
      </div>
      {nudge ? (
        <p className={`mt-2 rounded-xl border p-3 font-instrument text-xs leading-relaxed ${nudge.type === 'info' ? 'border-[var(--mb-sky)]/25 bg-[var(--mb-sky)]/8 text-[var(--mb-ink)]' : 'border-[var(--mb-pink)]/25 bg-[var(--mb-pink)]/8 text-[var(--mb-ink)]'}`}>
          {nudge.msg}
        </p>
      ) : null}
    </div>
  );
}

function AssumptionSlider({ label, value, onChange, help, colour }) {
  const id = useId();
  const [localValue, setLocalValue] = useState(value);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => () => clearTimeout(debounceTimer.current), []);

  const updateValue = (nextValue) => {
    setLocalValue(nextValue);
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => onChange(nextValue), 120);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center">
          <label htmlFor={id} className="font-instrument text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--mb-muted)]">
            {label}
          </label>
          <InfoHint text={help} label={label} />
        </div>
        <output htmlFor={id} className="font-mono text-lg font-bold text-[var(--mb-ink)]">{localValue}%</output>
      </div>
      <input
        id={id}
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={localValue}
        onChange={(event) => updateValue(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-black/10 accent-[var(--slider-colour)]"
        style={{ '--slider-colour': colour }}
      />
    </div>
  );
}

export default function PlannerSetup({ inputs, onInputChange, nudge }) {
  return (
    <section
      className="rounded-[28px] border border-black/15 bg-[var(--mb-paper)] p-5 shadow-[0_16px_40px_rgba(16,24,32,0.10)] sm:p-6"
      aria-labelledby="planner-setup-title"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-impact text-[10px] uppercase tracking-[0.14em] text-[var(--mb-mint-deep)]">Start here</p>
          <h2 id="planner-setup-title" className="mt-1 font-anybody text-2xl font-extrabold tracking-[-0.035em] text-[var(--mb-ink)]">
            Plan your HELP debt
          </h2>
        </div>
        <div className="rounded-2xl bg-[var(--mb-mint)]/18 p-3 text-[var(--mb-mint-deep)]">
          <SlidersHorizontal size={20} />
        </div>
      </div>

      <div className="grid gap-5">
        <NumberField
          label="HELP debt balance"
          value={inputs.startingDebt}
          onChange={(value) => onInputChange('startingDebt', value)}
          suffix="$"
          nudge={nudge?.field === 'startingDebt' ? nudge : null}
          help="The HELP debt balance you expect to have when this plan begins."
        />
        <NumberField
          label="Repayment income"
          value={inputs.startingIncome}
          onChange={(value) => onInputChange('startingIncome', value)}
          suffix="$"
          nudge={nudge?.field === 'startingIncome' ? nudge : null}
          help="Repayment income is broader than salary. It can include taxable income, reportable fringe benefits, net investment losses and reportable super contributions."
        />
      </div>

      <details className="group mt-6 border-t border-black/15 pt-5" open>
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 marker:hidden">
          <div>
            <p className="font-impact text-[10px] uppercase tracking-[0.12em] text-[var(--mb-muted)]">Planning assumptions</p>
            <p className="mt-1 font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">Adjust these if you have a better estimate.</p>
          </div>
          <ChevronDown size={20} className="text-[var(--mb-ink)] transition-transform group-open:rotate-180" />
        </summary>

        <div className="mt-6 grid gap-6">
          <AssumptionSlider
            label="Annual income growth"
            value={inputs.wageGrowth}
            onChange={(value) => onInputChange('wageGrowth', value)}
            colour="var(--mb-mint-deep)"
            help="Average yearly increase across the life of the loan. Use promotions below for larger one-off jumps."
          />
          <AssumptionSlider
            label="Annual indexation"
            value={inputs.indexationRate}
            onChange={(value) => onInputChange('indexationRate', value)}
            colour="var(--mb-sky)"
            help={CURRENT_INDEXATION_TOOLTIP}
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberField
              label="First working year"
              value={inputs.firstYear}
              onChange={(value) => onInputChange('firstYear', value)}
              help="The first year represented in your plan after finishing study."
            />
            <NumberField
              label="Age that year"
              value={inputs.startingAge}
              onChange={(value) => onInputChange('startingAge', value)}
              help="Your age in the first working year so the result can estimate your payoff age."
            />
          </div>
        </div>
      </details>
    </section>
  );
}
