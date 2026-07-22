import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProjection } from '../lib/help/projection-engine.mjs';

const inputs = {
  startingDebt: 50000,
  startingIncome: 80000,
  indexationRate: 2.8,
  wageGrowth: 3.1,
  firstYear: 2026,
  startingAge: 22,
};

test('baseline projection preserves cents internally', () => {
  const [firstYear] = buildProjection(inputs);
  assert.equal(firstYear.year, 2026);
  assert.equal(firstYear.age, 22);
  assert.equal(Math.round(firstYear.indexation * 100), 140000);
  assert.equal(Math.round(firstYear.compulsory * 100), 157080);
  assert.equal(Math.round(firstYear.endBalance * 100), 4982920);
});

test('scenario projection applies events without a duplicate engine', () => {
  const projection = buildProjection(inputs, {
    promotions: [{ year: 2027, percent: 10 }],
    reductions: [],
    voluntary: [{ year: 2026, amount: 5000 }],
    breaks: [{ startYear: 2028, duration: 1 }],
  });

  assert.equal(projection[0].voluntary, 5000);
  assert.match(projection[1].notes.join(' '), /Promotion/);
  assert.equal(projection[2].isBreak, true);
  assert.equal(projection[2].compulsory, 0);
});
