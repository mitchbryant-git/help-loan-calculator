"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  RotateCcw,
} from 'lucide-react';
import {
  DEFAULT_WAGE_GROWTH,
  CURRENT_INDEXATION_RATE,
} from '../lib/hecsRates';
import { buildProjection } from '../lib/help/projection-engine.mjs';
import PrimaryResult from '../components/help/PrimaryResult';
import PlannerSetup from '../components/help/PlannerSetup';
import ScenarioBuilder from '../components/help/ScenarioBuilder';
import Timeline from '../components/help/Timeline';
import YearTable from '../components/help/YearTable';
import MethodAndSources from '../components/help/MethodAndSources';
import GuideNavigation from '../components/help/GuideNavigation';
import HelpFaq from '../components/help/HelpFaq';
import ShareResult from '../components/help/ShareResult';
import ShareResultsCard from '../components/help/ShareResultsCard';
import HowToUseModal from '../components/help/HowToUseModal';
import HelpHero from '../components/help/HelpHero';

// Helper component to bridge Recharts internal state to React state
const ShareIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

// --- MAIN COMPONENT ---

export default function App() {
  const [inputs, setInputs] = useState({
    startingDebt: 50000,
    startingIncome: 70000,
    indexationRate: CURRENT_INDEXATION_RATE,
    wageGrowth: DEFAULT_WAGE_GROWTH,
    firstYear: 2026,
    startingAge: 22
  });

  const [tempVoluntary, setTempVoluntary] = useState({ year: 2027, amount: 5000 });
  const [tempPromo, setTempPromo] = useState({ year: 2028, percent: 20 });
  const [tempBreak, setTempBreak] = useState({ startYear: 2029, duration: 1 });
  const [tempReduction, setTempReduction] = useState({ year: 2031, percent: 20 });

  const [promotions, setPromotions] = useState([]);
  const [reductions, setReductions] = useState([]);
  const [voluntary, setVoluntary] = useState([]);
  const [breaks, setBreaks] = useState([]);

  const [nudge, setNudge] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  useEffect(() => {
    // These are draft form defaults, synchronised after the user changes the projection start year.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTempVoluntary(prev => ({ ...prev, year: inputs.firstYear + 1 }));
    setTempPromo(prev => ({ ...prev, year: inputs.firstYear + 2 }));
    setTempBreak(prev => ({ ...prev, startYear: inputs.firstYear + 3 }));
    setTempReduction(prev => ({ ...prev, year: inputs.firstYear + 5 }));
  }, [inputs.firstYear]);

  // URL param decode — runs once on mount
  useEffect(() => {
    if (!window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    const safe = (val, fallback, min, max) => {
      const n = parseFloat(val);
      return (!isNaN(n) && n >= min && n <= max) ? n : fallback;
    };
    const overrides = {};
    if (params.has('d')) overrides.startingDebt   = safe(params.get('d'), 50000, 0, 500000);
    if (params.has('i')) overrides.startingIncome  = safe(params.get('i'), 70000, 0, 500000);
    if (params.has('g')) overrides.wageGrowth      = safe(params.get('g'), DEFAULT_WAGE_GROWTH,   0, 10);
    if (params.has('x')) overrides.indexationRate  = safe(params.get('x'), CURRENT_INDEXATION_RATE,   0, 10);
    if (params.has('y')) overrides.firstYear       = safe(params.get('y'), 2026,  2020, 2100);
    if (params.has('a')) overrides.startingAge     = safe(params.get('a'), 22,    15, 80);
    // Hydrate the calculator once from an external shared URL.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (Object.keys(overrides).length) setInputs(prev => ({ ...prev, ...overrides }));
    if (params.has('e')) {
      try {
        const evts = JSON.parse(params.get('e'));
        if (Array.isArray(evts)) {
          const p = evts.filter(e => e.t === 'p').map(e => ({ year: String(e.y), percent: String(e.pct) }));
          const v = evts.filter(e => e.t === 'v').map(e => ({ year: String(e.y), amount: String(e.amt) }));
          const b = evts.filter(e => e.t === 'b').map(e => ({ startYear: String(e.sy), duration: String(e.d) }));
          const r = evts.filter(e => e.t === 'r').map(e => ({ year: String(e.y), percent: String(e.pct) }));
          if (p.length) setPromotions(p);
          if (v.length) setVoluntary(v);
          if (b.length) setBreaks(b);
          if (r.length) setReductions(r);
        }
      } catch { /* ignore malformed events */ }
    }
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  // --- CALCULATION ENGINE ---
  const timelineData = useMemo(() => buildProjection(inputs, {
    promotions,
    reductions,
    voluntary,
    breaks,
  }), [inputs, promotions, reductions, breaks, voluntary]);

  const hasLifeEvents = promotions.length > 0 || reductions.length > 0 || voluntary.length > 0 || breaks.length > 0;

  // Base projection — same engine but no life events, for dual-line chart comparison
  const baseTimelineData = useMemo(
    () => (hasLifeEvents ? buildProjection(inputs) : []),
    [inputs, hasLifeEvents]
  );

  const handleInputChange = (field, rawValue) => {
    if (rawValue === '') {
      setInputs(prev => ({ ...prev, [field]: '' }));
      setNudge(null);
      return;
    }
    let value = rawValue;
    let newNudge = null;

    if (field === 'startingDebt') {
      if (value > 186544) {
        value = 186544;
        newNudge = { field, type: 'warning', msg: "Capped at $129,883 for most, or $186,544 for Medicine & some Aviation courses" };
      } else if (value === 0) {
        newNudge = { field, type: 'info', msg: "Lucky you! Nothing to repay." };
      }
    }
    if (field === 'startingIncome') {
      if (value > 500000) {
        value = 500000;
        newNudge = { field, type: 'warning', msg: "This tool is capped at $500,000." };
      }
    }
    if (field === 'wageGrowth') {
      if (value > 10) {
        value = 10;
        newNudge = { field, type: 'warning', msg: "Capped at 10% (averaged over life). Try 3-4%." };
      }
    }
    if (field === 'indexationRate') {
      if (value > 10) {
        value = 10;
        newNudge = { field, type: 'warning', msg: "Capped at 10%. Try 3-4%." };
      }
    }
    if (field === 'firstYear') {
      if (value.toString().length === 4 && value < 2026) value = 2026;
    }
    if (field === 'startingAge') {
      if (value.toString().length >= 2 && value < 17) value = 17;
    }

    setInputs(prev => ({ ...prev, [field]: value }));
    setNudge(newNudge);
  };

  const handleReset = () => {
    setInputs({
      startingDebt: 50000,
      startingIncome: 70000,
      indexationRate: CURRENT_INDEXATION_RATE,
      wageGrowth: DEFAULT_WAGE_GROWTH,
      firstYear: 2026,
      startingAge: 22
    });
    setPromotions([]);
    setReductions([]);
    setVoluntary([]);
    setBreaks([]);
    setNudge(null);

    // Reset Temp Inputs
    setTempVoluntary({ year: 2027, amount: 5000 });
    setTempPromo({ year: 2028, percent: 20 });
    setTempBreak({ startYear: 2029, duration: 1 });
    setTempReduction({ year: 2031, percent: 20 });
  };

  const finalYear = timelineData.length > 0 ? timelineData[timelineData.length - 1].year : inputs.firstYear;
  const totalPaid = timelineData.reduce((acc, curr) => acc + curr.compulsory + curr.voluntary, 0);
  const totalIndexation = timelineData.reduce((acc, curr) => acc + curr.indexation, 0);
  const isDebtFree = timelineData.length > 0 && timelineData[timelineData.length - 1].endBalance <= 0.01;
  const finalAge = timelineData.length > 0 ? timelineData[timelineData.length - 1].age : inputs.startingAge;

  return (
    <div className="min-h-screen bg-[var(--mb-cream)] pb-20 font-instrument text-[var(--mb-ink)] selection:bg-[var(--mb-mint)] selection:text-[var(--mb-ink)] relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(rgba(16,24,32,0.09) 0.7px, transparent 0.7px)', backgroundSize: '18px 18px' }} />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[var(--mb-paper)]/90 text-[var(--mb-ink)] backdrop-blur-xl" data-nosnippet>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <a
              href="https://www.mitchbryant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#0081CB]/30 border border-white/20 overflow-hidden transition-transform hover:scale-105 active:scale-95"
            >
              <Image
                src="/apple-touch-icon.png"
                alt="MB Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </a>
            <span className="font-impact text-[9px] uppercase leading-tight tracking-[-0.01em] sm:text-[11px] md:text-sm">
              Higher Education Loan<br className="md:hidden" /> Program Calculator
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="btn-soft flex items-center gap-2 text-[var(--mb-ink)]"
              aria-label="Share results"
            >
              <ShareIcon size={18} color="#00A3FF" />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider font-montserrat">Share</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-soft flex items-center gap-2 text-[var(--mb-ink)]"
              aria-label="Reset calculator"
            >
              <RotateCcw size={18} />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider font-montserrat">Reset</span>
            </button>

            {/* HAMBURGER MENU */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(v => !v)}
                className="btn-soft flex items-center justify-center text-[var(--mb-ink)]"
                aria-label="Menu"
              >
                <span style={{ display: 'flex', flexDirection: 'column', gap: 4, width: 16, alignItems: 'center' }}>
                  <span style={{
                    display: 'block', width: 16, height: 1.5, borderRadius: 2,
                    background: 'currentColor',
                    transformOrigin: 'center',
                    transition: 'transform 0.22s ease, opacity 0.22s ease',
                    transform: showMenu ? 'translateY(5.5px) rotate(45deg)' : 'none',
                  }} />
                  <span style={{
                    display: 'block', width: 16, height: 1.5, borderRadius: 2,
                    background: 'currentColor',
                    transition: 'opacity 0.22s ease',
                    opacity: showMenu ? 0 : 1,
                  }} />
                  <span style={{
                    display: 'block', width: 16, height: 1.5, borderRadius: 2,
                    background: 'currentColor',
                    transformOrigin: 'center',
                    transition: 'transform 0.22s ease, opacity 0.22s ease',
                    transform: showMenu ? 'translateY(-5.5px) rotate(-45deg)' : 'none',
                  }} />
                </span>
              </button>

              {showMenu && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                  width: 260,
                  background: '#151B2E',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 8,
                  boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                  zIndex: 200,
                  animation: 'menuFadeIn 0.25s ease forwards',
                }}>
                  <style>{`@keyframes menuFadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

                  {/* GUIDES section */}
                  <div style={{ padding: '12px 12px 6px', fontFamily: 'var(--font-montserrat), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(207,207,207,0.5)' }}>
                    Guides
                  </div>
                  {[
                    { href: '/hecs-repayment-thresholds-2026-27', label: 'HECS Repayment Thresholds 2026-27', emoji: '📊', color: '#0081CB' },
                    { href: '/hecs-indexation-2026', label: 'HECS Indexation 2026', emoji: '📉', color: '#FF9F0A' },
                    { href: '/how-hecs-indexation-works', label: 'How HECS Indexation Works', emoji: '📈', color: '#62FFDA' },
                    { href: '/hecs-debt-and-home-loans', label: 'HECS Debt & Home Loans', emoji: '🏠', color: '#6A3CFF' },
                    { href: '/real-cost-of-starting-uni-before-youre-ready', label: 'The Real Cost of Starting Uni Early', emoji: '🎓', color: '#00A3FF' },
                    { href: '/hecs-help-vs-fee-help', label: 'HECS-HELP vs FEE-HELP', emoji: '⚖️', color: '#8B5CF6' },
                    { href: '/help-borrowing-limit', label: 'The HELP Borrowing Limit 2026', emoji: '💰', color: '#FF9F0A' },
                  ].map(({ href, label, emoji, color }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setShowMenu(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>{emoji}</span>
                      <span style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 13, fontWeight: 700, color: '#F1F5F9', lineHeight: 1.3 }}>{label}</span>
                    </Link>
                  ))}

                  {/* Divider */}
                  <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '6px 12px' }} />

                  {/* MORE section */}
                  <div style={{ padding: '6px 12px 6px', fontFamily: 'var(--font-montserrat), sans-serif', fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(207,207,207,0.5)' }}>
                    More
                  </div>
                  <button
                    onClick={() => { setShowMenu(false); setShowHelpModal(true); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,193,7,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>💡</span>
                    <span style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 13, fontWeight: 400, color: '#CFCFCF' }}>How to Use This Calculator</span>
                  </button>
                  <Link
                    href="/privacy-policy"
                    onClick={() => setShowMenu(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🔒</span>
                    <span style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 13, fontWeight: 400, color: '#CFCFCF' }}>Privacy Policy</span>
                  </Link>
                  <a
                    href="https://www.mitchbryant.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setShowMenu(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(0,163,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🌐</span>
                    <span style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 13, fontWeight: 400, color: '#CFCFCF' }}>mitchbryant.com</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1480px] grid-cols-1 gap-8 px-4 pb-8 pt-5 relative z-10 app-fade-in sm:pt-8">
        <HelpHero onOpenHelp={() => setShowHelpModal(true)} />

        {/* RESPONSIVE PLANNING WORKSPACE
            Mobile: planner → result → timeline → scenarios → share.
            Desktop: planner left, payoff workspace centre, tools right. */}
        <div id="calculator" className="col-span-full grid scroll-mt-28 grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.55fr)_minmax(270px,0.85fr)] lg:items-start">
          <aside className="lg:col-start-1 lg:row-start-1 lg:row-span-2" data-nosnippet>
            <div className="lg:sticky lg:top-28">
              <PlannerSetup inputs={inputs} onInputChange={handleInputChange} nudge={nudge} />
            </div>
          </aside>

          <div className="lg:col-start-2 lg:row-start-1">
            <PrimaryResult
              isDebtFree={isDebtFree}
              finalYear={finalYear}
              firstYear={inputs.firstYear}
              finalAge={finalAge}
              totalPaid={totalPaid}
              totalIndexation={totalIndexation}
            />
          </div>

          <div className="lg:col-start-2 lg:row-start-2">
            <Timeline
              timelineData={timelineData}
              baseTimelineData={baseTimelineData}
              breaks={breaks}
              promotions={promotions}
              reductions={reductions}
              voluntary={voluntary}
              hasLifeEvents={hasLifeEvents}
            />
          </div>

          <aside className="space-y-6 lg:col-start-3 lg:row-start-1 lg:row-span-2" data-nosnippet>
            <ScenarioBuilder
              voluntary={{
                items: voluntary,
                temp: tempVoluntary,
                setTemp: setTempVoluntary,
                add: () => {
                  if (!tempVoluntary.year || !tempVoluntary.amount) return;
                  setVoluntary([...voluntary, { year: tempVoluntary.year, amount: tempVoluntary.amount }]);
                  setTempVoluntary((current) => ({ ...current, year: Number(current.year) + 1 }));
                },
                remove: (index) => setVoluntary(voluntary.filter((_, itemIndex) => itemIndex !== index)),
              }}
              promotion={{
                items: promotions,
                temp: tempPromo,
                setTemp: setTempPromo,
                add: () => {
                  if (!tempPromo.year || !tempPromo.percent) return;
                  setPromotions([...promotions, { year: tempPromo.year, percent: tempPromo.percent }]);
                  setTempPromo((current) => ({ ...current, year: Number(current.year) + 1 }));
                },
                remove: (index) => setPromotions(promotions.filter((_, itemIndex) => itemIndex !== index)),
              }}
              careerBreak={{
                items: breaks,
                temp: tempBreak,
                setTemp: setTempBreak,
                add: () => {
                  if (!tempBreak.startYear || !tempBreak.duration) return;
                  setBreaks([...breaks, { startYear: tempBreak.startYear, duration: tempBreak.duration }]);
                  setTempBreak((current) => ({ ...current, startYear: Number(current.startYear) + Number(current.duration) }));
                },
                remove: (index) => setBreaks(breaks.filter((_, itemIndex) => itemIndex !== index)),
              }}
              reduction={{
                items: reductions,
                temp: tempReduction,
                setTemp: setTempReduction,
                add: () => {
                  if (!tempReduction.year || !tempReduction.percent) return;
                  setReductions([...reductions, { year: tempReduction.year, percent: tempReduction.percent }]);
                  setTempReduction((current) => ({ ...current, year: Number(current.year) + 1 }));
                },
                remove: (index) => setReductions(reductions.filter((_, itemIndex) => itemIndex !== index)),
              }}
            />

            <ShareResultsCard onOpen={() => setShowShareModal(true)} />
          </aside>
        </div>

        <div className="col-span-full space-y-8">
          <YearTable timelineData={timelineData} />

          <GuideNavigation />

          <HelpFaq />

          <MethodAndSources indexationRate={inputs.indexationRate} wageGrowth={inputs.wageGrowth} />

          {/* --- STRUCTURED FOOTER --- */}
          <div className="col-span-full px-0 md:px-4 w-full" style={{ marginTop: 24 }}>
            <div
              className="max-w-[640px] mx-auto px-6 text-[var(--mb-ink)]"
              style={{
                border: '1px solid rgba(16,24,32,0.12)',
                borderRadius: 16,
                background: 'rgba(255,250,241,0.78)',
                paddingTop: 20,
                paddingBottom: 16,
              }}
            >
              {/* Decorative gradient line */}
              <div style={{
                width: '60%', height: 1, margin: '0 auto 20px',
                background: 'linear-gradient(90deg, transparent 0%, var(--mb-sky) 25%, var(--mb-pink) 55%, var(--mb-mint) 85%, transparent 100%)',
                opacity: 0.5,
              }} />

              {/* Link columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-x-8 gap-y-5" style={{ marginBottom: 16 }}>
                {/* Column 1: Guides */}
                <div>
                  <div className="font-impact text-[10px] uppercase tracking-widest text-[var(--mb-muted)]" style={{ marginBottom: 14 }}>Guides</div>
                  {[
                    { href: '/hecs-repayment-thresholds-2026-27', label: 'HECS Repayment Thresholds 2026-27' },
                    { href: '/hecs-indexation-2026', label: 'HECS Indexation 2026' },
                    { href: '/how-hecs-indexation-works', label: 'How HECS Indexation Works' },
                    { href: '/hecs-debt-and-home-loans', label: 'HECS Debt & Home Loans' },
                    { href: '/real-cost-of-starting-uni-before-youre-ready', label: 'The Real Cost of Starting Uni Early' },
                    { href: '/hecs-help-vs-fee-help', label: 'HECS-HELP vs FEE-HELP' },
                    { href: '/help-borrowing-limit', label: 'The HELP Borrowing Limit 2026' },
                  ].map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className="block font-instrument text-[12px] text-[var(--mb-muted)] no-underline hover:text-[var(--mb-sky)] transition-colors"
                      style={{ marginBottom: 10, lineHeight: 1.5 }}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                {/* Column 2: Links + Connect stacked */}
                <div>
                  <div className="font-impact text-[10px] uppercase tracking-widest text-[var(--mb-muted)]" style={{ marginBottom: 14 }}>Links</div>
                  <Link href="/privacy-policy" className="block font-instrument text-[12px] text-[var(--mb-muted)] no-underline hover:text-[var(--mb-sky)] transition-colors" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                    Privacy Policy
                  </Link>
                  <a href="https://www.mitchbryant.com" target="_blank" rel="noopener noreferrer" className="block font-instrument text-[12px] text-[var(--mb-muted)] no-underline hover:text-[var(--mb-sky)] transition-colors" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                    mitchbryant.com
                  </a>

                  <div style={{ marginTop: 24 }}>
                    <div className="font-impact text-[10px] uppercase tracking-widest text-[var(--mb-muted)]" style={{ marginBottom: 14 }}>Connect</div>
                    <a href="https://www.tiktok.com/@itsmitchbryant" target="_blank" rel="noopener noreferrer" className="block font-instrument text-[12px] text-[var(--mb-muted)] no-underline hover:text-[var(--mb-sky)] transition-colors" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                      TikTok @itsmitchbryant
                    </a>
                    <a href="https://www.instagram.com/itsmitchbryant" target="_blank" rel="noopener noreferrer" className="block font-instrument text-[12px] text-[var(--mb-muted)] no-underline hover:text-[var(--mb-sky)] transition-colors" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                      Instagram @itsmitchbryant
                    </a>
                    <a href="mailto:hello@mitchbryant.com" className="flex items-center gap-1.5 font-instrument text-[12px] text-[var(--mb-muted)] no-underline hover:text-[var(--mb-sky)] transition-colors" style={{ marginBottom: 10, lineHeight: 1.5 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                      hello@mitchbryant.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div
                className="text-center pt-4"
                style={{ borderTop: '1px solid rgba(16,24,32,0.10)', marginTop: 8 }}
              >
                <span className="font-instrument text-[11px] text-[var(--mb-muted)]">
                  © 2026 Mitch Bryant · mitchbryant.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ShareResult
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        inputs={inputs}
        promotions={promotions}
        voluntary={voluntary}
        breaks={breaks}
        reductions={reductions}
        timelineData={timelineData}
        totalPaid={totalPaid}
        totalIndexation={totalIndexation}
        isDebtFree={isDebtFree}
        finalYear={finalYear}
        finalAge={finalAge}
      />

      <HowToUseModal open={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
}
