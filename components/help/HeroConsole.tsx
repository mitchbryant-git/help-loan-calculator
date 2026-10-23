'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { attachHeroDepth } from './heroDepth';

export default function HeroConsole() {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const image = imageRef.current;
    const hero = image?.closest('.help-hero');
    if (!image || !(hero instanceof HTMLElement)) return;
    return attachHeroDepth(hero, image);
  }, []);

  return (
    <div className="hecs-depth-stage">
      <Image ref={imageRef} className="hecs-depth-console"
        src="/hecs-debt-calculator/brand/help/header/atn01-hecs-debt-calculator-console-transparent-2026-10-23.png"
        data-fallback="/hecs-debt-calculator/brand/help/header/atn01-hecs-debt-calculator-console-transparent-2026-10-23.png"
        alt="Cream ATN-01 Life Console with the mint HECS Debt Calculator cartridge inserted"
        width={1536} height={1152} priority unoptimized draggable={false} />
    </div>
  );
}
