"use client";

import Image from 'next/image';

export default function HelpHero({ onOpenHelp }) {
  return (
    <section className="help-hero col-span-full" aria-labelledby="help-hero-title">
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
        </div>
      </div>
    </section>
  );
}
