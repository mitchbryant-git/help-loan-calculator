# HECS Debt Calculator handover

## Current direction

- Public name: **HECS Debt Calculator**
- Supporting scope: HECS-HELP, FEE-HELP and other HELP debts
- Canonical route: `https://allthatsnext.com/hecs-debt-calculator`
- Legacy domain: `helploancalculator.com`, retained as a permanent redirect layer
- Product owner: All That’s Next

## Architecture

This repository is a standalone Next.js app mounted beneath the All That’s Next parent site using Next.js Multi-Zones.

- Child `basePath`: `/hecs-debt-calculator`
- Child asset prefix: `/hecs-debt-calculator-static`
- Stable child origin: `https://help-loan-calculator.vercel.app`
- Parent repository: `C:\Users\mitch\Code\mitch-bryant-project`

The parent site proxies the calculator route, guide routes and static asset prefix to this child deployment. Cross-zone navigation should use normal anchors so the browser performs a hard navigation.

## Redirect contract

`proxy.ts` only redirects requests received on the legacy custom hosts. It must not redirect the Vercel child origin, because the All That’s Next parent proxies to that origin.

- Legacy root -> `/hecs-debt-calculator`
- Legacy guides -> `/hecs-debt-calculator/<same-guide-slug>`
- Legacy 2025-26 threshold guide -> current 2026-27 threshold guide
- Query strings are preserved.

## Artwork checkpoint

The approved HECS Debt Calculator cartridge and loaded-console artwork was supplied and locked on 11 August 2026. The calculator hero uses `public/brand/help/mb01-hecs-debt-loaded-hero-v1.jpg`; the homepage uses matching derivatives from its own asset folders.

## Verification before shipping

1. `npm test`
2. `npm run lint`
3. `npm run build`
4. Verify the child deployment at its Vercel origin.
5. Verify the canonical calculator, every guide, share links and static assets through `allthatsnext.com`.
6. Verify legacy root and guide URLs return a permanent redirect to the matching canonical route.
