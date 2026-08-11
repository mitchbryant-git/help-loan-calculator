const DEFAULT_ORIGIN = 'https://allthatsnext.com/hecs-debt-calculator';

export function buildShareUrl(inputs, events, origin = DEFAULT_ORIGIN) {
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
  return `${origin}/#plan?${params.toString()}`;
}

export function getSharedPlanParams({ hash = '', search = '' }) {
  const fragment = hash.startsWith('#plan?') ? hash.slice('#plan?'.length) : '';
  const encodedPlan = fragment || search;
  if (!encodedPlan) return null;

  const params = new URLSearchParams(encodedPlan);
  return [...params.keys()].length ? params : null;
}
