"use client";
import { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  RotateCcw,
  Calendar, ChevronDown, ChevronUp, X, HelpCircle, BookOpen
} from 'lucide-react';
import {
  REPAYMENT_BANDS,
  REPAYMENT_THRESHOLD,
  FINANCIAL_YEAR,
  DEFAULT_WAGE_GROWTH,
  CURRENT_INDEXATION_RATE,
  calculateCompulsoryRepayment,
} from '../lib/hecsRates';
import { buildProjection } from '../lib/help/projection-engine.mjs';
import QuickFigures from '../components/help/QuickFigures';
import PrimaryResult from '../components/help/PrimaryResult';
import PlannerSetup from '../components/help/PlannerSetup';
import ScenarioBuilder from '../components/help/ScenarioBuilder';
import Timeline from '../components/help/Timeline';

const formatCurrency = (val) =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(val);

const formatCurrencyShort = (val) => {
  const n = Math.round(val);
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
};

// --- VISUAL COMPONENTS ---

const InfoTooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8, // 8px buffer above the element
        left: rect.left + rect.width / 2 // Center horizontally
      });
    }
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsVisible(true);
  };

  // Update position on scroll/resize to keep tooltip attached if user scrolls while hovering
  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={triggerRef}
        className="relative inline-flex items-center ml-1.5 align-middle z-10 cursor-help transition-transform hover:scale-110 active:scale-95"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
        onClick={(e) => { e.stopPropagation(); handleMouseEnter(); }}
      >
        {/* Matte by default, glow on hover */}
        <div className="flex items-center justify-center w-3.5 h-3.5 rounded-full border border-[#0081CB] text-[#0081CB] transition-shadow duration-200 shadow-none hover:shadow-[0_0_10px_rgba(0,129,203,0.6)]">
          <span className="text-[10px] font-bold font-serif italic leading-none pt-[1px]">i</span>
        </div>
      </div>

      {isVisible && createPortal(
        <div
          className="fixed z-[9999] w-64 p-4 rounded-xl text-xs text-left leading-relaxed backdrop-blur-xl border animate-in fade-in zoom-in-95 duration-200 pointer-events-none bg-[#0D0D0D]/95 text-[#CFCFCF] border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          style={{
            top: coords.top,
            left: coords.left,
            transform: 'translate(-50%, -100%)'
          }}
        >
          {text}
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0D0D0D]/95"></div>
        </div>,
        document.body
      )}
    </>
  );
};

// 3D/Glass Card Component (Dark Mode Only)
const Card = ({ children, className = "", noPadding = false }) => (
  <div
    className={`rounded-3xl relative overflow-hidden group glass-dark ${className}`}
  >
    {/* Specular Edge (Top Highlight) */}
    <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-70 pointer-events-none" />

    {/* Inner glow */}
    <div className="absolute inset-0 pointer-events-none rounded-3xl border border-white/5" />

    {/* Content Wrapper */}
    <div className={`relative z-10 w-full h-full flex flex-col ${noPadding ? '' : 'p-6'}`}>
      {children}
    </div>
  </div>
);

