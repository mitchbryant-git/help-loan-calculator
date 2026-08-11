import test from 'node:test';
import assert from 'node:assert/strict';
import { buildShareUrl, getSharedPlanParams } from '../lib/help/share-plan.mjs';

const inputs = {
  startingDebt: 54321,
  startingIncome: 76543,
  wageGrowth: 3.1,
  indexationRate: 2.8,
  firstYear: 2026,
  startingAge: 23,
};

const emptyEvents = {
  promotions: [],
  voluntary: [],
  breaks: [],
  reductions: [],
};

test('shared plans keep calculator figures out of the request URL', () => {
  const link = buildShareUrl(inputs, {
    ...emptyEvents,
    voluntary: [{ year: 2028, amount: 2500 }],
  });
  const url = new URL(link);

  assert.equal(url.origin, 'https://allthatsnext.com');
  assert.equal(url.pathname, '/hecs-debt-calculator/');
  assert.equal(url.search, '');
  assert.match(url.hash, /^#plan\?/);

  const params = getSharedPlanParams(url);
  assert.equal(params.get('d'), '54321');
  assert.deepEqual(JSON.parse(params.get('e')), [{ t: 'v', y: 2028, amt: 2500 }]);
});

test('legacy query-string plans remain readable', () => {
  const params = getSharedPlanParams({
    hash: '',
    search: '?d=111111&i=90000&g=3&x=2.8&y=2027&a=24',
  });

  assert.equal(params.get('d'), '111111');
  assert.equal(params.get('i'), '90000');
});

test('ordinary page fragments do not look like shared plans', () => {
  assert.equal(getSharedPlanParams({ hash: '#calculator', search: '' }), null);
});
