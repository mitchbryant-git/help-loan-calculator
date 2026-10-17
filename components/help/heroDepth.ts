export function attachHeroDepth(hero: HTMLElement, consoleImage: HTMLImageElement): () => void {
  const allowed = matchMedia('(min-width:1000px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
  let disposed = false;
  let ready = false, frame = 0, previousTime = 0;
  let targetX = 0, targetY = 0, currentX = 0, currentY = 0;
  const clamp = (n: number) => Math.max(-1, Math.min(1, n));
  function neutral() {
    cancelAnimationFrame(frame); frame = 0; previousTime = 0;
    targetX = targetY = currentX = currentY = 0;
    consoleImage.style.removeProperty('transform');
  }
  function tick(time: number) {
    frame = 0;
    if (!ready || !allowed.matches || document.hidden) { neutral(); return; }
    const elapsed = previousTime ? Math.min(time - previousTime, 48) : 16.67;
    previousTime = time;
    const easing = 1 - Math.exp(-elapsed / 145);
    currentX += (targetX - currentX) * easing;
    currentY += (targetY - currentY) * easing;
    if (Math.abs(targetX-currentX) < .0005 && Math.abs(targetY-currentY) < .0005) {
      currentX = targetX; currentY = targetY;
      if (targetX === 0 && targetY === 0) { neutral(); return; }
    } else frame = requestAnimationFrame(tick);
    consoleImage.style.transform = `translate3d(${(currentX*4).toFixed(4)}px,${(currentY*3).toFixed(4)}px,0) rotateX(${(-currentY*.6).toFixed(4)}deg) rotateY(${(currentX*1).toFixed(4)}deg)`;
  }
  function start() { if (!frame) { previousTime = 0; frame = requestAnimationFrame(tick); } }
  const onPointerMove = (event: PointerEvent) => {
    if (!(event instanceof PointerEvent) || event.pointerType !== 'mouse' || !ready || !allowed.matches) return;
    const box = hero.getBoundingClientRect();
    targetX = clamp((event.clientX-box.left)/box.width*2-1);
    targetY = clamp((event.clientY-box.top)/box.height*2-1);
    start();
  };
  hero.addEventListener('pointermove', onPointerMove);
  function returnHome() { targetX = targetY = 0; if (ready && allowed.matches) start(); else neutral(); }
  hero.addEventListener('pointerleave', returnHome);
  hero.addEventListener('pointercancel', neutral);
  window.addEventListener('blur', neutral);
  window.addEventListener('resize', neutral, {passive:true});
  window.addEventListener('scroll', neutral, {passive:true});
  document.addEventListener('visibilitychange', neutral);
  allowed.addEventListener('change', neutral);
  function useStaticFallback() {
    if (disposed) return;
    ready = false; neutral(); consoleImage.removeAttribute('data-ready');
    const fallback = consoleImage.dataset.fallback;
    if (fallback) { delete consoleImage.dataset.fallback; consoleImage.src = fallback; }
  }
  consoleImage.addEventListener('error', useStaticFallback);
  consoleImage.decode().then(() => {
    if (disposed || !consoleImage.dataset.fallback) return;
    ready = true; consoleImage.dataset.ready = 'true';
  }).catch(useStaticFallback);
  return () => {
    disposed = true; ready = false; neutral();
    consoleImage.removeAttribute('data-ready');
    hero.removeEventListener('pointermove', onPointerMove);
    hero.removeEventListener('pointerleave', returnHome);
    hero.removeEventListener('pointercancel', neutral);
    window.removeEventListener('blur', neutral);
    window.removeEventListener('resize', neutral);
    window.removeEventListener('scroll', neutral);
    document.removeEventListener('visibilitychange', neutral);
    allowed.removeEventListener('change', neutral);
    consoleImage.removeEventListener('error', useStaticFallback);
  };
}
