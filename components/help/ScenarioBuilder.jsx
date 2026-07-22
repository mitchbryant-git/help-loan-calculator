import {
  BriefcaseBusiness,
  ChevronDown,
  CircleDollarSign,
  PauseCircle,
  Plus,
  Sparkles,
  Trash2,
  TrendingDown,
} from 'lucide-react';
import { useId } from 'react';

import { formatCurrency } from '../../lib/hecsRates';

const PANELS = {
  voluntary: {
    title: 'Extra repayment',
    description: 'Test what happens if you pay an extra amount before indexation.',
    icon: CircleDollarSign,
    colour: 'var(--mb-mint-deep)',
  },
  promotion: {
    title: 'Promotion or pay rise',
    description: 'Add a larger one-off income increase in a future year.',
    icon: BriefcaseBusiness,
    colour: 'var(--mb-yellow)',
  },
  break: {
    title: 'Career break',
    description: 'Model travel, caregiving or another period without income.',
    icon: PauseCircle,
    colour: 'var(--mb-sky)',
  },
  reduction: {
    title: 'Pay reduction',
    description: 'Test part-time work, a career change or another income drop.',
    icon: TrendingDown,
    colour: 'var(--mb-pink)',
  },
};

function CompactField({ label, value, onChange, suffix, width = 'flex-1' }) {
  const id = useId();

  return (
    <div className={width}>
      <label htmlFor={id} className="mb-1.5 block font-instrument text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--mb-muted)]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-black/20 bg-white px-3 py-3 pr-8 font-mono text-sm font-bold text-[var(--mb-ink)] outline-none transition focus:border-[var(--mb-mint-deep)] focus:ring-4 focus:ring-[var(--mb-mint)]/15"
        />
        {suffix ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--mb-muted)]">{suffix}</span> : null}
      </div>
    </div>
  );
}

function ScenarioPanel({ kind, count, children }) {
  const panel = PANELS[kind];
  const Icon = panel.icon;

  return (
    <details className="group rounded-2xl border border-black/15 bg-white/55">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:hidden">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--panel-colour)]/15" style={{ '--panel-colour': panel.colour }}>
          <Icon size={19} style={{ color: panel.colour }} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-anybody text-sm font-bold text-[var(--mb-ink)]">{panel.title}</span>
          <span className="mt-0.5 block font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">{panel.description}</span>
        </span>
        {count > 0 ? (
          <span className="rounded-full bg-[var(--mb-ink)] px-2.5 py-1 font-mono text-[10px] font-bold text-white">{count}</span>
        ) : null}
        <ChevronDown size={18} className="shrink-0 text-[var(--mb-muted)] transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-black/10 p-4">{children}</div>
    </details>
  );
}

function AddButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[42px] items-center justify-center gap-1.5 self-end rounded-xl bg-[var(--mb-ink)] px-4 font-impact text-[10px] uppercase tracking-[0.1em] text-white transition hover:-translate-y-0.5 hover:bg-[var(--mb-mint-deep)] focus:outline-none focus:ring-4 focus:ring-[var(--mb-mint)]/25"
    >
      <Plus size={15} /> Add
    </button>
  );
}

function ItemList({ items, renderItem, onRemove }) {
  if (items.length === 0) return null;

  return (
    <ul className="mt-4 space-y-2">
      {items.map((item, index) => (
        <li key={`${JSON.stringify(item)}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-black/10 bg-[var(--mb-cream)] px-3 py-2.5">
          <span className="font-instrument text-xs font-semibold text-[var(--mb-ink)]">{renderItem(item)}</span>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="rounded-lg p-2 text-[var(--mb-muted)] transition hover:bg-[var(--mb-pink)]/10 hover:text-[var(--mb-pink)]"
            aria-label="Remove scenario"
          >
            <Trash2 size={15} />
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function ScenarioBuilder({
  voluntary,
  promotion,
  careerBreak,
  reduction,
}) {
  return (
    <section className="rounded-[28px] border border-black/15 bg-[var(--mb-paper)] p-5 shadow-[0_16px_40px_rgba(16,24,32,0.10)] sm:p-6" aria-labelledby="scenario-builder-title">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 rounded-2xl bg-[var(--mb-yellow)]/25 p-3 text-[var(--mb-ink)]">
          <Sparkles size={19} />
        </span>
        <div>
          <p className="font-impact text-[10px] uppercase tracking-[0.14em] text-[var(--mb-muted)]">Optional</p>
          <h2 id="scenario-builder-title" className="mt-1 font-anybody text-xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">What could change?</h2>
          <p className="mt-1 font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">Add only the life events you want to test. Your original path remains available for comparison.</p>
        </div>
      </div>

      <div className="space-y-3">
        <ScenarioPanel kind="voluntary" count={voluntary.items.length}>
          <div className="flex items-end gap-2">
            <CompactField label="Year" value={voluntary.temp.year} onChange={(year) => voluntary.setTemp({ ...voluntary.temp, year })} width="w-24" />
            <CompactField label="Amount" value={voluntary.temp.amount} onChange={(amount) => voluntary.setTemp({ ...voluntary.temp, amount })} suffix="$" />
            <AddButton onClick={() => voluntary.add()} />
          </div>
          <ItemList items={voluntary.items} renderItem={(item) => `${formatCurrency(item.amount)} in ${item.year}`} onRemove={voluntary.remove} />
        </ScenarioPanel>

        <ScenarioPanel kind="promotion" count={promotion.items.length}>
          <div className="flex items-end gap-2">
            <CompactField label="Year" value={promotion.temp.year} onChange={(year) => promotion.setTemp({ ...promotion.temp, year })} width="w-24" />
            <CompactField label="Increase" value={promotion.temp.percent} onChange={(percent) => promotion.setTemp({ ...promotion.temp, percent })} suffix="%" />
            <AddButton onClick={() => promotion.add()} />
          </div>
          <ItemList items={promotion.items} renderItem={(item) => `+${item.percent}% income in ${item.year}`} onRemove={promotion.remove} />
        </ScenarioPanel>

        <ScenarioPanel kind="break" count={careerBreak.items.length}>
          <div className="flex items-end gap-2">
            <CompactField label="Start" value={careerBreak.temp.startYear} onChange={(startYear) => careerBreak.setTemp({ ...careerBreak.temp, startYear })} width="w-24" />
            <CompactField label="Duration" value={careerBreak.temp.duration} onChange={(duration) => careerBreak.setTemp({ ...careerBreak.temp, duration })} suffix="yrs" />
            <AddButton onClick={() => careerBreak.add()} />
          </div>
          <ItemList items={careerBreak.items} renderItem={(item) => `${item.duration} ${Number(item.duration) === 1 ? 'year' : 'years'} from ${item.startYear}`} onRemove={careerBreak.remove} />
        </ScenarioPanel>

        <ScenarioPanel kind="reduction" count={reduction.items.length}>
          <div className="flex items-end gap-2">
            <CompactField label="Year" value={reduction.temp.year} onChange={(year) => reduction.setTemp({ ...reduction.temp, year })} width="w-24" />
            <CompactField label="Decrease" value={reduction.temp.percent} onChange={(percent) => reduction.setTemp({ ...reduction.temp, percent })} suffix="%" />
            <AddButton onClick={() => reduction.add()} />
          </div>
          <ItemList items={reduction.items} renderItem={(item) => `-${item.percent}% income in ${item.year}`} onRemove={reduction.remove} />
        </ScenarioPanel>
      </div>
    </section>
  );
}
