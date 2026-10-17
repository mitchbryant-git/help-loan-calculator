"use client";

import HeroConsole from './HeroConsole';
import './hero-depth.css';

export default function HelpHero({ onOpenHelp }) {
  return (
    <section className="help-hero help-hero--depth col-span-full" aria-labelledby="help-hero-title">
      <div className="help-hero__top-band" aria-hidden="true">
        <div className="help-hero__stripes"><span /><span /><span /><span /></div>
      </div>
      <div className="help-hero__body">
        <div className="help-hero__copy">

          <h1 id="help-hero-title" className="help-hero__title">
            <span className="help-hero__title-degree">Your degree<br />ends.</span>
            <span className="help-hero__title-accent">When does<br />your debt?</span>
          </h1>
          <p className="help-hero__lede">
            See when your HECS debt could be gone, what you may repay, and how
            income growth, career breaks and extra repayments can change the path.
          </p>
          <div className="help-hero__actions">
            <a className="help-hero__primary-action" href="#calculator">
              Start planning <span aria-hidden="true">↓</span>
            </a>
            <button className="help-hero__secondary-action" type="button" onClick={onOpenHelp}>
              How it works <span aria-hidden="true">?</span>
            </button>
          </div>
        </div>
        <div className="help-hero__visual">
          <HeroConsole />
        </div>
      </div>
    </section>
  );
}
