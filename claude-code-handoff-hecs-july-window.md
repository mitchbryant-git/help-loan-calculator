> Historical handoff only. Superseded by `HANDOFF.md` and retained for context.

# HANDOFF: helploancalculator.com, FY 2026-27 Update

You are working in the helploancalculator.com repository (Next.js 15 App Router, TypeScript/JS, Tailwind, deployed on Vercel). No CLAUDE.md exists yet.

This site targets students planning for **FY 2026-27 only**. FY 2025-26 is over and is no longer supported anywhere on the site: no toggle, no dual-year logic, no archive page. Every rate, threshold, and default in the product should simply be the current one.

**Deliverables:**
1. Single-source-of-truth rates/indexation config for FY 2026-27, calculator engine refactored to read from it.
2. Wage growth and indexation slider defaults updated to reflect what actually happened.
3. Two guide pages: replace the old 2025-26 thresholds guide with a 2026-27 version, and add a new indexation-2026 guide.
4. Quick Answer module on the homepage.
5. Homepage H1, title, and metadata refresh, plus a site-wide stale-figure sweep.

---

## NON-NEGOTIABLE STANDARDS

- **Accuracy over completeness.** Every number you ship must come from the VERIFIED DATA block below or a successful fetch of the official ATO source. If a figure cannot be confirmed, say so and stop rather than guessing.
- **Copy discipline.** Australian spelling everywhere. No em dashes or en dashes anywhere: copy, UI strings, tooltips, comments shown to users. Use commas, colons, or restructure.
- **Design discipline.** Match the existing site's components, spacing, and colour usage exactly. Do not introduce new fonts, gradients, or visual styles. This site's aesthetic is trust, not flash.
- **Single source of truth.** All thresholds, rates, and indexation figures must live in one config module after this work. No hardcoded rates in components or page copy templates (page prose can contain numbers, but tables and calculations must read from config).
- **No FY toggle, no dual-year state.** Do not build any UI or config structure for selecting between financial years. FY 2026-27 is the only year the product models going forward.
- **Stop conditions.** Stop and report (instead of proceeding) if: (a) fetched ATO data conflicts with the VERIFIED DATA block, (b) centralising rates requires refactoring more than ~400 lines of `app/page.jsx` (it is currently one ~2,350-line file with no config module), in which case do a minimal adapter and note it, (c) anything requires credentials or env secrets you don't have.

---

## VERIFIED DATA (confirmed via ATO, 14 July 2026)

**FY 2026-27 marginal system (effective 1 July 2026, full table now published):**

| Repayment income | Rate |
|---|---|
| $0 to $69,528 | Nil |
| $69,529 to $129,717 | 15c per $1 over $69,528 |
| $129,718 to $186,050 | $9,028 + 17c per $1 over $129,717 |
| $186,051+ | 10% of total repayment income |

Source: [ATO study and training loan repayment thresholds and rates](https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds). All bands are confirmed, none are provisional. Delete any "provisional" or "pending ATO publication" handling from earlier drafts of this brief.

**Indexation:**
- Applied 1 June each year to debt portions unpaid for more than 11 months.
- Rate is the lower of CPI or WPI (Universities Accord reforms, rule backdated to 1 June 2023).
- **1 June 2026 rate: 2.8% (confirmed, already applied).** This is the current default for the indexation slider and all copy describing "the current rate".
- History for tables: 2021: 0.6%. 2022: 3.9%. 2023: 7.1% applied, reduced to 3.2% by retrospective credit. 2024: 4.7% applied, reduced to 4.0% by retrospective credit. 2025: 3.2%. 2026: 2.8%.
- 20% debt cut: legislated 2 August 2025, applied automatically to balances as at 1 June 2025, before that year's indexation.

**Wage growth:**
- Wage Price Index, Australia, June quarter 2026: annual wage growth **3.1%**. This is the new default for the "wage growth" projection slider, replacing the old placeholder default of 3.5%.

**Official sources (link these in page copy where indicated):**
- ATO thresholds and rates: https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds
- ATO indexation rates: https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates
- Study Assist loan repayments: https://www.studyassist.gov.au/managing-and-repaying-your-loan/loan-repayments

