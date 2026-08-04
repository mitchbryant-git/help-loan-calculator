import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

import { formatCurrency } from '../../lib/hecsRates';

const EVENT_TYPES = {
  voluntary: {
    label: 'Extra repayment',
    colour: '#19E6C1',
    symbol: '$',
  },
  promotion: {
    label: 'Promotion or pay rise',
    colour: '#FFD21C',
    symbol: '↑',
  },
  break: {
    label: 'Career break',
    colour: '#008CFF',
    symbol: 'II',
  },
  reduction: {
    label: 'Pay reduction',
    colour: '#F53678',
    symbol: '↓',
  },
};

function repaymentFor(row) {
  return (row?.compulsory || 0) + (row?.voluntary || 0);
}

function eventDescription(kind, event) {
  if (kind === 'voluntary') return `${formatCurrency(event.amount)} extra repayment`;
  if (kind === 'promotion') return `Income increased ${event.percent}%`;
  if (kind === 'break') {
    const duration = Number(event.duration);
    return `${duration} ${duration === 1 ? 'year' : 'years'} away from work`;
  }
  return `Income reduced ${event.percent}%`;
}

const TimelineChart = dynamic(
  async () => {
    const {
      Area,
      AreaChart,
      CartesianGrid,
      ReferenceArea,
      ReferenceDot,
      ReferenceLine,
      ResponsiveContainer,
      Tooltip,
      XAxis,
      YAxis,
    } = await import('recharts');

    function ChartTooltip({ active, payload }) {
      if (!active || !payload?.length) return null;
      const row = payload[0].payload;

      return (
        <div className="timeline-tooltip">
          <div className="timeline-tooltip__heading">
            <span>Projection year</span>
            <strong>{row.year}</strong>
            {row.age ? <i>Age {row.age}</i> : null}
          </div>

          <dl className="timeline-tooltip__metrics">
            <div>
              <dt>Balance</dt>
              <dd>{formatCurrency(row.endBalance)}</dd>
            </div>
            {row.baseBalance !== undefined ? (
              <div>
                <dt>Original path</dt>
                <dd>{formatCurrency(row.baseBalance)}</dd>
              </div>
            ) : null}
            <div>
              <dt>Income</dt>
              <dd>{formatCurrency(row.taxableIncome || 0)}</dd>
            </div>
            <div>
              <dt>Repaid</dt>
              <dd>{formatCurrency(repaymentFor(row))}</dd>
            </div>
          </dl>

          {row.events?.length ? (
            <ul className="timeline-tooltip__events" aria-label="Life events this year">
              {row.events.map((event) => (
                <li key={event.id} style={{ '--event-colour': event.colour }}>
                  <span>{event.symbol}</span>
                  {event.description}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      );
    }

    function EventMarker({ cx, cy, marker }) {
      if (!Number.isFinite(cx) || !Number.isFinite(cy)) return <g />;

      return (
        <g
          className="timeline-event-marker"
          transform={`translate(${cx + marker.offset}, ${cy})`}
          aria-label={`${marker.label}: ${marker.description} in ${marker.year}`}
        >
          <circle r="13" fill="#FFFaf1" stroke="#101820" strokeWidth="2" />
          <circle r="10" fill={marker.colour} stroke="#101820" strokeWidth="1" />
          <text
            x="0"
            y="0.5"
            fill="#101820"
            fontFamily="Arial, sans-serif"
            fontSize={marker.symbol.length > 1 ? 7 : 11}
            fontWeight="900"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {marker.symbol}
          </text>
        </g>
      );
    }

    function Chart({
      activeYear,
      breakBands,
      data,
      eventMarkers,
      hasLifeEvents,
      onActiveRow,
    }) {
      const activatePoint = (nextState) => {
        const index = Number(nextState?.activeTooltipIndex);
        if (Number.isInteger(index) && data[index]) onActiveRow(data[index]);
      };

      return (
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={0}
          minHeight={300}
          initialDimension={{ width: 640, height: 330 }}
        >
          <AreaChart
            data={data}
            margin={{ top: 24, right: 10, left: -10, bottom: 2 }}
            onClick={activatePoint}
            onMouseMove={activatePoint}
            onTouchMove={activatePoint}
            onTouchStart={activatePoint}
          >
            <CartesianGrid stroke="rgba(255,250,241,0.12)" strokeDasharray="3 6" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 10, fill: 'rgba(255,250,241,0.62)', fontWeight: 700 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,250,241,0.18)' }}
              minTickGap={26}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'rgba(255,250,241,0.62)', fontWeight: 700 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
              width={47}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: '#FFFaf1', strokeWidth: 1.5, strokeDasharray: '3 5' }}
              isAnimationActive={false}
              wrapperStyle={{ outline: 'none', zIndex: 20 }}
            />

            {breakBands.map((careerBreak, index) => (
              <ReferenceArea
                key={`${careerBreak.startYear}-${careerBreak.duration}-${index}`}
                x1={Number(careerBreak.startYear)}
                x2={Number(careerBreak.startYear) + Number(careerBreak.duration)}
                fill={EVENT_TYPES.break.colour}
                fillOpacity={0.12}
                stroke={EVENT_TYPES.break.colour}
                strokeOpacity={0.5}
                strokeDasharray="3 5"
              />
            ))}

            {hasLifeEvents ? (
              <Area
                type="monotone"
                dataKey="baseBalance"
                name="Original path"
                stroke="rgba(255,250,241,0.62)"
                strokeWidth={2}
                strokeDasharray="7 6"
                fill="transparent"
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            ) : null}

            <Area
              type="monotone"
              dataKey="endBalance"
              name="Current path"
              stroke="#19E6C1"
              strokeWidth={4}
              fill="#19E6C1"
              fillOpacity={0.13}
              dot={false}
              activeDot={{ r: 6, fill: '#FFFaf1', stroke: '#19E6C1', strokeWidth: 4 }}
              isAnimationActive={false}
            />

            {activeYear ? (
              <ReferenceLine
                x={activeYear}
                stroke="#FFFaf1"
                strokeWidth={1}
                strokeOpacity={0.42}
                strokeDasharray="3 6"
              />
            ) : null}

            {eventMarkers.map((marker) => (
              <ReferenceDot
                key={marker.id}
                x={marker.year}
                y={marker.balance}
                r={13}
                ifOverflow="extendDomain"
                zIndex={1000}
                shape={(props) => <EventMarker {...props} marker={marker} />}
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
    loading: () => <div className="timeline-console__loading" aria-label="Loading repayment timeline" />,
  },
);

export default function Timeline({
  timelineData,
  baseTimelineData,
  breaks,
  promotions,
  reductions,
  voluntary,
  hasLifeEvents,
}) {
  const rawEvents = useMemo(() => [
    ...voluntary.map((event, index) => ({
      ...EVENT_TYPES.voluntary,
      id: `voluntary-${event.year}-${index}`,
      kind: 'voluntary',
      year: Number(event.year),
      description: eventDescription('voluntary', event),
    })),
    ...promotions.map((event, index) => ({
      ...EVENT_TYPES.promotion,
      id: `promotion-${event.year}-${index}`,
      kind: 'promotion',
      year: Number(event.year),
      description: eventDescription('promotion', event),
    })),
    ...breaks.map((event, index) => ({
      ...EVENT_TYPES.break,
      id: `break-${event.startYear}-${index}`,
      kind: 'break',
      year: Number(event.startYear),
      description: eventDescription('break', event),
    })),
    ...reductions.map((event, index) => ({
      ...EVENT_TYPES.reduction,
      id: `reduction-${event.year}-${index}`,
      kind: 'reduction',
      year: Number(event.year),
      description: eventDescription('reduction', event),
    })),
  ], [breaks, promotions, reductions, voluntary]);

  const eventsByYear = useMemo(() => {
    const grouped = new Map();
    rawEvents.forEach((event) => {
      const existing = grouped.get(event.year) || [];
      grouped.set(event.year, [...existing, event]);
    });
    return grouped;
  }, [rawEvents]);

  const data = useMemo(() => {
    const activeRows = new Map(timelineData.map((row) => [row.year, row]));
    const baselineRows = new Map(baseTimelineData.map((row) => [row.year, row]));
    const years = hasLifeEvents
      ? [...new Set([...activeRows.keys(), ...baselineRows.keys()])].sort((a, b) => a - b)
      : timelineData.map((row) => row.year);

    return years.map((year) => {
      const active = activeRows.get(year);
      const baseline = baselineRows.get(year);
      const events = eventsByYear.get(year) || [];

      if (active) {
        return {
          ...active,
          baseBalance: hasLifeEvents ? (baseline?.endBalance ?? 0) : undefined,
          events,
        };
      }

      return {
        year,
        age: baseline?.age,
        taxableIncome: baseline?.taxableIncome ?? 0,
        compulsory: 0,
        voluntary: 0,
        endBalance: 0,
        baseBalance: baseline?.endBalance ?? 0,
        events,
        notes: [],
      };
    });
  }, [baseTimelineData, eventsByYear, hasLifeEvents, timelineData]);

  const eventMarkers = useMemo(() => {
    const rows = new Map(data.map((row) => [row.year, row]));
    const positionsByYear = new Map();

    return rawEvents
      .map((event) => {
        const row = rows.get(event.year);
        if (!row) return null;
        const position = positionsByYear.get(event.year) || 0;
        positionsByYear.set(event.year, position + 1);

        return {
          ...event,
          balance: row.endBalance,
          offset: position === 0 ? 0 : position % 2 === 1 ? 17 * Math.ceil(position / 2) : -17 * Math.ceil(position / 2),
        };
      })
      .filter(Boolean);
  }, [data, rawEvents]);

  const finalRow = timelineData[timelineData.length - 1];
  const [activeYear, setActiveYear] = useState(finalRow?.year);

  const activeRow = data.find((row) => row.year === activeYear) || finalRow;
  const activeEvents = activeRow?.events || [];
  const activeRepayment = repaymentFor(activeRow);
  const yearDifference = hasLifeEvents ? baseTimelineData.length - timelineData.length : 0;
  const baselineRepaid = baseTimelineData.reduce((sum, row) => sum + repaymentFor(row), 0);
  const scenarioRepaid = timelineData.reduce((sum, row) => sum + repaymentFor(row), 0);
  const repaymentDifference = baselineRepaid - scenarioRepaid;

  const handleActiveRow = useCallback((row) => {
    setActiveYear((currentYear) => (currentYear === row.year ? currentYear : row.year));
  }, []);

  if (!timelineData.length) return null;

  const legendEvents = Object.entries(EVENT_TYPES)
    .filter(([kind]) => rawEvents.some((event) => event.kind === kind))
    .map(([kind, config]) => ({ kind, ...config }));

  return (
    <section
      className="timeline-console mb-colour-card overflow-hidden"
      style={{ '--card-accent': 'var(--mb-pink)' }}
      aria-labelledby="timeline-title"
    >
      <header className="timeline-console__header">
        <div className="timeline-console__heading">
          <span className="timeline-console__number" aria-hidden="true">03</span>
          <div>
            <h2 id="timeline-title">Repayment timeline</h2>
          </div>
        </div>
        <div className="timeline-console__end-state">
          <span>Debt-free target</span>
          <strong>{finalRow.year}</strong>
        </div>
      </header>

      <div className="timeline-console__body">
        <div className="timeline-console__status">
          <span><i /> Projection online</span>
          <span>Touch or hover the chart to inspect any year</span>
        </div>

        <dl className="timeline-console__hud" aria-label={`Projection details for ${activeRow.year}`}>
          {[
            ['Selected year', activeRow.year, 'sky'],
            ['Age', activeRow.age ?? '—', 'yellow'],
            ['Repaid this year', formatCurrency(activeRepayment), 'pink'],
            ['Balance remaining', formatCurrency(activeRow.endBalance), 'mint'],
          ].map(([label, value, tone]) => (
            <div key={label} className={`timeline-console__hud-cell timeline-console__hud-cell--${tone}`}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {activeEvents.length ? (
          <div className="timeline-console__active-strip">
            <span>Events in {activeRow.year}</span>
            <ul aria-label="Events in the selected year">
              {activeEvents.map((event) => (
                <li key={event.id} style={{ '--event-colour': event.colour }}>
                  <i>{event.symbol}</i>
                  {event.description}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="timeline-console__chart">
          <TimelineChart
            activeYear={activeRow.year}
            breakBands={breaks}
            data={data}
            eventMarkers={eventMarkers}
            hasLifeEvents={hasLifeEvents}
            onActiveRow={handleActiveRow}
          />
        </div>

        <footer className="timeline-console__footer">
          <div className="timeline-console__path-legend">
            <span><i className="timeline-console__line timeline-console__line--current" /> Current path</span>
            {hasLifeEvents ? <span><i className="timeline-console__line timeline-console__line--baseline" /> Original path</span> : null}
          </div>

          {legendEvents.length ? (
            <div className="timeline-console__event-legend" aria-label="Life event markers">
              {legendEvents.map((event) => (
                <span key={event.kind} style={{ '--event-colour': event.colour }}>
                  <i>{event.symbol}</i>
                  {event.label}
                </span>
              ))}
            </div>
          ) : null}

          {hasLifeEvents && (yearDifference !== 0 || repaymentDifference !== 0) ? (
            <strong className="timeline-console__comparison">
              {yearDifference > 0
                ? `${yearDifference} years sooner`
                : yearDifference < 0
                  ? `${Math.abs(yearDifference)} years later`
                  : 'Same payoff year'}
              <span>·</span>
              {repaymentDifference >= 0
                ? `${formatCurrency(repaymentDifference)} less repaid`
                : `${formatCurrency(Math.abs(repaymentDifference))} more repaid`}
            </strong>
          ) : null}
        </footer>
      </div>
    </section>
  );
}
