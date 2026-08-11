# HECS Debt Calculator

The calculator module for All That’s Next. It models HECS-HELP, FEE-HELP and other HELP debt repayment paths using official Australian repayment settings, with optional life events for scenario testing.

## Public URLs

- Canonical calculator: `https://allthatsnext.com/hecs-debt-calculator`
- Guides: `https://allthatsnext.com/hecs-debt-calculator/<guide-slug>`
- Legacy domain: `https://helploancalculator.com` permanently redirects to the canonical route.
- Child deployment origin: `https://help-loan-calculator.vercel.app/hecs-debt-calculator`

The app is mounted under All That’s Next as a Next.js Multi-Zone child. Keep `basePath` and `assetPrefix` in `next.config.ts` aligned with the parent site rewrites.

## Local development

Run this child app on port 3001 when testing it through the All That’s Next parent site:

```bash
npm install
npm run dev -- --port 3001
```

Direct local route: `http://127.0.0.1:3001/hecs-debt-calculator`

## Checks

```bash
npm test
npm run lint
npm run build
```

## Product naming

The public product name is **HECS Debt Calculator**. Supporting copy should clarify that it also covers HECS-HELP, FEE-HELP and other HELP debts. Do not make unsupported market-share claims.

The approved HECS Debt Calculator cartridge and loaded-console artwork is locked in `mitch-brand-system` and deployed through both the parent module library and this calculator hero.
