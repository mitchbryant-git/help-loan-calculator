"use client";

import Image from 'next/image';

export default function HelpHero({ onOpenHelp }) {
  return (
    <section className="help-hero col-span-full" aria-labelledby="help-hero-title">
      <div className="help-hero__system-bar" aria-hidden="true">
        <div className="help-hero__system-id">
          <span className="help-hero__mb-badge">MB-01</span>
          <span>Financial utility module</span>
        </div>
        <div className="help-hero__system-state">
          <span className="help-hero__status-light" />
          Module loaded
        </div>
        <div className="help-hero__stripes">
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="help-hero__body">
        <div className="help-hero__copy">
          <p className="help-hero__eyebrow">
            <span className="help-hero__eyebrow-number">01</span>
            HECS Debt Calculator
          </p>

          <h1 id="help-hero-title" className="help-hero__title">
            <span>Know your</span>
            <span className="help-hero__title-accent help-hero__title-accent--mint">numbers.</span>
            <span>Own your</span>
            <span className="help-hero__title-accent help-hero__title-accent--pink">future.</span>
          </h1>

          <p className="help-hero__lede">
            See when your HELP debt could be gone, what you may repay, and how
            income growth, career breaks and extra repayments can change the path.
          </p>

          <div className="help-hero__actions">
            <a className="help-hero__primary-action" href="#calculator">
              Start planning
              <span aria-hidden="true">↓</span>
            </a>
            <button className="help-hero__secondary-action" type="button" onClick={onOpenHelp}>
              How it works
              <span aria-hidden="true">↗</span>
            </button>
          </div>

          <ul className="help-hero__proof" aria-label="Calculator details">
            <li><span aria-hidden="true">✓</span> 2026–27 settings</li>
            <li><span aria-hidden="true">✓</span> Free to use</li>
            <li><span aria-hidden="true">✓</span> No sign-up</li>
          </ul>
        </div>

        <div className="help-hero__visual">
          <div className="help-hero__image-frame">
            <Image
              src="/hecs-debt-calculator/brand/help/mb01-hecs-debt-loaded-hero-v1.jpg"
              alt="Cream MB-01 Life Console with the mint HECS Debt Calculator cartridge inserted"
              width={1280}
              height={653}
              priority
              sizes="(max-width: 900px) 100vw, 52vw"
              className="help-hero__image"
            />
          </div>
          <div className="help-hero__visual-label" aria-hidden="true">
            <span>HECS MODULE</span>
            <strong>READY</strong>
          </div>
          <div className="help-hero__visual-code" aria-hidden="true">MB-01 // HECS // v1.1.0</div>
        </div>
      </div>

      <div className="help-hero__footer">
        <span>2026–27 HECS-HELP &amp; FEE-HELP repayment planner</span>
        <span>Estimate only · Educational use</span>
      </div>
    </section>
  );
}
