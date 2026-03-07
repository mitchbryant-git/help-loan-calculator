"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea
} from 'recharts';
import {
  Info, RotateCcw, TrendingUp, TrendingDown,
  PauseCircle, DollarSign, Calendar, ChevronDown, ChevronUp, AlertCircle, X, Wallet, HelpCircle, Trash2, BookOpen
} from 'lucide-react';

// --- BRAND OS THEME CONSTANTS ---
const THEME = {
  colors: {
    primaryBlue: '#0081CB',
    coachViolet: '#6A3CFF',
    mintAccent: '#62FFDA',
    darkBase: '#0D0D0D',
    softSilver: '#CFCFCF',
    negativeRed: '#FF3366',
    offWhite: '#FAFAFA',
  }
};

// --- REPAYMENT LOGIC (2025-2026) ---
const calculateCompulsoryRepayment = (income) => {
  if (income <= 67000) {
    return 0;
  } else if (income <= 125000) {
    return (income - 67000) * 0.15;
  } else if (income <= 179285) {
    return 8700 + ((income - 125000) * 0.17);
  } else {
    return income * 0.10;
  }
};

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
const ChartTooltipSyncer = ({ active, payload, onUpdate }) => {
  useEffect(() => {
    if (active && payload && payload.length) {
      onUpdate(payload[0].payload);
    }
  }, [active, payload, onUpdate]);



  return null;

  return null;
};

// --- SCI-FI HUD CHART SECTION ---

// --- MEMOIZED COMPONENTS ---

// 1. Memoized Custom Dot
const MemoizedCustomDot = React.memo((props) => {
  const { cx, cy, payload } = props;
  const hasPromo = payload.notes.some(n => n.includes('Promotion'));
  const hasPayCut = payload.notes.some(n => n.includes('Income Drop'));
  const hasVoluntary = payload.voluntary > 0;

  if (hasPayCut) {
    return (
      <svg x={cx - 8} y={cy - 8} width={16} height={16} viewBox="0 0 24 24" fill="#FF3366" stroke="#0D0D0D" strokeWidth={2} style={{ overflow: 'visible' }}>
        <path d="M12 21L2 4h20L12 21z" />
      </svg>
    );
  }

  if (hasPromo) {
    return (
      <svg x={cx - 8} y={cy - 8} width={16} height={16} viewBox="0 0 24 24" fill="#62FFDA" stroke="#0D0D0D" strokeWidth={2} style={{ overflow: 'visible' }}>
        <path d="M12 2L2 12l10 10 10-10L12 2z" />
      </svg>
    );
  }

  if (hasVoluntary) {
    return (
      <svg x={cx - 8} y={cy - 8} width={16} height={16} viewBox="0 0 24 24" fill="#6A3CFF" stroke="#0D0D0D" strokeWidth={2} style={{ overflow: 'visible' }}>
        <rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)" />
      </svg>
    );
  }

  return null;
});
MemoizedCustomDot.displayName = 'MemoizedCustomDot';

