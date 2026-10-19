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
        src="/hecs-debt-calculator/brand/help/header/hecs-console-atn-lettering-v3.svg"
        data-fallback="/hecs-debt-calculator/brand/help/header/hecs-console-atn-lettering-v3-static.png"
        alt="Cream ATN-01 Life Console with the mint HECS Debt Calculator cartridge inserted"
        width={1280} height={960} priority unoptimized draggable={false} />
    </div>
  );
}
