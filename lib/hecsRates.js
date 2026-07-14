// --- SINGLE SOURCE OF TRUTH: FY2026-27 HECS/HELP RATES AND INDEXATION ---
// All figures verified against the ATO, 14 July 2026. Do not hardcode any of
// these numbers elsewhere; import from this module instead.
// Source: https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds

export const FINANCIAL_YEAR = '2026-27';
export const FINANCIAL_YEAR_START = 2026; // calendar year the FY begins (1 July 2026)

// Repayment income bands for FY2026-27. Each band's "base" is the fixed
// dollar amount already owed by the time you reach that band's lower bound,
// and "rate" is the marginal rate applied to income within the band.
export const REPAYMENT_BANDS = [
  {
    id: 'nil',
    rangeLabel: '$0 to $69,528',
    min: 0,
    max: 69528,
    base: 0,
    rate: 0,
    over: null,
    calcLabel: 'Nil',
    shortLabel: 'the nil band',
  },
  {
    id: 'band1',
    rangeLabel: '$69,529 to $129,717',
    min: 69528,
    max: 129717,
    base: 0,
    rate: 0.15,
    over: 69528,
    calcLabel: '15c per $1 over $69,528',
    shortLabel: 'the 15c band',
  },
  {
    id: 'band2',
    rangeLabel: '$129,718 to $186,050',
    min: 129717,
    max: 186050,
    base: 9028,
    rate: 0.17,
    over: 129717,
    calcLabel: '$9,028 + 17c per $1 over $129,717',
    shortLabel: 'the 17c band',
  },
  {
    id: 'top',
    rangeLabel: '$186,051+',
    min: 186050,
    max: Infinity,
    base: null,
    rate: 0.10,
    over: null,
    flatOnTotal: true,
    calcLabel: '10% of total repayment income',
    shortLabel: 'the 10% flat band',
  },
];

export const REPAYMENT_THRESHOLD = 69528; // minimum repayment income to start paying

/**
 * Calculate the compulsory HELP repayment for a given repayment income,
 * using the FY2026-27 marginal system.
 */
export function calculateCompulsoryRepayment(income) {
  const safeIncome = Number(income) || 0;
  if (safeIncome <= 0) return 0;

  if (safeIncome <= REPAYMENT_BANDS[0].max) {
    return 0;
  }
  if (safeIncome <= REPAYMENT_BANDS[1].max) {
    return (safeIncome - REPAYMENT_BANDS[1].over) * REPAYMENT_BANDS[1].rate;
  }
  if (safeIncome <= REPAYMENT_BANDS[2].max) {
    return REPAYMENT_BANDS[2].base + (safeIncome - REPAYMENT_BANDS[2].over) * REPAYMENT_BANDS[2].rate;
  }
  return safeIncome * REPAYMENT_BANDS[3].rate;
}

/** Returns the band object a given repayment income falls into. */
export function getBandForIncome(income) {
  const safeIncome = Number(income) || 0;
  return REPAYMENT_BANDS.find((b) => safeIncome <= b.max) || REPAYMENT_BANDS[REPAYMENT_BANDS.length - 1];
}

// --- INDEXATION ---

export const CURRENT_INDEXATION_RATE = 2.8; // percent, applied 1 June 2026
export const CURRENT_INDEXATION_DATE = '2026-06-01';
export const CURRENT_INDEXATION_TOOLTIP =
  'Default is the confirmed 1 June 2026 rate of 2.8%. Indexation is the lower of CPI or WPI each year. Adjust to model your own long run assumption.';

// Recent indexation history (verified via ATO). Some years carry a
// retrospective credit: the rate originally applied was later reduced once
// the CPI/WPI cap was backdated to 1 June 2023.
export const INDEXATION_HISTORY = [
  { year: 2021, appliedRate: 0.6, finalRate: 0.6, note: '' },
  { year: 2022, appliedRate: 3.9, finalRate: 3.9, note: '' },
  { year: 2023, appliedRate: 7.1, finalRate: 3.2, note: 'Reduced from 7.1% to 3.2% by retrospective credit' },
  { year: 2024, appliedRate: 4.7, finalRate: 4.0, note: 'Reduced from 4.7% to 4.0% by retrospective credit' },
  { year: 2025, appliedRate: 3.2, finalRate: 3.2, note: '' },
  { year: 2026, appliedRate: 2.8, finalRate: 2.8, note: 'Lowest rate since 2021' },
];

// --- WAGE GROWTH ---

export const DEFAULT_WAGE_GROWTH = 3.1; // percent, WPI annual wage growth, June quarter 2026

// --- OFFICIAL SOURCES ---

export const ATO_RATES_URL = 'https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds';
export const ATO_INDEXATION_URL = 'https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates';
export const STUDY_ASSIST_REPAYMENTS_URL = 'https://www.studyassist.gov.au/managing-and-repaying-your-loan/loan-repayments';

// --- FORMATTING HELPERS ---

export const formatCurrency = (val) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val);

export const formatCurrencyCents = (val) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 2 }).format(val);

/**
 * Build a Quick Answer summary for a given annual repayment income.
 */
export function getQuickAnswer(income) {
  const safeIncome = Number(income) || 0;
  const annual = calculateCompulsoryRepayment(safeIncome);
  const monthly = annual / 12;
  const weekly = annual / 52;
  const band = getBandForIncome(safeIncome);
  const effectiveRate = safeIncome > 0 ? (annual / safeIncome) * 100 : 0;
  return { annual, monthly, weekly, band, effectiveRate };
}
