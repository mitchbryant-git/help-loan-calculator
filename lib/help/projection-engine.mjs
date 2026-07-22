import { calculateCompulsoryRepayment } from './repayment-engine.mjs';

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const eventYear = (event, key = 'year') => Number.parseInt(event[key], 10);

export function buildProjection(inputs, events = {}) {
  const promotions = events.promotions || [];
  const reductions = events.reductions || [];
  const voluntary = events.voluntary || [];
  const breaks = events.breaks || [];

  const data = [];
  let balance = Math.max(0, number(inputs.startingDebt));
  let baselineIncome = Math.max(0, number(inputs.startingIncome));
  let currentYear = number(inputs.firstYear, 2026);
  const wageGrowth = number(inputs.wageGrowth);
  const indexationRate = number(inputs.indexationRate);
  const startingAge = number(inputs.startingAge, 22);
  const maxYears = number(inputs.maxYears, 50);

  for (let yearsElapsed = 0; balance > 0.01 && yearsElapsed < maxYears; yearsElapsed += 1) {
    if (yearsElapsed > 0) baselineIncome *= 1 + wageGrowth / 100;

    const notes = [];

    promotions
      .filter((event) => eventYear(event) === currentYear)
      .forEach((event) => {
        baselineIncome *= 1 + number(event.percent) / 100;
        notes.push(`Promotion: +${event.percent}%`);
      });

    reductions
      .filter((event) => eventYear(event) === currentYear)
      .forEach((event) => {
        baselineIncome *= 1 - number(event.percent) / 100;
        notes.push(`Income Drop: -${event.percent}%`);
      });

    const activeBreak = breaks.find((event) => {
      const start = eventYear(event, 'startYear');
      return currentYear >= start && currentYear < start + number(event.duration);
    });

    const taxableIncome = activeBreak ? 0 : baselineIncome;
    if (activeBreak) notes.push('Work Break');

    const voluntaryRepayment = voluntary
      .filter((event) => eventYear(event) === currentYear)
      .reduce((total, event) => total + number(event.amount), 0);

    const startBalance = balance;
    let currentBalance = Math.max(0, balance - voluntaryRepayment);
    const indexation = currentBalance * (indexationRate / 100);
    currentBalance += indexation;

    const compulsory = activeBreak
      ? 0
      : Math.min(calculateCompulsoryRepayment(taxableIncome), currentBalance);

    currentBalance = Math.max(0, currentBalance - compulsory);

    data.push({
      year: currentYear,
      age: startingAge ? startingAge + yearsElapsed : null,
      baselineIncome,
      taxableIncome,
      compulsory,
      voluntary: voluntaryRepayment,
      indexation,
      startBalance,
      endBalance: currentBalance,
      isBreak: Boolean(activeBreak),
      notes,
    });

    balance = currentBalance;
    currentYear += 1;
  }

  return data;
}