**Worked-example maths (use these exact figures, verify with your own arithmetic before shipping):**
- 2026-27, $72,000 income: ($72,000 − $69,528) × 0.15 = $370.80/yr, about $31/month.
- 2026-27, $80,000: $10,472 × 0.15 = $1,570.80/yr, about $131/month.
- 2026-27, $100,000: $30,472 × 0.15 = $4,570.80/yr, about $381/month.
- 2026-27, $150,000 (crosses into second band): $9,028 + ($150,000 − $129,717) × 0.17 = $9,028 + $3,448.11 = $12,476.11/yr, about $1,040/month.
- Comparison vs the old (2025-26) system: $80,000 repaid $1,950 under the 2025-26 table. Same salary repays $1,570.80 in 2026-27, $379.20 less, with no pay rise. Use only in the "what changed" framing of the 2026-27 guide, never as a live current-year figure elsewhere.
- Indexation cost at 2.8%: $20,000 debt → $560. $30,000 → $840. $50,000 → $1,400.

---

## PHASE 0: ORIENT

Current state (confirmed by codebase survey, 14 July 2026): there is no `lib/`, `config/`, or `data/` directory. `app/page.jsx` (~2,350 lines) contains the entire calculator UI and a hardcoded `calculateCompulsoryRepayment` function using the 2025-26 table. The same table is duplicated as static markup in `app/hecs-repayment-thresholds-2025-26/page.jsx`, in the disclaimer footer of `app/page.jsx`, and in the FAQ JSON-LD in `app/layout.tsx`. `inputs.indexationRate` defaults to `3.0`, `inputs.wageGrowth` defaults to `3.5`. FAQ content exists twice, once as JSON-LD in `app/layout.tsx` and once as a visible accordion in `app/page.jsx`, and both must be kept in sync manually.

1. Read this document in full before touching anything.
2. Write a short internal plan (scratch file or comment block) listing the files you'll touch per phase. Then proceed. Do not wait for approval.

## PHASE 1: RATES CONFIG (single source of truth)

1. Create a rates config module (e.g. `lib/hecsRates.js` or `.ts` to match the rest of the codebase) containing: the FY2026-27 band table (lower bound, upper bound, marginal rate, fixed component), the top-tier rule, indexation config (current rate 2.8, applied date 2026-06-01, and the full history table from VERIFIED DATA), and the wage growth default (3.1).
2. Refactor `calculateCompulsoryRepayment` in `app/page.jsx` and every other rate table on the site (guide pages, disclaimer footer, FAQ copy and FAQ JSON-LD) to read from this config. No band figures, indexation rate, or wage growth default may remain hardcoded outside the config module (guide page prose may still state figures in sentences, but tables and calculations must derive from config).
3. Snapshot the five worked examples in VERIFIED DATA before and after the refactor to confirm the engine's arithmetic is unchanged by the refactor itself.

## PHASE 2: CALCULATOR ENGINE AND UI UPDATES

1. Do not add a financial year toggle. Remove any remaining 2025-26 assumptions from the engine; it should model 2026-27 only, held constant across the projection (current "hold current-year brackets constant into the future" behaviour, just using the new table).
2. Change the wage growth slider default from 3.5 to **3.1** and keep its existing tooltip wording, updating only the number.
3. Change the indexation slider default from 3.0 to **2.8** and update its tooltip to: "Default is the confirmed 1 June 2026 rate of 2.8%. Indexation is the lower of CPI or WPI each year. Adjust to model your own long run assumption."
4. Update the disclaimer block and the embedded rate table in `app/page.jsx` to render from config and state 2026-27, not 2025-26.
5. Verify the repayment maths against all five worked examples in VERIFIED DATA. All must match to the cent.

## PHASE 3: QUICK ANSWER MODULE (homepage)

Purpose: most searchers want "what do I pay this year on $X" in five seconds. Give them that instantly, then pull them into the full planner.

