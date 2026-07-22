import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCompulsoryRepayment,
  formatCurrency,
  getBandForIncome,
} from '../lib/help/repayment-engine.mjs';

const closeToCents = (actual, expected) => {
  assert.equal(Math.round(actual * 100), Math.round(expected * 100));
};

test('FY 2026-27 repayment boundaries retain cent precision', () => {
  closeToCents(calculateCompulsoryRepayment(69528), 0);
  closeToCents(calculateCompulsoryRepayment(69529), 0.15);
  closeToCents(calculateCompulsoryRepayment(129717), 9028.35);
  closeToCents(calculateCompulsoryRepayment(129718), 9028.52);
  closeToCents(calculateCompulsoryRepayment(186050), 18604.96);
  closeToCents(calculateCompulsoryRepayment(186051), 18605.10);
});

test('worked examples follow the cumulative marginal formula', () => {
  closeToCents(calculateCompulsoryRepayment(72000), 370.80);
  closeToCents(calculateCompulsoryRepayment(80000), 1570.80);
  closeToCents(calculateCompulsoryRepayment(100000), 4570.80);
  closeToCents(calculateCompulsoryRepayment(150000), 12476.46);
});

test('band lookup follows inclusive upper boundaries', () => {
  assert.equal(getBandForIncome(69528).id, 'nil');
  assert.equal(getBandForIncome(69529).id, 'band1');
  assert.equal(getBandForIncome(129718).id, 'band2');
  assert.equal(getBandForIncome(186051).id, 'top');
});

test('normal currency presentation rounds to whole dollars', () => {
  assert.equal(formatCurrency(1570.80), '$1,571');
  assert.equal(formatCurrency(30.21), '$30');
});
