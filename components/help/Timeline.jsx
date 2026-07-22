import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { formatCurrency } from '../../lib/hecsRates';

const TimelineChart = dynamic(
  async () => {
    const {
      Area,
      AreaChart,
      CartesianGrid,
      ReferenceArea,
      ResponsiveContainer,
      Tooltip,
      XAxis,
      YAxis,
    } = await import('recharts');

    function ChartTooltip({ active, payload }) {
      if (!active || !payload?.length) return null;
      const row = payload[0].payload;
      const repayment = (row.compulsory || 0) + (row.voluntary || 0);

      return (
        <div className="min-w-48 rounded-xl border border-white/15 bg-[var(--mb-ink)]/95 p-3 font-instrument text-xs text-white shadow-2xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between gap-5">
            <strong className="font-mono text-sm">{row.year}</strong>
            {row.age ? <span className="text-white/55">Age {row.age}</span> : null}
          </div>
          <dl className="space-y-1.5">
            <div className="flex justify-between gap-6"><dt className="text-white/55">Balance</dt><dd className="font-mono font-bold text-[var(--mb-mint)]">{formatCurrency(row.endBalance)}</dd></div>
            {row.baseBalance !== undefined ? <div className="flex justify-between gap-6"><dt className="text-white/55">Original path</dt><dd className="font-mono font-bold text-white/80">{formatCurrency(row.baseBalance)}</dd></div> : null}
            <div className="flex justify-between gap-6"><dt className="text-white/55">Income</dt><dd className="font-mono font-bold">{formatCurrency(row.taxableIncome || 0)}</dd></div>
            <div className="flex justify-between gap-6"><dt className="text-white/55">Repayment</dt><dd className="font-mono font-bold text-[var(--mb-sky)]">{formatCurrency(repayment)}</dd></div>
          </dl>
        </div>
      );
    }

    function Chart({ data, breaks, hasLifeEvents }) {
      return (
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={260}
          initialDimension={{ width: 640, height: 300 }}
        >
          <AreaChart data={data} margin={{ top: 18, right: 8, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="helpBalanceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#19E6C1" stopOpacity={0.32} />
                <stop offset="95%" stopColor="#19E6C1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.09)" strokeDasharray="3 5" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.58)' }} tickLine={false} axisLine={false} minTickGap={28} />
            <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.58)' }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Math.round(value / 1000)}k`} width={48} />
            <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#19E6C1', strokeWidth: 1.5 }} />

            {hasLifeEvents ? (
              <Area
                type="monotone"
                dataKey="baseBalance"
                stroke="rgba(255,255,255,0.52)"
                strokeWidth={2}
                strokeDasharray="6 5"
                fill="transparent"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            ) : null}

            <Area
              type="monotone"
              dataKey="endBalance"
              stroke="#19E6C1"
              strokeWidth={3}
              fill="url(#helpBalanceFill)"
              dot={false}
              activeDot={{ r: 5, fill: '#101820', stroke: '#19E6C1', strokeWidth: 3 }}
              isAnimationActive={false}
            />

            {breaks.map((careerBreak, index) => (
              <ReferenceArea
                key={`${careerBreak.startYear}-${index}`}
                x1={Number(careerBreak.startYear)}
                x2={Number(careerBreak.startYear) + Number(careerBreak.duration)}
                fill="#008CFF"
                fillOpacity={0.08}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return { default: Chart };
  },
  {
    ssr: false,
    loading: () => <div className="h-[300px] w-full animate-pulse rounded-2xl bg-white/5" />,
  },
);

export default function Timeline({ timelineData, baseTimelineData, breaks, hasLifeEvents }) {
  const data = useMemo(() => {
    if (!hasLifeEvents || baseTimelineData.length === 0) return timelineData;

    const activeRows = new Map(timelineData.map((row) => [row.year, row]));
    const baselineRows = new Map(baseTimelineData.map((row) => [row.year, row]));
    const years = [...new Set([...activeRows.keys(), ...baselineRows.keys()])].sort((a, b) => a - b);

    return years.map((year) => {
      const active = activeRows.get(year);
      const baseline = baselineRows.get(year);
      if (active) return { ...active, baseBalance: baseline?.endBalance ?? 0 };
      return {
        year,
        age: baseline?.age,
        taxableIncome: baseline?.taxableIncome ?? 0,
        compulsory: 0,
        voluntary: 0,
        endBalance: 0,
        baseBalance: baseline?.endBalance ?? 0,
      };
    });
  }, [timelineData, baseTimelineData, hasLifeEvents]);

  if (!timelineData.length) return null;

  const finalRow = timelineData[timelineData.length - 1];
  const finalRepayment = (finalRow.compulsory || 0) + (finalRow.voluntary || 0);
  const yearDifference = hasLifeEvents ? baseTimelineData.length - timelineData.length : 0;
  const baselineRepaid = baseTimelineData.reduce((sum, row) => sum + row.compulsory + row.voluntary, 0);
  const scenarioRepaid = timelineData.reduce((sum, row) => sum + row.compulsory + row.voluntary, 0);
  const repaymentDifference = baselineRepaid - scenarioRepaid;

  return (
    <section className="overflow-hidden rounded-[28px] border border-black/15 bg-[var(--mb-paper)] shadow-[0_16px_40px_rgba(16,24,32,0.10)]" aria-labelledby="timeline-title">
      <div className="flex flex-wrap items-start justify-between gap-3 p-5 sm:p-6">
        <div>
          <p className="font-impact text-[10px] uppercase tracking-[0.14em] text-[var(--mb-mint-deep)]">Your path over time</p>
          <h2 id="timeline-title" className="mt-1 font-anybody text-xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">Repayment timeline</h2>
        </div>
        <span className="rounded-full border border-black/15 bg-[var(--mb-cream)] px-3 py-1.5 font-impact text-[9px] uppercase tracking-[0.1em] text-[var(--mb-muted)]">Ends {finalRow.year}</span>
      </div>

      <div className="bg-[var(--mb-readout)] p-4 sm:p-6">
        <dl className="mb-4 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-4">
          {[
            ['Final year', finalRow.year, 'text-white'],
            ['Age', finalRow.age ?? '—', 'text-white'],
            ['Final repayment', formatCurrency(finalRepayment), 'text-[var(--mb-sky)]'],
            ['Balance', formatCurrency(finalRow.endBalance), 'text-[var(--mb-mint)]'],
          ].map(([label, value, colour]) => (
            <div key={label} className="bg-[var(--mb-readout)] p-3.5">
              <dt className="font-impact text-[9px] uppercase tracking-[0.1em] text-white/45">{label}</dt>
              <dd className={`mt-1 font-mono text-sm font-bold sm:text-base ${colour}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <div className="h-[300px] min-w-0">
          <TimelineChart data={data} breaks={breaks} hasLifeEvents={hasLifeEvents} />
        </div>

        {hasLifeEvents ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 font-instrument text-xs text-white/65">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><i className="h-0.5 w-5 bg-[var(--mb-mint)]" /> With life events</span>
              <span className="flex items-center gap-1.5"><i className="w-5 border-t-2 border-dashed border-white/50" /> Original path</span>
            </div>
            {yearDifference !== 0 || repaymentDifference !== 0 ? (
              <strong className="text-white">
                {yearDifference > 0 ? `${yearDifference} years sooner` : yearDifference < 0 ? `${Math.abs(yearDifference)} years later` : 'Same payoff year'} · {repaymentDifference >= 0 ? `${formatCurrency(repaymentDifference)} less repaid` : `${formatCurrency(Math.abs(repaymentDifference))} more repaid`}
              </strong>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