1. Place a compact module directly under the H1/subtitle, above the existing "Basics" content. Mobile first.
2. Contents: one income input. Instant outputs on input: annual compulsory repayment, the same figure per month and per week, the band label (e.g. "You're in the 15c band"), and effective rate as % of income. All computed from the config, FY2026-27 only.
3. CTA button: "See your full payoff timeline" which smooth-scrolls to the planner and pre-fills the income field with the entered value.
4. Crawlability: render one static example sentence (server-rendered, not behind interaction) beneath the module: "Example: on $80,000, your compulsory repayment is $1,570.80 for the year, about $131 a month." Pull figures from config at build time so it can never go stale.
5. Style: reuse existing input, card, and stat components. No new design language.

## PHASE 4: REPLACE /hecs-repayment-thresholds-2025-26 WITH /hecs-repayment-thresholds-2026-27

Delete `app/hecs-repayment-thresholds-2025-26` entirely (route and file), it has no ongoing audience now that the year has passed. Add a redirect from the old path to the new one in `next.config.js` (permanent redirect) so any inbound links or indexed search results land somewhere useful.

Build the new page at `app/hecs-repayment-thresholds-2026-27` using the existing guide page pattern. Metadata: title "HECS Repayment Thresholds 2026-27 | $69,528 Threshold Explained", description "The HECS-HELP repayment threshold is $69,528 for the 2026-27 financial year. See the full rates table, worked examples, and what it means for your repayments." Add a small "Updated [build date]" line under the H1. Add Article structured data consistent with however existing guides handle schema; do not invent a new schema approach.

Use this copy verbatim (render the table from config):

---

# HECS-HELP Repayment Thresholds 2026-27: What You Pay This Year

### The Short Version

For the 2026-27 financial year, the minimum repayment threshold is **$69,528**. If your repayment income is at or below $69,528, you make no compulsory repayment. Above it, the marginal system introduced in 2025-26 keeps doing its thing: you only pay on the income above the threshold, never on your whole salary.

### The 2026-27 Repayment Rates

[RENDER RATES TABLE FROM CONFIG FOR FY2026-27 HERE]

Your repayment income isn't just your salary. The ATO adds your taxable income, reportable fringe benefits, total net investment losses, and reportable super contributions. Worth remembering if you salary package.

### What This Looks Like in Real Money

**Earning $72,000:** You're $2,472 over the threshold. 15c per dollar on that = **$370.80 for the year**. About $31 a month.

**Earning $80,000:** $10,472 over. 15c x $10,472 = **$1,570.80 for the year**. About $131 a month.

**Earning $100,000:** $30,472 over. 15c x $30,472 = **$4,570.80 for the year**. About $381 a month.

### Why the Threshold Moved

The threshold rises most years in line with wage growth, so the line between paying nothing and paying something keeps pace with typical incomes. It moved from $67,000 in 2025-26 to $69,528 this year: on $80,000, that shift alone is worth $379.20 less in compulsory repayments than the same salary would have paid last year, with no pay rise involved.

Feels like a win, and short term it is. But there's a flip side.

### The Catch

Smaller compulsory repayments mean your balance hangs around longer. And every year it's still there, it gets indexed. The 1 June 2026 indexation rate was 2.8%, so a $30,000 balance grew by $840 this year alone. Lower repayments now can quietly mean more indexation over the life of the loan.

That's not a reason to panic. It's a reason to know your timeline. **Want to see exactly when you'll be debt free?** [Use the HELP Loan Calculator →](https://www.helploancalculator.com) Model a pay rise, a voluntary repayment, or a gap year and watch the payoff date move.

### Where This Info Comes From