// 2. Memoized Chart Component
const MemoizedChart = React.memo(({ timelineData, breaks, onHover, onLeave }) => {
  return (
    <div className="flex-1 w-full min-h-0 relative [&_*]:focus:outline-none [&_*]:focus:ring-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          throttleDelay={0}
          data={timelineData}
          margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
          onMouseMove={(e) => {
            // No-op or custom logic if needed
          }}
          onMouseLeave={onLeave}
        >
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#62FFDA" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#62FFDA" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} strokeOpacity={0.4} />
          <XAxis dataKey="year" stroke="#666" tick={{ fontSize: 12, fill: '#CFCFCF', opacity: 0.7 }} tickLine={false} axisLine={false} />
          <YAxis stroke="#666" tick={{ fontSize: 12, fill: '#CFCFCF', opacity: 0.7 }} tickFormatter={(val) => `$${val / 1000}k`} tickLine={false} axisLine={false} />

          <Tooltip
            animationDuration={0}
            content={<ChartTooltipSyncer onUpdate={onHover} />}
            cursor={{
              stroke: '#62FFDA',
              strokeWidth: 2,
              strokeDasharray: '0',
              filter: 'drop-shadow(0 0 4px #62FFDA)'
            }}
          />

          {/* Glow Layer */}
          <Area
            type="monotone"
            dataKey="endBalance"
            stroke="#62FFDA"
            strokeWidth={10}
            strokeOpacity={0.15}
            fill="transparent"
            isAnimationActive={false}
            pointerEvents="none"
          />

          {/* Main Line Layer */}
          <Area
            type="monotone"
            dataKey="endBalance"
            stroke="#62FFDA"
            strokeWidth={3}
            fill="url(#colorBalance)"
            dot={<MemoizedCustomDot />}
            activeDot={{
              r: 6,
              fill: '#fff',
              stroke: '#62FFDA',
              strokeWidth: 3,
              className: "animate-pulse",
              style: { filter: 'drop-shadow(0 0 8px #62FFDA)' }
            }}
          />

          {breaks.map((b, i) => (
            <ReferenceArea
              key={i}
              x1={parseInt(b.startYear)}
              x2={parseInt(b.startYear) + parseInt(b.duration)}
              fill="#fff"
              fillOpacity={0.03}
              pointerEvents="none"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if data or breaks change. Ignore function prop changes if they are stable.
  return (
    prevProps.timelineData === nextProps.timelineData &&
    prevProps.breaks === nextProps.breaks
  );
});
MemoizedChart.displayName = 'MemoizedChart';
const ChartSection = ({ mode, timelineData, breaks }) => {
  const [hoveredData, setHoveredData] = useState(null);
  const rafRef = useRef(null);

  // Stable callback with RAF Throttling
  const handleHoverUpdate = useCallback((data) => {
    if (rafRef.current) return; // Drop frame if one is pending
    rafRef.current = requestAnimationFrame(() => {
      setHoveredData(data);
      rafRef.current = null;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setHoveredData(null);
  }, []);

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Determine which data to show: hoveredData (live) OR the final year (summary)
  const displayData = useMemo(() => {
    if (hoveredData) return hoveredData;
    // Default to final year if available
    if (timelineData && timelineData.length > 0) return timelineData[timelineData.length - 1];
    return null;
  }, [hoveredData, timelineData]);

  if (!displayData) return null;

  const totalRepayment = (displayData.compulsory || 0) + (displayData.voluntary || 0);
  const hasVoluntary = displayData.voluntary > 0;

  return (
    // Fixed height h-[450px]
    <Card
      className="h-[450px] relative card-hover flex flex-col outline-none ring-0 touch-pan-y"
      style={{ WebkitTapHighlightColor: 'transparent' }}
      mode={mode}
    >
      {/* HUD Decoration Corners */}
      <div className="absolute top-4 left-4 w-2 h-2 border-l border-t border-[#62FFDA]/30 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-4 right-4 w-2 h-2 border-r border-t border-[#62FFDA]/30 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-2 h-2 border-l border-b border-[#62FFDA]/30 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-2 h-2 border-r border-b border-[#62FFDA]/30 rounded-br-sm pointer-events-none" />

      {/* --- HUD HEADER & READOUT --- */}
      <div className="flex flex-col gap-4 mb-2 shrink-0 z-20">
        <div className="flex items-center justify-between pl-2">
          <SectionHeader icon={TrendingUp} title="REPAYMENT TIMELINE" mode={mode} />
          {/* Status Indicator */}
          <div className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${hoveredData ? 'text-[#62FFDA] border-[#62FFDA]/30 bg-[#62FFDA]/5' : 'text-[#CFCFCF] border-white/10'}`}>
            {hoveredData ? 'LIVE TRACKING' : 'FINAL YEAR'}
          </div>
        </div>


        {/* --- THE DIGITAL READOUT --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 rounded-xl border transition-colors duration-200 bg-black/20 border-white/5">

          {/* Year / Age */}
          <div className="flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider text-[#CFCFCF] font-bold mb-0.5">Timeline</span>
            <div className="font-mono text-lg font-bold flex items-baseline gap-2 text-white">
              {displayData.year} <span className="text-xs opacity-50 font-sans">Age {displayData.age}</span>
            </div>
          </div>

          {/* Income */}
          <div className="flex flex-col justify-center border-l border-white/5 pl-4">
            <span className="text-[10px] uppercase tracking-wider text-[#CFCFCF] font-bold mb-0.5">Income</span>
            <div className="font-mono text-lg font-bold text-white">
              {formatCurrency(displayData.taxableIncome)}
            </div>
          </div>

          {/* Repayments - Split View if Voluntary Exists */}
          <div className="flex flex-col justify-center border-l border-white/5 pl-4 relative">
            <span className="text-[10px] uppercase tracking-wider text-[#0081CB] font-bold mb-0.5">Repayment</span>

            {/* FIXED HEIGHT CONTAINER TO PREVENT LAYOUT SHIFT & CHART RE-RENDER */}
            <div className="h-[32px] flex flex-col justify-center">
              {hasVoluntary ? (
                <div className="flex flex-col w-full">
                  <div className="flex justify-between items-baseline w-full">
                    <span className="text-[10px] font-mono text-[#0081CB] opacity-80 mr-2">Compulsory:</span>
                    <span className="font-mono text-xs font-bold text-[#0081CB]">{formatCurrency(displayData.compulsory)}</span>
                  </div>
                  <div className="flex justify-between items-baseline w-full">
                    <span className="text-[10px] font-mono text-[#6A3CFF] opacity-80 mr-2">Voluntary:</span>
                    <span className="font-mono text-xs font-bold text-[#6A3CFF]">{formatCurrency(displayData.voluntary)}</span>
                  </div>
                </div>
              ) : (
                <div className="font-mono text-lg font-bold text-[#0081CB]">
                  {formatCurrency(totalRepayment)}
                </div>
              )}
            </div>
          </div>

          {/* Balance */}
          <div className="flex flex-col justify-center border-l border-white/5 pl-4">
            <span className="text-[10px] uppercase tracking-wider text-[#62FFDA] font-bold mb-0.5">Balance</span>
            <div className="font-mono text-xl font-black text-[#62FFDA] drop-shadow-[0_0_8px_rgba(98,255,218,0.4)]">
              {formatCurrency(displayData.endBalance)}
            </div>
          </div>

        </div>
      </div>

      {/* --- CHART VISUALS --- */}
      <MemoizedChart
        timelineData={timelineData}
        breaks={breaks}
        onHover={handleHoverUpdate}
        onLeave={handleMouseLeave}
      />

    </Card >
  );
};



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
    <h3 className="font-['Montserrat'] font-bold uppercase tracking-wider text-sm ml-3 text-white">
      {title}
    </h3>
    {infoText && <InfoTooltip text={infoText} />}
  </div>
);

// --- NEON SLIDER ---
const NeonSlider = ({ label, value, onChange, min, max, step, unit, color, infoText }) => {
  const [isActive, setIsActive] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const debounceTimerRef = useRef(null);

  // Sync local value when prop changes (e.g., from external updates like reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const percent = ((localValue - min) / (max - min)) * 100;

  const handleChange = (newValue) => {
    // Update local state immediately for smooth visual feedback
    setLocalValue(newValue);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual state update by 150ms
    debounceTimerRef.current = setTimeout(() => {
      onChange(newValue);
    }, 150);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <label className="block text-xs font-bold uppercase tracking-wide font-['Montserrat'] text-[#CFCFCF]">
            {label}
          </label>
          {infoText && <InfoTooltip text={infoText} />}
        </div>
        <div className="font-mono font-bold text-lg text-white">
          {localValue}{unit}
        </div>
      </div>

      <div className="relative h-6 w-full flex items-center group" style={{ touchAction: 'pan-y' }}>
        <div className="absolute top-1/2 left-0 w-full h-1.5 -translate-y-1/2 rounded-full transition-colors bg-gray-800"></div>

        <div
          className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 rounded-full transition-all duration-100 ease-out"
          style={{
            width: `${percent}%`,
            background: color,
            boxShadow: isActive ? `0 0 12px ${color}` : 'none'
          }}
        ></div>

        <div
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 -ml-2 rounded-full border-2 border-white pointer-events-none transition-all duration-100 ease-out ${isActive ? 'scale-110' : 'scale-100'}`}
          style={{
            left: `${percent}%`,
            backgroundColor: color,
            boxShadow: isActive ? `0 0 15px 2px ${color}` : 'none'
          }}
        ></div>

        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={(e) => handleChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          onTouchStart={() => setIsActive(true)}
          onTouchEnd={() => setIsActive(false)}
          style={{ touchAction: 'none' }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label={`${label} slider`}
          aria-valuetext={`${localValue}${unit}`}
          aria-valuenow={localValue}
          aria-valuemin={min}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

// HUD Input Field
const InputField = ({ label, value, onChange, unit, type = "number", step = 1, infoText, nudge }) => (
  <div className="mb-5">
    <div className="flex items-center mb-2">
      <label className="block text-xs font-bold uppercase tracking-wide font-['Montserrat'] text-[#CFCFCF]">
        {label}
      </label>
      {infoText && <InfoTooltip text={infoText} />}
    </div>
    <div className="relative group">
      <input
        type={type}
        value={value}
        onChange={(e) => {
          const val = e.target.value;
          onChange(val === '' ? '' : parseFloat(val));
        }}
        className="w-full p-3.5 input-hud font-mono text-lg outline-none transition-all text-white placeholder-gray-600"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CFCFCF] font-bold pointer-events-none opacity-50">
          {unit}
        </span>
      )}
    </div>
    {nudge && (
      <div className={`mt-2 text-xs flex items-start gap-2 p-3 rounded-xl animate-in fade-in slide-in-from-top-1 backdrop-blur-md 
        ${nudge.type === 'info'
          ? 'bg-[#0081CB]/10 text-[#0081CB] border border-[#0081CB]/20'
          : 'bg-[#FF3366]/10 text-[#FF3366] border border-[#FF3366]/20'}`}>
        <Info size={14} className="shrink-0 mt-0.5" />
        <span className="font-medium">{nudge.msg}</span>
      </div>
    )}
  </div>
);

// Hero Section
const HeroSection = ({ isDebtFree, finalYear, firstYear, finalAge, totalPaid, totalIndexation }) => (
  <div className="relative rounded-[28px] overflow-hidden shadow-2xl mb-6 lg:mb-0 group min-h-[220px] h-auto">
    <div className="absolute inset-0 bg-gradient-to-r from-[#0081CB] to-[#6A3CFF] opacity-100 transition-transform duration-1000 group-hover:scale-105"
      style={{ background: 'linear-gradient(110deg, #0081CB 0%, #6A3CFF 100%)' }}></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
    <div className="relative p-6 sm:p-8 text-white h-full flex flex-col justify-between">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 mb-2 font-['Montserrat']">Loan Paid Off In</h2>
          <div
            key={`${isDebtFree}-${finalYear}-${firstYear}`}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter font-['Montserrat'] pulse-stat drop-shadow-xl"
          >
            {isDebtFree ? `${finalYear - firstYear + 1} Years` : '50+ Years'}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 font-medium opacity-90">
            {isDebtFree ? (
              <>
                <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-sm font-['Lato'] backdrop-blur-md">Debt Free in {finalYear}</span>
                {finalAge && <span className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-lg text-sm font-['Lato'] backdrop-blur-md">Age: {finalAge}</span>}
              </>
            ) : (
              <span className="text-[#FF3366] bg-black/40 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-[#FF3366]/30 backdrop-blur-md"><AlertCircle size={16} /> Loan not cleared in 50 years</span>
            )}
          </div>
        </div>
        <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-2xl p-5 w-full md:w-auto min-w-[200px] shadow-lg mt-2 md:mt-0">
          <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1 font-['Montserrat']">Total Repaid</div>
          <div className="text-2xl font-bold text-[#62FFDA] font-mono">{formatCurrency(totalPaid)}</div>
          <div className="w-full h-px bg-white/10 my-3"></div>
          <div className="text-[10px] uppercase tracking-wider opacity-70 mb-1 font-['Montserrat']">Total Indexation</div>
          <div className="text-2xl font-bold text-[#FF3366] font-mono">{formatCurrency(totalIndexation)}</div>
        </div>
      </div>
    </div>
  </div>
);

// --- MAIN COMPONENT ---

export default function App() {
  const [mode, setMode] = useState('dark');
  const [inputs, setInputs] = useState({
    startingDebt: 50000,
    startingIncome: 70000,
    indexationRate: 3.0,
    wageGrowth: 3.5,
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

  // Collapse State for Action Cards
  const [showVoluntary, setShowVoluntary] = useState(true);
  const [showPromotions, setShowPromotions] = useState(true);
  const [showBreaks, setShowBreaks] = useState(true);
  const [showReductions, setShowReductions] = useState(true);

  const [showTable, setShowTable] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  const [openFaqItems, setOpenFaqItems] = useState({});
  const [nudge, setNudge] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const shareCardRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setMode(savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

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
    if (params.has('g')) overrides.wageGrowth      = safe(params.get('g'), 3.5,   0, 10);
    if (params.has('x')) overrides.indexationRate  = safe(params.get('x'), 3.0,   0, 10);
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
      } catch (_) { /* ignore malformed events */ }
    }
    window.history.replaceState({}, '', window.location.pathname);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- CALCULATION ENGINE ---
  const timelineData = useMemo(() => {
    let data = [];
    let balance = Number(inputs.startingDebt) || 0;
    let baselineIncome = Number(inputs.startingIncome) || 0;
    let currentYear = Number(inputs.firstYear) || 2026;
    const safeWageGrowth = Number(inputs.wageGrowth) || 0;
    const safeIndexation = Number(inputs.indexationRate) || 0;
    const startAge = Number(inputs.startingAge) || 22;

    let isPaidOff = false;
    const maxYears = 50;
    let yearsElapsed = 0;

    if (balance <= 0) isPaidOff = true;

    while (!isPaidOff && yearsElapsed < maxYears) {
      const yearData = {
        year: currentYear,
        age: startAge ? startAge + yearsElapsed : null,
        baselineIncome: baselineIncome,
        taxableIncome: baselineIncome,
        compulsory: 0,
        voluntary: 0,
        indexation: 0,
        startBalance: balance,
        endBalance: 0,
        isBreak: false,
        notes: []
      };

      if (yearsElapsed > 0) {
        baselineIncome = baselineIncome * (1 + safeWageGrowth / 100);
      }

      const yearsPromos = promotions.filter(p => parseInt(p.year) === currentYear);
      yearsPromos.forEach(p => {
        baselineIncome = baselineIncome * (1 + p.percent / 100);
        yearData.notes.push(`Promotion: +${p.percent}%`);
      });

      const yearsReductions = reductions.filter(r => parseInt(r.year) === currentYear);
      yearsReductions.forEach(r => {
        baselineIncome = baselineIncome * (1 - r.percent / 100);
        yearData.notes.push(`Income Drop: -${r.percent}%`);
      });

      const activeBreak = breaks.find(b =>
        currentYear >= parseInt(b.startYear) &&
        currentYear < (parseInt(b.startYear) + parseInt(b.duration))
      );

      if (activeBreak) {
        yearData.isBreak = true;
        yearData.taxableIncome = 0;
        yearData.notes.push("Work Break");
      } else {
        yearData.taxableIncome = baselineIncome;
      }

      let currentBalance = balance;
      const yearVoluntary = voluntary
        .filter(v => parseInt(v.year) === currentYear)
        .reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

      yearData.voluntary = yearVoluntary;
      currentBalance = Math.max(0, currentBalance - yearVoluntary);

      yearData.indexation = currentBalance * (safeIndexation / 100);
      currentBalance = currentBalance + yearData.indexation;

      if (!yearData.isBreak) {
        const calculatedCompulsory = calculateCompulsoryRepayment(yearData.taxableIncome);
        yearData.compulsory = Math.min(calculatedCompulsory, currentBalance);
      }

      currentBalance = Math.max(0, currentBalance - yearData.compulsory);
      yearData.endBalance = currentBalance;

      data.push(yearData);

      if (yearData.endBalance <= 0.01) {
        isPaidOff = true;
      }

      balance = yearData.endBalance;
      currentYear++;
      yearsElapsed++;
      yearData.baselineIncome = baselineIncome;
    }

    return data;
  }, [inputs, promotions, reductions, breaks, voluntary]);

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
      indexationRate: 3.0,
      wageGrowth: 3.5,
      firstYear: 2026,
      startingAge: 22
    });
    setPromotions([]);
    setReductions([]);
    setVoluntary([]);
    setBreaks([]);
    setNudge(null);

    // Reset Collapsible States
    setShowVoluntary(true);
    setShowPromotions(true);
    setShowBreaks(true);
    setShowReductions(true);

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
    ...breaks.map(b => ({ type: 'gap-year', icon: '✈️', label: `Gap year ${b.startYear}${parseInt(b.duration) > 1 ? `–${parseInt(b.startYear) + parseInt(b.duration) - 1}` : ''}` })),
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

  // ── Shared: capture card as a PNG File (handles gradient-text swap internally)
  const captureCardAsFile = async () => {
    if (!shareCardRef.current) throw new Error('Card ref not found');
    const headlineEl = shareCardRef.current.querySelector('[data-share-headline]');
    const saved = headlineEl ? {
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
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#111827', scale: 2, useCORS: true, logging: false,
      });
      return await new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
          if (!blob) { reject(new Error('toBlob failed')); return; }
          resolve(new File([blob], 'my-help-loan.png', { type: 'image/png' }));
        }, 'image/png');
      });
    } finally {
      if (headlineEl && saved) {
        headlineEl.style.background = saved.background;
        headlineEl.style.backgroundClip = saved.backgroundClip;
        headlineEl.style.webkitBackgroundClip = saved.webkitBackgroundClip;
        headlineEl.style.webkitTextFillColor = saved.webkitTextFillColor;
        headlineEl.style.color = saved.color;
      }
    }
  };

  // ── Detect mobile devices (gates Web Share API — Windows desktop also supports navigator.share)
  const isMobileDevice = () =>
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document);

  // ── Detect whether the mobile browser can share files
  const canShareFiles = async () => {
    if (!navigator.share || !navigator.canShare) return false;
    try {
      return navigator.canShare({ files: [new File(['t'], 'test.png', { type: 'image/png' })] });
    } catch { return false; }
  };

  // ── Share button handler
  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    try {
      if (isMobileDevice() && navigator.share) {
        // Mobile: use native share sheet
        const filesOk = await canShareFiles();
        if (filesOk) {
          const file = await captureCardAsFile();
          await navigator.share({
            title: 'My HELP Loan Results',
            text: 'See what my degree will actually cost',
            url: generateShareURL(),
            files: [file],
          });
        } else {
          await navigator.share({
            title: 'My HELP Loan Results',
            text: 'See what my degree will actually cost',
            url: generateShareURL(),
          });
        }
      } else {
        // Desktop (or any non-mobile): copy link to clipboard
        const url = generateShareURL();
        try {
          await navigator.clipboard.writeText(url);
        } catch (_) {
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
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share failed:', err);
    } finally {
      setIsSharing(false);
    }
  };

  // ── Save button handler
  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveError(false);
    try {
      if (isMobileDevice() && await canShareFiles()) {
        // Mobile: open native share sheet (user can Save to Photos from there)
        const file = await captureCardAsFile();
        await navigator.share({ files: [file] });
      } else {
        // Desktop (or mobile without file share support): direct download
        const file = await captureCardAsFile();
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my-help-loan.png';
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled share sheet — silently revert
      } else {
        console.error('Save failed:', err);
        setSaveError(true);
        setTimeout(() => setSaveError(false), 2000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const ActionButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      className="btn-3d-primary py-2.5 px-5 text-sm font-bold shadow-lg hover:shadow-xl active:scale-[0.98] w-24 shrink-0"
    >
      <span>{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen font-sans selection:bg-[#0081CB] selection:text-white pb-20 transition-colors duration-500 relative overflow-x-hidden text-white bg-[#0D0D0D]"
      style={{ fontFamily: 'Lato, sans-serif' }}
    >
      {/* GLOBAL NOISE & GRADIENT BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-[#6A3CFF] rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse" style={{ animationDuration: '10s', zIndex: 0 }}></div>
        <div className="absolute bottom-0 right-[10%] w-[600px] h-[600px] bg-[#0081CB] rounded-full mix-blend-screen filter blur-[130px] opacity-20" style={{ zIndex: 0 }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#62FFDA] rounded-full mix-blend-overlay filter blur-[150px] opacity-5" style={{ zIndex: 0 }}></div>
        <div className="absolute inset-0 opacity-10 mix-blend-soft-light bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ zIndex: 0 }}></div>
      </div>

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 border-white/5 bg-[#0D0D0D]/70" data-nosnippet>
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
            <span className="font-bold text-sm md:text-lg tracking-tight uppercase font-['Montserrat']">
              HELP Loan Calculator
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareModal(true)}
              className="btn-soft flex items-center gap-2 text-[#CFCFCF]"
            >
              <ShareIcon size={18} color="#00A3FF" />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider font-['Montserrat']">Share</span>
            </button>

            <button
              onClick={() => setShowHelpModal(true)}
              className="btn-soft flex items-center gap-2 text-[#CFCFCF]"
            >
              <HelpCircle size={18} />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider font-['Montserrat']">Help</span>
            </button>

            <button
              onClick={handleReset}
              className="btn-soft flex items-center gap-2 text-[#CFCFCF]"
            >
              <RotateCcw size={18} />
              <span className="hidden md:inline text-xs font-bold uppercase tracking-wider font-['Montserrat']">Reset</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 app-fade-in">
        {/* SEO: Visually hidden h1 for search engines */}
        <h1 className="sr-only">HELP Loan Calculator | Australian HECS Debt Repayment Calculator</h1>

        {/* LANDING COPY — full-width above both columns on desktop, above inputs on mobile */}
        <p className="col-span-full font-['Lato'] text-[13px] lg:text-[15px] text-[#CFCFCF] mb-0" style={{ lineHeight: '1.6' }}>
          The only HECS calculator that shows how{' '}
          <strong className="font-bold text-white">real life affects your student debt</strong>.{' '}
          Add promotions, gap years, and pay cuts to get the full picture.{' '}
          <span className="font-normal text-[#CFCFCF]/60">Built on official 2025–26 ATO rates.</span>
        </p>

        <div className="col-span-full mb-0">
          <button
            onClick={() => setShowHelpModal(true)}
            className="group inline-flex items-center gap-2 font-['Lato'] text-[13px] font-bold text-[#CFCFCF] cursor-pointer transition-colors"
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
            <span className="text-[#CFCFCF]/50" style={{ fontSize: '14px' }}>›</span>
          </button>
        </div>

        {/* --- LEFT COLUMN (INPUTS) --- */}
        <div className="lg:col-span-4 space-y-6" data-nosnippet>

          <Card className="card-hover">
            <SectionHeader icon={DollarSign} title="The Basics" />

            <InputField
              label="Starting Debt"
              value={inputs.startingDebt}
              onChange={(v) => handleInputChange('startingDebt', v)}
              unit="$"
              nudge={nudge?.field === 'startingDebt' ? nudge : null}
              infoText="The amount you expect to owe on your HELP loan when you finish studying."
            />

            <InputField
              label="Annual Income"
              value={inputs.startingIncome}
              onChange={(v) => handleInputChange('startingIncome', v)}
              unit="$"
              nudge={nudge?.field === 'startingIncome' ? nudge : null}
              infoText="Total income before tax (including fringe benefits, salary sacrifice etc.) Not sure? Use expected total income. More info at ato.gov.au."
            />

            <NeonSlider
              label="Wage Growth"
              value={inputs.wageGrowth}
              onChange={(v) => handleInputChange('wageGrowth', v)}
              min={0}
              max={10}
              step={0.1}
              unit="%"
              color={THEME.colors.mintAccent}
              infoText="Average yearly income increase over life of loan. If unsure, try 3-4%. Use Promotions for bigger jumps."
            />

            <NeonSlider
              label="Indexation"
              value={inputs.indexationRate}
              onChange={(v) => handleInputChange('indexationRate', v)}
              min={0}
              max={10}
              step={0.1}
              unit="%"
              color={THEME.colors.coachViolet}
              infoText="Yearly increase added to your loan on 1 June to account for inflation. Not interest, but it grows your loan if your repayments are low."
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="First Year"
                value={inputs.firstYear}
                onChange={(v) => handleInputChange('firstYear', v)}
                infoText="Year you start your working life after finishing study. The calculator will show how long your debt lasts from that point."
              />
              <InputField
                label="Your Age"
                value={inputs.startingAge}
                onChange={(v) => handleInputChange('startingAge', v)}
                infoText="How old you'll be the year you've finished study and start working. The calculator shows how old you'll be when your debt is gone."
              />
            </div>
          </Card>

          <div className="lg:hidden">
            <HeroSection isDebtFree={isDebtFree} finalYear={finalYear} firstYear={inputs.firstYear} finalAge={finalAge} totalPaid={totalPaid} totalIndexation={totalIndexation} />
          </div>

          <div className="lg:hidden mb-6">
            <ChartSection timelineData={timelineData} breaks={breaks} />
          </div>

          {/* VOLUNTARY REPAYMENTS */}
          <Card mode={mode} className="card-hover" noPadding={true}>
            <button
              onClick={() => setShowVoluntary(!showVoluntary)}
              className="w-full p-6 flex items-center justify-between transition-colors"
              aria-expanded={showVoluntary}
              aria-controls="voluntary-repayments-content"
            >
              <SectionHeader
                icon={Wallet}
                title="Voluntary Repayments"
                infoText="Extra payments you choose to make. These hit your loan before June 1 indexation, which helps to pay it off faster."
              />
              {showVoluntary ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showVoluntary && (
              <div id="voluntary-repayments-content" className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-3 mb-5">
                  <input
                    type="number"
                    placeholder="Year"
                    className="w-20 p-3 rounded-xl text-sm font-mono outline-none input-hud text-white"
                    value={tempVoluntary.year}
                    onChange={(e) => setTempVoluntary({ ...tempVoluntary, year: e.target.value })}
                  />
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="number"
                      placeholder="Amount"
                      className="w-full p-3 rounded-xl text-sm font-mono outline-none input-hud pr-6 text-white"
                      value={tempVoluntary.amount}
                      onChange={(e) => setTempVoluntary({ ...tempVoluntary, amount: e.target.value })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold pointer-events-none">$</span>
                  </div>
                  <ActionButton onClick={() => {
                    if (tempVoluntary.year && tempVoluntary.amount) {
                      setVoluntary([...voluntary, { year: tempVoluntary.year, amount: tempVoluntary.amount }]);
                      setTempVoluntary(prev => ({ ...prev, year: parseInt(prev.year) + 1 }));
                    }
                  }}>Add</ActionButton>
                </div>

                <div className="space-y-3">
                  {voluntary.map((v, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-xl border transition-all animate-in fade-in slide-in-from-left-4 bg-[#1A1A1A]/50 border-white/5">
                      <div className="flex gap-6">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Year</div>
                          <div className="font-mono font-medium">{v.year}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Amount</div>
                          <div className="font-mono font-bold text-[#6A3CFF]">{formatCurrency(v.amount)}</div>
                        </div>
                      </div>
                      <button onClick={() => setVoluntary(voluntary.filter((_, idx) => idx !== i))} className="btn-trash">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* PROMOTIONS */}
          <Card mode={mode} className="card-hover" noPadding={true}>
            <button
              onClick={() => setShowPromotions(!showPromotions)}
              className="w-full p-6 flex items-center justify-between transition-colors"
              aria-expanded={showPromotions}
              aria-controls="promotions-content"
            >
              <SectionHeader
                icon={TrendingUp}
                title="Promotions"
                infoText="Big income jumps in certain years (e.g. 20%). Use this for modelling career steps, job changes, or switching industries."
              />
              {showPromotions ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showPromotions && (
              <div id="promotions-content" className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-3 mb-5">
                  <input
                    type="number"
                    placeholder="Year"
                    className="w-20 p-3 rounded-xl text-sm font-mono outline-none input-hud text-white"
                    value={tempPromo.year}
                    onChange={(e) => setTempPromo({ ...tempPromo, year: e.target.value })}
                  />
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="number"
                      placeholder="%"
                      className="w-full p-3 rounded-xl text-sm font-mono outline-none input-hud pr-6 text-white"
                      value={tempPromo.percent}
                      onChange={(e) => setTempPromo({ ...tempPromo, percent: e.target.value })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold pointer-events-none">%</span>
                  </div>
                  <ActionButton onClick={() => {
                    if (tempPromo.year && tempPromo.percent) {
                      setPromotions([...promotions, { year: tempPromo.year, percent: tempPromo.percent }]);
                      setTempPromo(prev => ({ ...prev, year: parseInt(prev.year) + 1 }));
                    }
                  }}>Add</ActionButton>
                </div>
                <div className="space-y-3">
                  {promotions.map((p, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-xl border transition-all animate-in fade-in slide-in-from-left-4 bg-[#1A1A1A]/50 border-white/5">
                      <div className="flex gap-6">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Year</div>
                          <div className="font-mono font-medium">{p.year}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Increase</div>
                          <div className="font-mono font-bold text-[#62FFDA]">{p.percent}%</div>
                        </div>
                      </div>
                      <button onClick={() => setPromotions(promotions.filter((_, idx) => idx !== i))} className="btn-trash">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* GAP YEARS */}
          <Card mode={mode} className="card-hover" noPadding={true}>
            <button
              onClick={() => setShowBreaks(!showBreaks)}
              className="w-full p-6 flex items-center justify-between transition-colors"
              aria-expanded={showBreaks}
              aria-controls="gap-years-content"
            >
              <SectionHeader
                icon={PauseCircle}
                title="Gap Years / Breaks"
                infoText="Years you're not earning (e.g. travelling, time off, raising kids). Your loan still grows from indexation. Your wage growth kicks back in when you return to work."
              />
              {showBreaks ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showBreaks && (
              <div id="gap-years-content" className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-3 mb-5">
                  <input
                    type="number"
                    placeholder="Start"
                    className="w-20 p-3 rounded-xl text-sm font-mono outline-none input-hud text-white"
                    value={tempBreak.startYear}
                    onChange={(e) => setTempBreak({ ...tempBreak, startYear: e.target.value })}
                  />
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="number"
                      placeholder="#"
                      className="w-full p-3 rounded-xl text-sm font-mono outline-none input-hud pr-10 text-white"
                      value={tempBreak.duration}
                      onChange={(e) => setTempBreak({ ...tempBreak, duration: e.target.value })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold pointer-events-none">
                      {parseInt(tempBreak.duration) === 1 ? 'year' : 'years'}
                    </span>
                  </div>
                  <ActionButton onClick={() => {
                    if (tempBreak.startYear && tempBreak.duration) {
                      setBreaks([...breaks, { startYear: tempBreak.startYear, duration: tempBreak.duration }]);
                      setTempBreak(prev => ({ ...prev, startYear: parseInt(prev.startYear) + parseInt(prev.duration) }));
                    }
                  }}>Add</ActionButton>
                </div>
                <div className="space-y-3">
                  {breaks.map((b, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-xl border transition-all animate-in fade-in slide-in-from-left-4 bg-[#1A1A1A]/50 border-white/5">
                      <div className="flex gap-6">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Start</div>
                          <div className="font-mono font-medium">{b.startYear}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Duration</div>
                          <div className="font-mono font-bold text-white">{b.duration} {parseInt(b.duration) === 1 ? 'year' : 'years'}</div>
                        </div>
                      </div>
                      <button onClick={() => setBreaks(breaks.filter((_, idx) => idx !== i))} className="btn-trash">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* PAY CUTS */}
          <Card mode={mode} className="card-hover" noPadding={true}>
            <button
              onClick={() => setShowReductions(!showReductions)}
              className="w-full p-6 flex items-center justify-between transition-colors"
              aria-expanded={showReductions}
              aria-controls="pay-cuts-content"
            >
              <SectionHeader
                icon={TrendingDown}
                title="Pay Cuts"
                infoText="Income drops in certain years (e.g. going part-time, changing careers). Helps you see how slower earning years affect your payoff time."
              />
              {showReductions ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showReductions && (
              <div id="pay-cuts-content" className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-3 mb-5">
                  <input
                    type="number"
                    placeholder="Year"
                    className="w-20 p-3 rounded-xl text-sm font-mono outline-none input-hud text-white"
                    value={tempReduction.year}
                    onChange={(e) => setTempReduction({ ...tempReduction, year: e.target.value })}
                  />
                  <div className="relative flex-1 min-w-0">
                    <input
                      type="number"
                      placeholder="%"
                      className="w-full p-3 rounded-xl text-sm font-mono outline-none input-hud pr-6 text-white"
                      value={tempReduction.percent}
                      onChange={(e) => setTempReduction({ ...tempReduction, percent: e.target.value })}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-bold pointer-events-none">%</span>
                  </div>
                  <ActionButton onClick={() => {
                    if (tempReduction.year && tempReduction.percent) {
                      setReductions([...reductions, { year: tempReduction.year, percent: tempReduction.percent }]);
                      setTempReduction(prev => ({ ...prev, year: parseInt(prev.year) + 1 }));
                    }
                  }}>Add</ActionButton>
                </div>
                <div className="space-y-3">
                  {reductions.map((r, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 rounded-xl border transition-all animate-in fade-in slide-in-from-left-4 bg-[#1A1A1A]/50 border-white/5">
                      <div className="flex gap-6">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Year</div>
                          <div className="font-mono font-medium">{r.year}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#CFCFCF]">Decrease</div>
                          <div className="font-mono font-bold text-[#FF3366]">{r.percent}%</div>
                        </div>
                      </div>
                      <button onClick={() => setReductions(reductions.filter((_, idx) => idx !== i))} className="btn-trash">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* SHARE BUTTON — mobile only, between Pay Cuts and Year by Year */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowShareModal(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 font-['Montserrat'] font-bold text-sm text-[#CFCFCF] transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,129,203,0.3)'; e.currentTarget.style.background = 'rgba(0,129,203,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <ShareIcon size={16} color="#00A3FF" />
              Share my results
            </button>
          </div>
        </div>

        {/* --- RIGHT COLUMN (OUTPUTS) --- */}
        <div className="lg:col-span-8 space-y-6">

          <div className="hidden lg:block">
            <HeroSection isDebtFree={isDebtFree} finalYear={finalYear} firstYear={inputs.firstYear} finalAge={finalAge} totalPaid={totalPaid} totalIndexation={totalIndexation} />
          </div>

          <div className="hidden lg:block">
            <ChartSection timelineData={timelineData} breaks={breaks} />
          </div>

          {/* SHARE BUTTON — desktop only, between chart and Year by Year */}
          <div className="hidden lg:flex justify-center">
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center gap-2.5 py-3 px-6 font-['Montserrat'] font-bold text-sm text-[#CFCFCF] transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14 }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,129,203,0.3)'; e.currentTarget.style.background = 'rgba(0,129,203,0.05)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
                  <thead className="uppercase text-[9px] sm:text-xs font-['Montserrat'] bg-white/5 text-[#CFCFCF]">
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
                        <td className="px-2 py-3 sm:px-6 sm:py-4 font-bold relative z-10">{row.year}{row.age && <span className="block text-[9px] sm:text-xs font-['Lato'] font-normal opacity-60 text-[#CFCFCF]">{row.age} yo</span>}</td>
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
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#CFCFCF]/60 opacity-70 text-center">Guides</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: '/hecs-repayment-thresholds-2025-26', title: 'HECS Repayment Thresholds 2025-26' },
                { href: '/how-hecs-indexation-works', title: 'How HECS Indexation Works' },
                { href: '/hecs-debt-and-home-loans', title: 'HECS Debt & Home Loans' },
                { href: '/real-cost-of-starting-uni-before-youre-ready', title: 'The Real Cost of Starting Uni Early' },
              ].map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.03] hover:border-[#62FFDA]/30 hover:bg-white/[0.06] transition-all"
                >
                  <BookOpen size={16} className="text-[#0081CB] shrink-0 group-hover:text-[#62FFDA] transition-colors" />
                  <span className="text-sm font-medium text-[#CFCFCF] group-hover:text-white transition-colors font-['Lato']">{guide.title}</span>
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
                          <li><strong className="text-white">HECS-HELP</strong> — for students in Commonwealth Supported Places (CSPs), where the government subsidises part of your tuition. This is the most common loan for undergraduate students at public universities.</li>
                          <li><strong className="text-white">FEE-HELP</strong> — for full fee-paying students who aren't in a CSP. Tuition fees are typically higher because there's no government subsidy.</li>
                          <li><strong className="text-white">SA-HELP</strong> — covers your Student Services and Amenities Fee.</li>
                          <li><strong className="text-white">OS-HELP</strong> — helps with costs when studying overseas on exchange.</li>
                        </ul>
                        <p>All of these loans accumulate into a single HELP debt, repaid through the tax system under the same rules. When people say "HECS debt," they're usually referring to their total HELP debt. This calculator works for all HELP loan types. For the full breakdown of each loan type, visit <a href="https://www.studyassist.gov.au/helping-you-understand/how-student-loans-work" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Study Assist — How Student Loans Work</a>.</p>
                      </>
                    ),
                  },
                  {
                    id: 'faq-2',
                    q: 'When do I start repaying my HECS-HELP debt?',
                    a: (
                      <p>You start making compulsory repayments when your repayment income exceeds <strong className="text-white">$67,000</strong> (2025-26 threshold). Repayment income includes your taxable income, reportable fringe benefits, net investment losses, and reportable super contributions. Repayments are collected automatically through the tax system — your employer withholds them from your pay if you've told them you have a HELP debt. If you earn below the threshold, you don't repay anything that year, but your debt will still be indexed. For more detail on repayment thresholds and how repayment income is calculated, see the <a href="https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">ATO's repayment thresholds and rates page</a>.</p>
                    ),
                  },
                  {
                    id: 'faq-3',
                    q: 'Does HECS-HELP have interest?',
                    a: (
                      <p>No. HECS-HELP loans don't charge interest. However, your debt is <strong className="text-white">indexed</strong> each year on 1 June to maintain its value in line with the cost of living. The indexation rate is the lower of CPI (Consumer Price Index) or WPI (Wage Price Index). In 2025, the rate was 3.2%. While it's not called interest, the effect is similar — your balance grows over time. <Link href="/how-hecs-indexation-works" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Learn more about how indexation works →</Link></p>
                    ),
                  },
                  {
                    id: 'faq-4',
                    q: 'How much will my HECS repayments be?',
                    a: (
                      <p>It depends on your income. Under the 2025-26 marginal system, you pay nothing on income up to $67,000, then 15 cents per dollar over that up to $125,000, increasing through further brackets up to 10% of total income above $179,286. For example, on an $85,000 salary, your annual repayment would be about $2,700. <Link href="/hecs-repayment-thresholds-2025-26" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">See the full breakdown →</Link> or enter your details into the calculator above to get your personalised estimate.</p>
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
                      <p>Yes. HECS-HELP debt is automatically written off upon death and is not passed on to family members or your estate. This is outlined on the <a href="https://www.studyassist.gov.au/managing-and-repaying-your-loan/loan-repayments" target="_blank" rel="noopener noreferrer" className="text-[#0081CB] hover:text-[#62FFDA] transition-colors underline underline-offset-2">Study Assist — loan repayments page</a>.</p>
                    ),
                  },
                ].map((item) => (
                  <div key={item.id} className="rounded-xl border border-white/5 bg-white/[0.03] overflow-hidden">
                    <button
                      onClick={() => setOpenFaqItems(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="w-full p-4 flex items-center justify-between text-left transition-colors hover:bg-white/[0.03]"
                    >
                      <span className="text-sm font-medium text-[#CFCFCF] pr-4 font-['Lato']">{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-[#CFCFCF]/50 shrink-0 transition-transform duration-200 ${openFaqItems[item.id] ? 'rotate-180' : ''}`}
                      />
                    </button>
                    <div className={openFaqItems[item.id] ? 'px-4 pb-4' : 'sr-only'}>
                      <div className="text-sm text-[#CFCFCF]/80 leading-relaxed font-['Lato']">
                        {item.a}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ABOUT THIS CALCULATOR */}
          <div className="text-xs text-center px-4 leading-relaxed max-w-3xl mx-auto space-y-4 font-['Lato'] text-[#CFCFCF]/60">
            <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70">About This Calculator</h4>
            <p>
              This free HELP Loan / HECS Debt calculator estimates how long it will take to pay off your Australian student loan based on your income, wage growth, and indexation rate. Model voluntary repayments, promotions, gap years, and pay cuts to see how real-life events affect your repayment timeline.
            </p>
          </div>

          {/* DISCLAIMER / FOOTER */}
          <div className="text-xs text-center pb-8 px-4 leading-relaxed max-w-3xl mx-auto space-y-4 font-['Lato'] text-[#CFCFCF]/60">
            <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70">DISCLAIMER</h4>
            <p>
              This tool is for educational purposes only. It is not personal financial, legal, or tax advice and does not take into account your individual objectives. The model estimates compulsory repayments using the 2025–26 marginal repayment system and assumes these thresholds remain constant. Actual repayments are determined by the ATO after you lodge your tax return.
            </p>

            <div className="rounded-xl overflow-hidden my-6 max-w-lg mx-auto border glass-dark border-white/5">
              <div className="grid grid-cols-2 text-[10px] font-bold uppercase p-3 border-b border-[#333] bg-white/5">
                <div className="text-left">Repayment Income</div>
                <div className="text-right">Rate / Calculation</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] p-3 border-b border-[#333]">
                <div className="text-left font-mono text-[#CFCFCF]">$0 – $67,000</div>
                <div className="text-right text-[#CFCFCF]">Nil</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] p-3 border-b border-[#333]">
                <div className="text-left font-mono text-[#CFCFCF]">$67,001 – $125,000</div>
                <div className="text-right text-[#CFCFCF]">15c per $1 over $67k</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] p-3 border-b border-[#333]">
                <div className="text-left font-mono text-[#CFCFCF]">$125,001 – $179,285</div>
                <div className="text-right text-[#CFCFCF]">$8,700 + 17c per $1 over $125k</div>
              </div>
              <div className="grid grid-cols-2 text-[11px] p-3">
                <div className="text-left font-mono text-[#CFCFCF]">$179,286+</div>
                <div className="text-right text-[#CFCFCF]">10% of total income</div>
              </div>
            </div>

            <h4 className="font-bold uppercase tracking-widest text-[10px] opacity-70 mt-6">LIMITATION OF LIABILITY</h4>
            <p>
              To the extent permitted by law, we accept no responsibility for any loss arising from reliance on this tool. You should verify figures with the ATO and seek independent professional advice before making decisions.
            </p>

            {/* --- FOOTER (DESKTOP) --- */}
            <div className="hidden md:flex justify-between items-center mt-12 pt-8 border-t border-white/5 text-[10px] uppercase tracking-widest font-['Montserrat'] text-[#CFCFCF]/40">
              <div>
                © 2025 Mitch Bryant · mitchbryant.com
              </div>
              <div>
                TikTok · Instagram: @itsmitchbryant
              </div>
            </div>

            {/* --- FOOTER (MOBILE) --- */}
            <div className="md:hidden flex flex-col gap-2 mt-12 pt-8 border-t border-white/5 text-[10px] uppercase tracking-widest font-['Montserrat'] text-[#CFCFCF]/40 text-center">
              <div>
                © 2025 Mitch Bryant · mitchbryant.com
              </div>
              <div>
                TikTok & Instagram: @itsmitchbryant
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

              <div style={{ position: 'relative', zIndex: 1, padding: '28px 24px 28px' }}>

                {/* Header */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:60ms]"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src="/apple-touch-icon.png" alt="MB Logo" style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover', display: 'block' }} />
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(241,245,249,0.55)', letterSpacing: 0.5, fontFamily: "'Montserrat', sans-serif" }}>HELP Loan Calculator</div>
                  </div>
                  <div style={{ background: 'rgba(98,255,218,0.08)', border: '1px solid rgba(98,255,218,0.2)', color: '#62FFDA', fontSize: 11, fontWeight: 700, padding: '5px 10px', borderRadius: 20, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: "'Montserrat', sans-serif", textAlign: 'center', lineHeight: '1', display: 'inline-flex', alignItems: 'center' }}>2025–26</div>
                </div>

                {/* Headline stat */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:120ms]"
                  style={{ textAlign: 'center', marginBottom: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10, fontFamily: "'Montserrat', sans-serif" }}>Your degree will actually cost</div>
                  <div data-share-headline="true" style={{ fontFamily: 'var(--font-geist-mono, ui-monospace, monospace)', fontSize: 52, fontWeight: 700, background: 'linear-gradient(135deg, #F1F5F9 0%, #00A3FF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1, marginBottom: 12 }}>
                    {isDebtFree ? formatCurrency(totalPaid) : '50+ yrs'}
                  </div>
                  <div style={{ fontSize: 14, color: 'rgba(241,245,249,0.55)', fontFamily: "'Lato', sans-serif" }}>
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
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Debt</div>
                  </div>
                  <div style={{ color: 'rgba(241,245,249,0.35)', fontSize: 16, lineHeight: 1, alignSelf: 'center' }}>+</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#FF4D6A', fontWeight: 700 }}>{formatCurrencyShort(totalIndexation)}</div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Indexation</div>
                  </div>
                  <div style={{ color: 'rgba(241,245,249,0.35)', fontSize: 16, lineHeight: 1, alignSelf: 'center' }}>=</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#F1F5F9' }}>{formatCurrencyShort(totalPaid)}</div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Total paid</div>
                  </div>
                  <div style={{ color: 'rgba(241,245,249,0.35)', fontSize: 11, fontFamily: "'Lato', sans-serif", letterSpacing: 0.5, alignSelf: 'center' }}>over</div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ color: '#F1F5F9' }}>{isDebtFree ? `${timelineData.length} yrs` : '50+ yrs'}</div>
                    <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>Timeline</div>
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
                      <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 7, fontFamily: "'Montserrat', sans-serif", whiteSpace: 'nowrap' }}>{stat.label}</div>
                      <div style={{ fontFamily: 'var(--font-geist-mono, ui-monospace, monospace)', fontSize: 20, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 10, color: 'rgba(241,245,249,0.55)', marginTop: 4 }}>{stat.unit}</div>
                    </div>
                  ))}
                </div>

                {/* Life event pills — only if events exist */}
                {shareLifeEvents.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:300ms]"
                    style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(241,245,249,0.35)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10, fontFamily: "'Montserrat', sans-serif" }}>Life events modelled</div>
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
                          <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 600, color: c.color, fontFamily: "'Lato', sans-serif" }}>
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
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(241,245,249,0.35)', fontFamily: "'Lato', sans-serif" }}>{inputs.firstYear}{inputs.startingAge ? ` · ${inputs.startingAge}yo` : ''}</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#62FFDA', fontFamily: "'Lato', sans-serif" }}>{isDebtFree ? `${finalYear} · Debt free ✓` : 'Not cleared in 50 yrs'}</div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:both] [animation-delay:420ms]"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 12, fontWeight: 600, color: 'rgba(241,245,249,0.35)' }}>
                    Calculate yours →{' '}<span style={{ color: '#00A3FF', fontWeight: 700 }}>helploancalculator.com</span>
                  </div>
                  <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: 'rgba(241,245,249,0.55)' }}>@itsmitchbryant</div>
                </div>

              </div>
            </div>

            {/* ── ACTION BUTTONS ── */}
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {/* Share */}
              <button
                onClick={handleShare}
                disabled={isSharing}
                className="flex-1 flex items-center justify-center gap-2 font-['Montserrat'] font-bold text-[15px] text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #0081CB, #6A3CFF)', border: 'none', borderRadius: 14, padding: '14px 28px', boxShadow: '0 4px 24px rgba(0,129,203,0.3)', cursor: isSharing ? 'wait' : 'pointer', opacity: isSharing ? 0.8 : 1 }}
                onMouseEnter={e => { if (!isSharing) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,129,203,0.45)'; } }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,129,203,0.3)'; }}
              >
                {isLinkCopied ? (
                  <>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Link Copied!
                  </>
                ) : isSharing ? (
                  <>
                    <ShareIcon size={18} color="white" />
                    Sharing…
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
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 font-['Montserrat'] font-bold text-[15px] text-white transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 28px', cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1 }}
                onMouseEnter={e => { if (!isSaving) { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; } }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                {saveError ? (
                  'Something went wrong'
                ) : isSaving ? (
                  'Saving…'
                ) : (
                  <>
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>

            {/* ── TOAST ── */}
            {showToast && (
              <div className="animate-in fade-in duration-200 text-center mt-3 font-['Lato'] font-semibold text-[13px]" style={{ color: 'rgba(241,245,249,0.55)' }}>
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

            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-['Montserrat'] text-white">
              <HelpCircle className="text-[#0081CB]" size={24} />
              How To Use This Calculator
            </h3>

            <div className="space-y-5 text-sm font-['Lato'] text-[#CFCFCF]">
              <div>
                <h4 className="font-bold text-[#0081CB] mb-1 font-['Montserrat']">Step 1: Input Your Financial Data</h4>
                <p>Enter your starting debt, income, growth projections, first year, and age.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#6A3CFF] mb-1 font-['Montserrat']">Step 2: View Projected Summary</h4>
                <p>Review your estimated time to pay off and total costs.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#62FFDA] mb-1 font-['Montserrat']">Step 3: Analyse Repayment Timeline</h4>
                <p>Use the chart to visualise your loan balance changing year by year.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#0081CB] mb-1 font-['Montserrat']">Step 4: Explore Voluntary Contributions</h4>
                <p>Visualise how extra repayments can shorten your timeline.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#6A3CFF] mb-1 font-['Montserrat']">Step 5: Incorporate Life Events</h4>
                <p>Factor in potential income changes or pauses. Use Promotions, Gap Years, and Pay Cuts to see how real life affects your loan.</p>
              </div>
              <div>
                <h4 className="font-bold text-[#62FFDA] mb-1 font-['Montserrat']">Step 6: Review Year By Year Breakdown</h4>
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