// Helper component to bridge Recharts internal state to React state
const ShareIcon = ({ size = 18, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
    <polyline points="16 6 12 2 8 6"/>
    <line x1="12" y1="2" x2="12" y2="15"/>
  </svg>
);

const SectionHeader = ({ icon: Icon, title, infoText }) => (
  <div className="flex items-center mb-1">
    <Icon className="text-[#0081CB]" size={20} />
    <h3 className="font-montserrat font-bold uppercase tracking-wider text-sm ml-3 text-white">
      {title}
    </h3>
    {infoText && <InfoTooltip text={infoText} />}
  </div>
);

// --- MAIN COMPONENT ---

export default function App() {
  const [isDesktopViewport, setIsDesktopViewport] = useState(null);
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

  const [showTable, setShowTable] = useState(false);
  const [showFaq, setShowFaq] = useState(true);
  const [openFaqItems, setOpenFaqItems] = useState({});
  const [nudge, setNudge] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const shareCardRef = useRef(null);
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
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateViewport = () => setIsDesktopViewport(mediaQuery.matches);
    updateViewport();
    mediaQuery.addEventListener('change', updateViewport);
    return () => mediaQuery.removeEventListener('change', updateViewport);
  }, []);

  useEffect(() => {
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

  const shareLifeEvents = [
    ...promotions.map(p => ({ type: 'promotion', icon: '📈', label: `+${p.percent}% in ${p.year}` })),
    ...voluntary.map(v => ({ type: 'voluntary', icon: '💸', label: `${formatCurrencyShort(v.amount)} in ${v.year}` })),
    ...breaks.map(b => ({ type: 'gap-year', icon: '✈️', label: `Gap year ${b.startYear}${parseInt(b.duration) > 1 ? ` to ${parseInt(b.startYear) + parseInt(b.duration) - 1}` : ''}` })),
    ...reductions.map(r => ({ type: 'pay-cut', icon: '📉', label: `-${r.percent}% in ${r.year}` })),
  ];
  const shareTotalYears = finalYear - inputs.firstYear;
  const shareDotsData = shareTotalYears > 0 ? [
    ...promotions.map(p => ({ pct: Math.min(96, Math.max(4, (parseInt(p.year) - inputs.firstYear) / shareTotalYears * 100)), color: '#62FFDA' })),
    ...voluntary.map(v => ({ pct: Math.min(96, Math.max(4, (parseInt(v.year) - inputs.firstYear) / shareTotalYears * 100)), color: '#00A3FF' })),
    ...breaks.map(b => ({ pct: Math.min(96, Math.max(4, (parseInt(b.startYear) - inputs.firstYear) / shareTotalYears * 100)), color: '#FFB347' })),
    ...reductions.map(r => ({ pct: Math.min(96, Math.max(4, (parseInt(r.year) - inputs.firstYear) / shareTotalYears * 100)), color: '#FF4D6A' })),
  ] : [];

  const generateShareURL = () => {
    const params = new URLSearchParams();
    params.set('d', String(inputs.startingDebt));
    params.set('i', String(inputs.startingIncome));
    params.set('g', String(inputs.wageGrowth));
    params.set('x', String(inputs.indexationRate));
    params.set('y', String(inputs.firstYear));
    params.set('a', String(inputs.startingAge));
    const evts = [
      ...promotions.map(p => ({ t: 'p', y: parseInt(p.year), pct: parseFloat(p.percent) })),
      ...voluntary.map(v => ({ t: 'v', y: parseInt(v.year), amt: parseFloat(v.amount) })),
      ...breaks.map(b => ({ t: 'b', sy: parseInt(b.startYear), d: parseInt(b.duration) })),
      ...reductions.map(r => ({ t: 'r', y: parseInt(r.year), pct: parseFloat(r.percent) })),
    ];
    if (evts.length) params.set('e', JSON.stringify(evts));
    return `https://helploancalculator.com/?${params.toString()}`;
  };

  const handleShareLink = async () => {
    const url = generateShareURL();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.cssText = 'position:fixed;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setIsLinkCopied(true);
    setShowToast(true);
    setTimeout(() => setIsLinkCopied(false), 2000);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleSaveImage = async () => {
    if (!shareCardRef.current || isSaving) return;
    setIsSaving(true);

    // Temporarily replace gradient text with solid colour for html2canvas
    const headlineEl = shareCardRef.current.querySelector('[data-share-headline]');
    const savedStyles = headlineEl ? {
      background: headlineEl.style.background,
      backgroundClip: headlineEl.style.backgroundClip,
      webkitBackgroundClip: headlineEl.style.webkitBackgroundClip,
      webkitTextFillColor: headlineEl.style.webkitTextFillColor,
      color: headlineEl.style.color,
    } : null;
    if (headlineEl) {
      headlineEl.style.background = 'none';
      headlineEl.style.backgroundClip = 'unset';
      headlineEl.style.webkitBackgroundClip = 'unset';
      headlineEl.style.webkitTextFillColor = 'unset';
      headlineEl.style.color = '#62FFDA';
    }

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#111827',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-help-loan.png';
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to save image:', err);
    } finally {
      // Restore gradient text styles
      if (headlineEl && savedStyles) {
        headlineEl.style.background = savedStyles.background;
        headlineEl.style.backgroundClip = savedStyles.backgroundClip;
        headlineEl.style.webkitBackgroundClip = savedStyles.webkitBackgroundClip;
        headlineEl.style.webkitTextFillColor = savedStyles.webkitTextFillColor;
        headlineEl.style.color = savedStyles.color;
      }
      setIsSaving(false);
    }
  };

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
              <img
                src="/apple-touch-icon.png"
                alt="MB Logo"
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
            >
              <ShareIcon size={18} color="#00A3FF" />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider font-montserrat">Share</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-soft flex items-center gap-2 text-[var(--mb-ink)]"
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

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 app-fade-in">
        {/* SEO: Visually hidden h1 for search engines */}
        <h1 className="sr-only">HELP Loan Calculator | Australian HECS Debt Repayment Calculator</h1>

        {/* LANDING COPY — full-width above both columns on desktop, above inputs on mobile */}
        <div className="col-span-full mb-0">
          <p className="font-anybody text-[18px] font-extrabold leading-tight tracking-[-0.03em] text-[var(--mb-ink)] lg:text-[22px]" style={{ marginBottom: 8 }}>
            Australia's most advanced HECS-HELP<br className="lg:hidden" /> & FEE-HELP repayment calculator.
          </p>
          <p className="max-w-3xl font-instrument text-[13px] leading-relaxed text-[var(--mb-muted)] lg:text-[14px]">
            See how <strong className="font-bold text-[var(--mb-ink)]">indexation, income growth, promotions, career breaks, pay reductions</strong>, and <strong className="font-bold text-[var(--mb-ink)]">extra repayments</strong> affect your student debt over time.<br />
            <span>Built on official 2026-27 repayment settings.</span>
          </p>
        </div>

        <div className="col-span-full mb-0">
          <button
            onClick={() => setShowHelpModal(true)}
            className="group inline-flex cursor-pointer items-center gap-2 font-instrument text-[13px] font-bold text-[var(--mb-ink)] transition-colors"
            style={{
              border: '1px dashed rgba(0,129,203,0.25)',
              background: 'transparent',
              borderRadius: '10px',
              padding: '9px 16px',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,129,203,0.06)'; e.currentTarget.style.borderColor = 'rgba(0,129,203,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(0,129,203,0.25)'; }}
          >
            <span style={{ fontSize: '15px' }}>💡</span>
            How to use this calculator
            <span className="text-[var(--mb-muted)]" style={{ fontSize: '14px' }}>›</span>
          </button>
        </div>

        {/* --- LEFT COLUMN (INPUTS) --- */}
        <div className="lg:col-span-4 space-y-6" data-nosnippet>

          <PlannerSetup inputs={inputs} onInputChange={handleInputChange} nudge={nudge} />

          <div className="lg:hidden">
            <PrimaryResult isDebtFree={isDebtFree} finalYear={finalYear} firstYear={inputs.firstYear} finalAge={finalAge} totalPaid={totalPaid} totalIndexation={totalIndexation} />
          </div>

          <div className="lg:hidden mb-6">
            <QuickFigures income={inputs.startingIncome} />
          </div>

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

          {isDesktopViewport === false ? (
            <div className="lg:hidden mb-6">
              <Timeline timelineData={timelineData} baseTimelineData={baseTimelineData} breaks={breaks} hasLifeEvents={hasLifeEvents} />
            </div>
          ) : null}

          {/* SHARE BUTTON — mobile only, between Pay Cuts and Year by Year */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-black/15 bg-[var(--mb-paper)] px-5 py-3.5 font-impact text-[11px] uppercase tracking-[0.08em] text-[var(--mb-ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mb-sky)]/40 hover:bg-white"
            >
              <ShareIcon size={16} color="#00A3FF" />
              Share my results
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN (OUTPUTS) --- */}
        <div className="lg:col-span-8 space-y-6">

          <div className="hidden lg:block">
            <PrimaryResult isDebtFree={isDebtFree} finalYear={finalYear} firstYear={inputs.firstYear} finalAge={finalAge} totalPaid={totalPaid} totalIndexation={totalIndexation} />
          </div>

          <div className="hidden lg:block">
            <QuickFigures income={inputs.startingIncome} />
          </div>

          {isDesktopViewport === true ? (
            <div className="hidden lg:block">
              <Timeline timelineData={timelineData} baseTimelineData={baseTimelineData} breaks={breaks} hasLifeEvents={hasLifeEvents} />
            </div>
          ) : null}

          {/* SHARE BUTTON — desktop only, between chart and Year by Year */}
          <div className="hidden lg:flex justify-center">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2.5 rounded-2xl border border-black/15 bg-[var(--mb-paper)] px-6 py-3 font-impact text-[11px] uppercase tracking-[0.08em] text-[var(--mb-ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--mb-sky)]/40 hover:bg-white"
            >
              <ShareIcon size={16} color="#00A3FF" />
              Share my results
            </button>
          </div>

          <Card className="overflow-hidden p-0" noPadding={true}>
            <button onClick={() => setShowTable(!showTable)} className="w-full p-6 flex items-center justify-between transition-colors hover:bg-white/5">
              <SectionHeader icon={Calendar} title="Year by Year Breakdown" />
              {showTable ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>
            {showTable && (
              <div className="overflow-x-auto">
                <table className="w-full text-[10px] sm:text-sm text-left font-mono">
                  <thead className="uppercase text-[9px] sm:text-xs font-montserrat bg-white/5 text-[#CFCFCF]">
                    <tr>
                      <th className="px-2 py-3 sm:px-6 sm:py-4">Year</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right">Income</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right">Indexation</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right">Compulsory</th>
                      <th className="px-2 py-3 sm:px-6 sm:py-4 text-right">End Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {timelineData.map((row) => (
                      <tr key={row.year} className={`scanline-row ${row.isBreak ? 'opacity-50 italic' : ''}`}>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 font-bold relative z-10">{row.year}{row.age && <span className="block text-[9px] sm:text-xs font-lato font-normal opacity-60 text-[#CFCFCF]">{row.age} yo</span>}</td>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 text-right relative z-10">
                          {formatCurrency(row.taxableIncome)}
                          {row.notes.length > 0 && (
                            <div className="flex flex-col gap-0.5 mt-1">
                              {row.notes.map((note, i) => {
                                let colorClass = "text-[#0081CB]"; // Default
                                if (note.includes("Promotion")) colorClass = "text-[#62FFDA]";
                                else if (note.includes("Work Break")) colorClass = "text-white";
                                else if (note.includes("Income Drop")) colorClass = "text-[#FF3366]";

                                return (
                                  <div key={i} className={`text-[9px] sm:text-xs font-sans ${colorClass}`}>
                                    {note}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 text-right relative z-10">
                          {row.voluntary > 0 && (
                            <div className="text-[9px] sm:text-xs text-[#6A3CFF] mb-1 font-bold">
                              -{formatCurrency(row.voluntary)}
                            </div>
                          )}
                          {row.indexation > 0 ? <span className="text-[#FF3366]">+{formatCurrency(row.indexation)}</span> : '-'}
                        </td>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 text-[#0081CB] font-bold text-right relative z-10">{row.compulsory > 0 ? `-${formatCurrency(row.compulsory)}` : '-'}</td>
                        <td className="px-2 py-3 sm:px-6 sm:py-4 text-right font-bold text-[#62FFDA] relative z-10">{formatCurrency(row.endBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* GUIDES */}
          <div className="px-4 max-w-3xl mx-auto space-y-4">
            <h4 className="font-impact uppercase tracking-[0.12em] text-[10px] text-[var(--mb-muted)] text-center">Guides</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/hecs-repayment-thresholds-2026-27', title: 'HECS Repayment Thresholds 2026-27' },
                { href: '/hecs-indexation-2026', title: 'HECS Indexation 2026' },
                { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
                { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
                { href: '/real-cost-of-starting-uni-before-youre-ready', title: 'The Real Cost of Starting Uni Early' },
                { href: '/hecs-help-vs-fee-help', title: 'HECS-HELP vs FEE-HELP' },
                { href: '/help-borrowing-limit', title: 'The HELP Borrowing Limit 2026' },
              ].map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group flex items-center gap-3 rounded-xl border border-black/15 bg-[var(--mb-paper)] p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--mb-mint-deep)]/40 hover:bg-white"
                >
                  <BookOpen size={16} className="text-[#0081CB] shrink-0 group-hover:text-[#62FFDA] transition-colors" />
                  <span className="font-instrument text-sm font-semibold text-[var(--mb-ink)] transition-colors">{guide.title}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ SECTION */}
          <Card className="overflow-hidden p-0 max-w-3xl mx-auto" noPadding={true}>
            <button onClick={() => setShowFaq(!showFaq)} className="w-full p-6 flex items-center justify-between transition-colors hover:bg-white/5">
              <SectionHeader icon={HelpCircle} title="Frequently Asked Questions" />
              {showFaq ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>
            <div className={showFaq ? 'px-4 sm:px-6 pb-6' : 'sr-only'}>
              <div className="space-y-2">
                {[
                  {
                    id: 'faq-1',
                    q: "What's the difference between HECS and HELP?",
                    a: (
                      <>
                        <p className="mb-3">HELP (Higher Education Loan Program) is the Australian Government's overarching student loan system. It includes several different loan types:</p>
                        <ul className="list-disc list-inside space-y-1 mb-3 pl-2">
                          <li><strong className="text-white">HECS-HELP</strong>: for students in Commonwealth Supported Places (CSPs), where the government subsidises part of your tuition. This is the most common loan for undergraduate students at public universities.</li>
                          <li><strong className="text-white">FEE-HELP</strong>: for full fee-paying students who aren't in a CSP. Tuition fees are typically higher because there's no government subsidy.</li>
                          <li><strong className="text-white">SA-HELP</strong>: covers your Student Services and Amenities Fee.</li>
                          <li><strong className="text-white">OS-HELP</strong>: helps with costs when studying overseas on exchange.</li>
                        </ul>
                        <p>All of these loans accumulate into a single HELP debt, repaid through the tax system under the same rules. When people say "HECS debt," they're usually referring to their total HELP debt. This calculator works for all HELP loan types. For the full breakdown of each loan type, visit <a href="https://www.studyassist.gov.au/helping-you-understand/how-student-loans-work" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Study Assist: How Student Loans Work</a>.</p>
                      </>
                    ),
                  },
                  {
                    id: 'faq-2',
                    q: 'When do I start repaying my HECS-HELP debt?',
                    a: (
                      <p>You start making compulsory repayments when your repayment income exceeds <strong className="text-white">${REPAYMENT_THRESHOLD.toLocaleString('en-AU')}</strong>. Repayment income includes your taxable income, reportable fringe benefits, net investment losses, and reportable super contributions. Repayments are collected automatically through the tax system: your employer withholds them from your pay if you've told them you have a HELP debt. If you earn below the threshold, you don't repay anything that year, but your debt will still be indexed. For more detail on repayment thresholds and how repayment income is calculated, see the <a href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">ATO's repayment thresholds and rates page</a>.</p>
                    ),
                  },
                  {
                    id: 'faq-3',
                    q: 'Does HECS-HELP have interest?',
                    a: (
                      <p>No. HECS-HELP loans don't charge interest. However, your debt is <strong className="text-white">indexed</strong> each year on 1 June to maintain its value in line with the cost of living. The indexation rate is the lower of CPI (Consumer Price Index) or WPI (Wage Price Index). In 2026, the rate was 2.8%, the lowest since 2021. While it's not called interest, the effect is similar: your balance grows over time. <Link href="/how-hecs-indexation-works" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Learn more about how indexation works →</Link></p>
                    ),
                  },
                  {
                    id: 'faq-4',
                    q: 'How much will my HECS repayments be?',
                    a: (
                      <p>It depends on your income. Under the {FINANCIAL_YEAR} marginal system, you pay nothing on income up to ${REPAYMENT_BANDS[0].max.toLocaleString('en-AU')}, then 15 cents per dollar over that up to ${REPAYMENT_BANDS[1].max.toLocaleString('en-AU')}, increasing through further brackets up to 10% of total income above ${REPAYMENT_BANDS[2].max.toLocaleString('en-AU')}. For example, on an $85,000 salary, your annual repayment would be about {formatCurrency(calculateCompulsoryRepayment(85000))}. <Link href="/hecs-repayment-thresholds-2026-27" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">See the full breakdown →</Link> or enter your details into the calculator above to get your personalised estimate.</p>
                    ),
                  },
                  {
                    id: 'faq-5',
                    q: 'Does my HECS debt affect my home loan?',
                    a: (
                      <p>It can. Lenders factor your HECS repayments into their borrowing capacity assessments, which can reduce how much you're able to borrow. From September 2025, updated APRA guidance allows banks to exclude HECS repayments if the debt will be fully repaid within 12 months, and some lenders like NAB now disregard debts under $20,000. But for most borrowers, a HECS balance will still reduce borrowing power. <Link href="/hecs-debt-and-home-loans" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Read more about HECS and home loans →</Link></p>
                    ),
                  },
                  {
                    id: 'faq-6',
                    q: 'Can I make voluntary repayments to pay off my HECS faster?',
                    a: (
                      <p>Yes. You can make voluntary repayments to the ATO at any time, regardless of your income. There's no longer a discount for doing so (that was removed in 2017), but voluntary repayments directly reduce your balance, which means less indexation is applied each year. You can model the impact of voluntary repayments using this calculator to see how they shorten your repayment timeline. For instructions on how to make a voluntary repayment, visit the <a href="https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/repaying-your-loan" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">ATO's HELP repayment page</a>.</p>
                    ),
                  },
                  {
                    id: 'faq-7',
                    q: 'How do I check my HECS-HELP balance?',
                    a: (
                      <p>Log in to <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">myGov</a>, link to the Australian Taxation Office (ATO) if you haven't already, and your HELP debt balance will be visible under your account. You can also see a breakdown of how much has been indexed and how much you've repaid.</p>
                    ),
                  },
                  {
                    id: 'faq-8',
                    q: "What happens to my HECS debt if I don't finish my degree?",
                    a: (
                      <p>Your debt doesn't disappear. Any HECS-HELP fees that were charged before you withdrew remain on your balance. They'll be indexed every year and you'll repay them through the tax system once your income is above the threshold, whether you have a degree or not. <Link href="/real-cost-of-starting-uni-before-youre-ready" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">See what this costs in real terms →</Link></p>
                    ),
                  },
                  {
                    id: 'faq-9',
                    q: 'What happens to my HECS debt if I move overseas?',
                    a: (
                      <p>You're still required to repay it. If you move overseas and your worldwide income exceeds the repayment threshold, you must report your income to the ATO and make repayments. The ATO requires Australian residents living abroad to submit an overseas income declaration annually. Non-compliance can result in penalties. For full details on your obligations, see the <a href="https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/repaying-your-loan/repaying-your-loan-overseas" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">ATO's overseas repayment guide</a>.</p>
                    ),
                  },
                  {
                    id: 'faq-10',
                    q: 'Is HECS-HELP debt written off when you die?',
                    a: (
                      <p>Yes. HECS-HELP debt is automatically written off upon death and is not passed on to family members or your estate. This is outlined on the <a href="https://www.studyassist.gov.au/managing-and-repaying-your-loan/loan-repayments" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Study Assist: loan repayments page</a>.</p>
                    ),
                  },
                ].map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.03] overflow-hidden">
                    <button
                      onClick={() => setOpenFaqItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="w-full p-4 flex items-center justify-between text-left transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="text-sm font-medium text-[#CFCFCF] pr-4 font-lato">{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#CFCFCF]/50 shrink-0 transition-transform duration-200 ${openFaqItems[item.id] ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div className={openFaqItems[item.id] ? 'px-4 pb-4' : 'sr-only'}>
                      <div className="text-sm text-[#CFCFCF]/80 leading-relaxed font-lato">
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* DISCLAIMER / FOOTER */}
          <div className="mx-auto max-w-3xl space-y-4 px-4 text-center font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">
            <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70">DISCLAIMER</h4>
            <p>
              This tool is for educational purposes only. It is not personal financial, legal, or tax advice and does not take into account your individual objectives. The model estimates compulsory repayments using the {FINANCIAL_YEAR} marginal repayment system and assumes these thresholds remain constant. Actual repayments are determined by the ATO after you lodge your tax return.
            </p>

            <div className="glass-dark mx-auto my-6 max-w-lg overflow-hidden rounded-xl border border-white/10 text-white">
              <div className="grid grid-cols-2 text-[10px] font-bold uppercase p-3 border-b border-[#333] bg-white/5">
                <div className="text-left">Repayment Income</div>
                <div className="text-right">Rate / Calculation</div>
              </div>
              {REPAYMENT_BANDS.map((band, i, arr) => (
                <div key={band.id} className={`grid grid-cols-2 text-[11px] p-3 ${i < arr.length - 1 ? 'border-b border-[#333]' : ''}`}>
                  <div className="text-left font-mono text-[#CFCFCF]">{band.rangeLabel}</div>
                  <div className="text-right text-[#CFCFCF]">{band.calcLabel}</div>
                </div>
              ))}
            </div>

            <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70 mt-6">LIMITATION OF LIABILITY</h4>
            <p>
              To the extent permitted by law, we accept no responsibility for any loss arising from reliance on this tool. You should verify figures with the ATO and seek independent professional advice before making decisions.
            </p>

          </div>

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
                background: 'linear-gradient(90deg, transparent 0%, #0081CB 25%, #6A3CFF 55%, #62FFDA 85%, transparent 100%)',
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
                  © 2025 Mitch Bryant · mitchbryant.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- SHARE MODAL --- */}
      {showShareModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto py-6 px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="w-full animate-in fade-in zoom-in-95 duration-300"
            style={{ maxWidth: 440, animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* ── RESULTS CARD ── */}
            <div ref={shareCardRef} style={{ background: '#111827', borderRadius: 24, overflow: 'hidden', position: 'relative', boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.5)', maxWidth: 390, margin: '0 auto' }}>
              {/* Ambient glow */}
              <div style={{ position: 'absolute', top: '-60%', left: '-30%', width: '160%', height: '160%', background: 'radial-gradient(ellipse at 30% 20%, rgba(0,129,203,0.12) 0%, rgba(106,60,255,0.06) 40%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

              {/* Close button */}
              <button
                onClick={() => setShowShareModal(false)}
                style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(241,245,249,0.35)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(241,245,249,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(241,245,249,0.35)'; }}
                aria-label="Close"
              >
                <X size={16} strokeWidth={2} />
              </button>

              <div style={{ position: 'relative', zIndex: 1, padding: '28px 24px 28px' }}>

                {/* Header */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:60ms]"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/apple-touch-icon.png" alt="MB Logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', display: 'block' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(241,245,249,0.55)', letterSpacing: 0.5, fontFamily: 'var(--font-montserrat), sans-serif' }}>HELP Loan Calculator</div>
                  </div>
                  <div style={{ background: 'rgba(98,255,218,0.08)', border: '1px solid rgba(98,255,218,0.2)', color: '#62FFDA', fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 20, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'var(--font-montserrat), sans-serif', textAlign: 'center', lineHeight: '1', display: 'inline-flex', alignItems: 'center', marginRight: 36 }}>{FINANCIAL_YEAR}</div>
                </div>

                {/* Headline stat */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:120ms]"
                  style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10, fontFamily: 'var(--font-montserrat), sans-serif' }}>Your degree will actually cost</div>
                  <div data-share-headline="true" style={{ fontFamily: 'var(--font-geist-mono, ui-monospace, monospace)', fontSize: 52, fontWeight: 700, background: 'linear-gradient(135deg, #F1F5F9 0%, #00A3FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, marginBottom: 12 }}>
                    {isDebtFree ? formatCurrency(totalPaid) : '50+ yrs'}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(241,245,249,0.55)', fontFamily: 'var(--font-lato), sans-serif' }}>
                    {isDebtFree
                      ? <><>Debt free by </><strong style={{ color: '#F1F5F9', fontWeight: 700 }}>{finalYear}</strong><> · age </><strong style={{ color: '#F1F5F9', fontWeight: 700 }}>{finalAge}</strong></>
                      : <span style={{ color: '#FF4D6A' }}>Loan not cleared in 50 years</span>}
                  </div>
                </div>

                {/* Equation bar */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:180ms]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24, fontFamily: 'var(--font-geist-mono, ui-monospace, monospace)', fontSize: 13, fontWeight: 500 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#F1F5F9' }}>{formatCurrencyShort(inputs.startingDebt)}</div>
                    <div style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Debt</div>
                  </div>
                  <div style={{ color: 'rgba(241,245,249,0.35)', fontSize: 16, lineHeight: 1, alignSelf: 'center' }}>+</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#FF4D6A', fontWeight: 700 }}>{formatCurrencyShort(totalIndexation)}</div>
                    <div style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Indexation</div>
                  </div>
                  <div style={{ color: 'rgba(241,245,249,0.35)', fontSize: 16, lineHeight: 1, alignSelf: 'center' }}>=</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#F1F5F9' }}>{formatCurrencyShort(totalPaid)}</div>
                    <div style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Total paid</div>
                  </div>
                  <div style={{ color: 'rgba(241,245,249,0.35)', fontSize: 11, fontFamily: 'var(--font-lato), sans-serif', letterSpacing: 0.5, alignSelf: 'center' }}>over</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#F1F5F9' }}>{isDebtFree ? `${timelineData.length} yrs` : '50+ yrs'}</div>
                    <div style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Timeline</div>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:240ms]"
                  style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 14, marginBottom: 24 }}>
                  {[
                    { label: 'Years', value: isDebtFree ? String(timelineData.length) : '50+', color: '#F1F5F9', unit: 'to pay off' },
                    { label: 'Indexation', value: formatCurrencyShort(totalIndexation), color: '#FF4D6A', unit: 'added to debt' },
                    { label: 'Start salary', value: formatCurrencyShort(inputs.startingIncome), color: '#0081CB', unit: 'annual' },
                  ].map((stat, i, arr) => (
                    <div key={i} style={{
                      background: '#111827',
                      padding: '16px 10px',
                      textAlign: 'center',
                      borderRadius: i === 0 ? '14px 0 0 14px' : i === arr.length - 1 ? '0 14px 14px 0' : 0,
                    }}>
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 7, fontFamily: 'var(--font-montserrat), sans-serif', whiteSpace: 'nowrap' }}>{stat.label}</div>
                      <div style={{ fontFamily: 'var(--font-geist-mono, ui-monospace, monospace)', fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 10, color: 'rgba(241,245,249,0.55)', marginTop: 4 }}>{stat.unit}</div>
                    </div>
                  ))}
                </div>

                {/* Life event pills — only if events exist */}
                {shareLifeEvents.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:300ms]"
                    style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10, fontFamily: 'var(--font-montserrat), sans-serif' }}>Life events modelled</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {shareLifeEvents.map((ev, i) => {
                        const palette = {
                          promotion: { color: '#62FFDA', border: 'rgba(98,255,218,0.2)', bg: 'rgba(98,255,218,0.05)' },
                          voluntary: { color: '#00A3FF', border: 'rgba(0,163,255,0.2)', bg: 'rgba(0,163,255,0.05)' },
                          'gap-year': { color: '#FFB347', border: 'rgba(255,179,71,0.2)', bg: 'rgba(255,179,71,0.05)' },
                          'pay-cut': { color: '#FF4D6A', border: 'rgba(255,77,106,0.2)', bg: 'rgba(255,77,106,0.05)' },
                        };
                        const c = palette[ev.type] || { color: 'rgba(241,245,249,0.55)', border: 'rgba(255,255,255,0.08)', bg: 'rgba(255,255,255,0.04)' };
                        return (
                          <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: c.color, fontFamily: 'var(--font-lato), sans-serif' }}>
                            <span style={{ fontSize: 12, lineHeight: 1 }}>{ev.icon}</span>
                            {ev.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mini timeline */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:360ms]"
                  style={{ marginBottom: 24 }}>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'visible', position: 'relative' }}>
                    <div style={{ height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #0081CB, #6A3CFF, #62FFDA)', width: '100%', position: 'relative' }}>
                      {shareDotsData.map((dot, i) => (
                        <div key={i} style={{ position: 'absolute', top: '50%', left: `${dot.pct}%`, transform: 'translate(-50%, -50%)', width: 11, height: 11, borderRadius: '50%', background: dot.color, border: '2px solid #111827', zIndex: 2 }} />
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(241,245,249,0.35)', fontFamily: 'var(--font-lato), sans-serif' }}>{inputs.firstYear}{inputs.startingAge ? ` · ${inputs.startingAge}yo` : ''}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#62FFDA', fontFamily: 'var(--font-lato), sans-serif' }}>{isDebtFree ? `${finalYear} · Debt free ✓` : 'Not cleared in 50 yrs'}</div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:420ms]"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontFamily: 'var(--font-lato), sans-serif', fontSize: 12, fontWeight: 600, color: 'rgba(241,245,249,0.35)' }}>
                    Calculate yours →{' '}<span style={{ color: '#00A3FF', fontWeight: 700 }}>helploancalculator.com</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: 12, fontWeight: 700, color: 'rgba(241,245,249,0.55)' }}>@itsmitchbryant</div>
                </div>

              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {/* Share / Copy Link */}
              <button
                onClick={handleShareLink}
                className="flex-1 flex items-center justify-center gap-2 font-montserrat font-bold text-[15px] text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #0081CB, #6A3CFF)', border: 'none', borderRadius: 14, padding: '14px 28px', boxShadow: '0 4px 24px rgba(0,129,203,0.3)', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,129,203,0.45)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,129,203,0.3)'; }}
              >
                {isLinkCopied ? (
                  <>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Link Copied!
                  </>
                ) : (
                  <>
                    <ShareIcon size={18} color="white" />
                    Share
                  </>
                )}
              </button>

              {/* Save */}
              <button
                onClick={handleSaveImage}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 font-montserrat font-bold text-[15px] text-white transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 28px', cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                onMouseEnter={e => { if (!isSaving) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {isSaving ? 'Saving…' : 'Save'}
              </button>
            </div>

            {/* ── TOAST ── */}
            {showToast && (
              <div className="animate-in fade-in duration-200 text-center mt-3 font-lato font-semibold text-[13px]" style={{ color: 'rgba(241,245,249,0.55)' }}>
                ✓ Link copied to clipboard
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- HELP MODAL --- */}
      {showHelpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl p-8 relative border shadow-2xl glass-dark max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowHelpModal(false)} className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white"><X size={20} /></button>

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-montserrat text-white">
              <HelpCircle className="text-[#0081CB]" size={24} />
              How To Use This Calculator
            </h3>

            <div className="space-y-5 text-sm font-lato text-[#CFCFCF]">
              <div>
                <h4 className="font-bold text-[#0081CB] mb-1 font-montserrat">Step 1: Input Your Financial Data</h4>
                <p>Enter your starting debt, income, growth projections, first year, and age.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#6A3CFF] mb-1 font-montserrat">Step 2: View Projected Summary</h4>
                <p>Review your estimated time to pay off and total costs.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#62FFDA] mb-1 font-montserrat">Step 3: Analyse Repayment Timeline</h4>
                <p>Use the chart to visualise your loan balance changing year by year.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0081CB] mb-1 font-montserrat">Step 4: Explore Voluntary Contributions</h4>
                <p>Visualise how extra repayments can shorten your timeline.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#6A3CFF] mb-1 font-montserrat">Step 5: Incorporate Life Events</h4>
                <p>Factor in potential income changes or pauses. Use Promotions, Gap Years, and Pay Cuts to see how real life affects your loan.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#62FFDA] mb-1 font-montserrat">Step 6: Review Year By Year Breakdown</h4>
                <p>Examine the annual impact of indexation and compulsory repayments using the dropdown to show the full table.</p>
              </div>
            </div>

            <button onClick={() => setShowHelpModal(false)} className="w-full mt-8 btn-3d-primary py-4 text-white font-bold tracking-wide">
              <span>Got it!</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