The 2026-27 threshold and rates are sourced from the [Australian Taxation Office](https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds) and [Study Assist](https://www.studyassist.gov.au/managing-and-repaying-your-loan/loan-repayments). Indexation rates are published by the [ATO here](https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates).

This guide is for educational purposes only and is not financial advice. Always verify figures with the ATO.

---

Internal links block at the bottom (use existing "More Guides" component): link to the indexation-2026 guide, the evergreen indexation guide, and the other existing guides currently linked from the old thresholds page.

## PHASE 5: NEW PAGE, /hecs-indexation-2026

Metadata: title "HECS Indexation 2026: The 2.8% Rate Explained", description "HECS-HELP debts were indexed by 2.8% on 1 June 2026, the lowest rate since 2021. See what it added to your balance, why the rate fell, and when the next window is." Same "Updated [build date]" line and schema approach as Phase 4.

Use this copy verbatim (render the history table from config):

---

# HECS Indexation 2026: The 2.8% Rate and What It Added to Your Debt

### What Just Happened

On 1 June 2026, the ATO indexed every HELP balance that had been outstanding for more than 11 months by **2.8%**. That's the lowest rate since 2021, and it continues the slide from the 7.1% shock of 2023.

No interest. No invoice. Your balance just quietly grew. Here's what that actually cost.

### What 2.8% Added to Your Balance

A **$20,000** debt grew by **$560**. A **$30,000** debt grew by **$840**. A **$50,000** debt grew by **$1,400**. Check your exact balance in myGov under the ATO section, the indexation line will be itemised.

### Why the Rate Came Down

Since the Universities Accord reforms, indexation is the **lower of CPI or WPI** for the year, a rule backdated to 1 June 2023. That cap is doing its job: when prices ran ahead of wages in 2023, debts could no longer grow faster than pay packets.

### Recent Indexation Rates

[RENDER INDEXATION HISTORY TABLE FROM CONFIG: year, applied rate, and a note column showing the retrospective credits for 2023 (7.1% reduced to 3.2%) and 2024 (4.7% reduced to 4.0%)]

### Missed the Window? Here's Next Year's Play

Voluntary repayments only beat indexation if they **clear** before 1 June. The ATO doesn't count a payment until the money lands, and BPAY can take a few business days. The 2027 rate will be announced in late May 2027 once the March quarter CPI and WPI numbers are in. If you're planning a lump sum, aim for the third week of May at the latest.

Want to see what a voluntary repayment actually does to your payoff date? [Model it in the calculator →](https://www.helploancalculator.com)

### One More Thing: The 20% Cut

If your balance looks smaller than you remember, that's the one-off 20% reduction legislated in August 2025, applied automatically to balances as at 1 June 2025. Nothing to claim, but worth confirming in myGov that it landed.

### Where This Info Comes From

Indexation rates are published by the [Australian Taxation Office](https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates). Repayment rules are at [Study Assist](https://www.studyassist.gov.au/managing-and-repaying-your-loan/loan-repayments).

This guide is for educational purposes only and is not financial advice. Always verify figures with the ATO.

---

Internal links: the evergreen "How HECS Indexation Works" guide (`app/how-hecs-indexation-works`), the 2026-27 thresholds page, the calculator. Also update the evergreen indexation guide: add a dated callout near the top, "1 June 2026 update: this year's rate was 2.8%. [Full breakdown →]", extend its historical rate table to include 2026, and fix any figures in it per Phase 6 rules (it currently states "3.2%" as if it were the current rate; it must not after this change).

## PHASE 6: SITE-WIDE STALE SWEEP

Grep the entire codebase and content for these patterns and apply the rules. Known locations from the codebase survey: `app/page.jsx` (FAQ accordion, disclaimer footer, hero subtitle), `app/layout.tsx` (metadata, FAQ JSON-LD), `app/how-hecs-indexation-works/page.jsx`, `app/hecs-debt-and-home-loans/page.jsx`, `app/real-cost-of-starting-uni-before-youre-ready/page.jsx`. Treat this list as a starting point, not exhaustive; grep the whole repo.

- `$67,000` → replace with $69,528 everywhere it is used as a current-year figure. Only keep $67,000 where the sentence is explicitly and clearly about the 2025-26 year as history (e.g. "the threshold rose from $67,000 to $69,528").
- `3.2%` and `3.0%` / `3%` used as "the current indexation rate" → 2.8%. Keep `3.2%` only inside historical tables or sentences explicitly about 2025 or 2023-after-credit.
- Indexation slider default `3` / `3%` → 2.8% (Phase 2, confirm done).
- Wage growth slider default `3.5` → 3.1% (Phase 2, confirm done).
- `Built on official 2025-26 ATO repayment rates` (and any similar phrase) → "Built on official 2026-27 ATO repayment rates."
- The FAQ "When do I start repaying" must state $69,528, not $67,000, and drop any "(2025-26 threshold)" qualifier.
- The FAQ "How much will my HECS repayments be?" must state the 2026-27 bands, reading from config where practical.
- The FAQ "Does HECS-HELP have interest?" currently says "In 2025, the rate was 3.2%". Change to: "In 2026, the rate was 2.8%, the lowest since 2021."
- `$179,285` / `$179,286` / `$125,000` (old top-band boundaries) → replace with the 2026-27 boundaries ($129,717 / $129,718 / $186,050 / $186,051) wherever they describe current bands.
- `2025-26` in titles, meta, and body copy → replace with 2026-27, except where a sentence is deliberately talking about the past.
- `$54,435` → historical references only, or remove if it no longer serves a purpose without a 2025-26 comparison.
- Remember: both the FAQ JSON-LD in `app/layout.tsx` and the visible FAQ accordion in `app/page.jsx` must be edited in lockstep, word for word.

List every change you make in the final report. Re-run the grep after changes and confirm zero rule violations remain.

## PHASE 7: HOMEPAGE H1, TITLE, METADATA

1. Title tag: `HECS-HELP Repayment Calculator Australia | 2026-27 Rates ($69,528 Threshold)`.
2. Meta description: `Free Australian HECS-HELP and FEE-HELP repayment calculator, updated for the 2026-27 threshold of $69,528 and the 2.8% June 2026 indexation. Model promotions, gap years, and voluntary repayments to see your real payoff date.`
3. Current visible H1 is `sr-only`; the visible hero subtitle below it says "Built on official 2025-26 ATO repayment rates," update it to 2026-27 per Phase 6. Keep the sr-only H1 text as is unless it names a stale year.
4. Update OG/Twitter title and description to match. Leave the OG image as is.
5. Update FAQ schema JSON to mirror every FAQ copy change from Phase 6 exactly (visible text and schema must match word for word).

## PHASE 8: PLUMBING

1. Add the new 2026-27 thresholds page and the indexation-2026 page to the sitemap with lastmod set to build date. Remove the deleted 2025-26 thresholds page from the sitemap. Confirm the sitemap route/file actually emits the change.
2. Add both new pages to the homepage Guides list and footer guides block; remove the old 2025-26 thresholds page from both.
3. Cross-link: 2026-27 thresholds page ↔ indexation-2026 page ↔ calculator ↔ evergreen indexation guide.
4. Add the permanent redirect from `/hecs-repayment-thresholds-2025-26` to `/hecs-repayment-thresholds-2026-27` (Phase 4). Confirm robots rules don't block anything new.

## PHASE 9: VERIFY (do not skip)

Run and confirm ALL of the following. If anything fails, fix and re-run before reporting:

- [ ] `pnpm build` (or the repo's actual build command, confirm from package.json) succeeds, zero TypeScript errors, lint clean.
- [ ] Engine maths: all five worked examples in VERIFIED DATA match to the cent.
- [ ] Wage growth slider defaults to 3.1%, indexation slider defaults to 2.8%, both confirmed in the rendered UI, not just the config.
- [ ] Quick Answer module: instant output, scroll + prefill works, static example sentence is server-rendered (view page source to confirm).
- [ ] Grep sweep re-run: zero violations of Phase 6 rules.
- [ ] Old 2025-26 thresholds route returns a redirect, not a 404 and not the old content.
- [ ] New page renders correctly on a 375px viewport, table doesn't overflow.
- [ ] Sitemap contains both new URLs and no longer contains the deleted URL. FAQ schema validates (use a JSON-LD validity check) and matches visible text.
- [ ] No em dashes or en dashes anywhere in new/changed copy: grep for them (–, —) and fix.

## PHASE 10: FINAL REPORT

Output a summary: files changed per phase, every Phase 6 edit, all verification results, and one manual follow-up for Mitch: request indexing for both new/changed URLs in Google Search Console after deploy.
