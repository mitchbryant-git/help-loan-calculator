"use client";
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea
} from 'recharts';
import {
  Info, RotateCcw, TrendingUp, TrendingDown,
  PauseCircle, DollarSign, Calendar, ChevronDown, ChevronUp, AlertCircle, X, Wallet, HelpCircle, Trash2
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
const ChartSection = ({ mode, timelineData, breaks }) => {
  const [hoveredData, setHoveredData] = useState(null);

  // Stable callback to prevent prop thrashing
  const handleHoverUpdate = useCallback((data) => {
    setHoveredData(data);
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
      className="h-[450px] relative card-hover flex flex-col outline-none ring-0"
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
      <div className="flex-1 w-full min-h-0 relative [&_*]:focus:outline-none [&_*]:focus:ring-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={timelineData}
            margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            onMouseMove={(e) => {
              // No-op or custom logic if needed
            }}
            onMouseLeave={() => {
              setHoveredData(null);
            }}
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
              content={<ChartTooltipSyncer onUpdate={handleHoverUpdate} />}
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
              dot={<CustomDot />}
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
    </Card >
  );
};

const CustomDot = (props) => {
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
};

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
  const percent = ((value - min) / (max - min)) * 100;

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
          {value}{unit}
        </div>
      </div>

      <div className="relative h-6 w-full flex items-center group">
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
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          onMouseDown={() => setIsActive(true)}
          onMouseUp={() => setIsActive(false)}
          onTouchStart={() => setIsActive(true)}
          onTouchEnd={() => setIsActive(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
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
  const [nudge, setNudge] = useState(null);
  const [showHelpModal, setShowHelpModal] = useState(false);

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
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-500 border-white/5 bg-[#0D0D0D]/70">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0081CB] to-[#6A3CFF] flex items-center justify-center text-white font-black text-xl shrink-0 shadow-lg shadow-[#0081CB]/30 border border-white/20">
              M
            </div>
            <span className="font-bold text-sm md:text-lg tracking-tight uppercase font-['Montserrat']">
              HELP Loan Calculator
            </span>
          </div>

          <div className="flex items-center gap-3">
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

        {/* --- LEFT COLUMN (INPUTS) --- */}
        <div className="lg:col-span-4 space-y-6">

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
            >
              <SectionHeader
                icon={Wallet}
                title="Voluntary Repayments"
                infoText="Extra payments you choose to make. These hit your loan before June 1 indexation, which helps to pay it off faster."
              />
              {showVoluntary ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showVoluntary && (
              <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
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
            >
              <SectionHeader
                icon={TrendingUp}
                title="Promotions"
                infoText="Big income jumps in certain years (e.g. 20%). Use this for modelling career steps, job changes, or switching industries."
              />
              {showPromotions ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showPromotions && (
              <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
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
            >
              <SectionHeader
                icon={PauseCircle}
                title="Gap Years / Breaks"
                infoText="Years you're not earning (e.g. travelling, time off, raising kids). Your loan still grows from indexation. Your wage growth kicks back in when you return to work."
              />
              {showBreaks ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showBreaks && (
              <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
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
            >
              <SectionHeader
                icon={TrendingDown}
                title="Pay Cuts"
                infoText="Income drops in certain years (e.g. going part-time, changing careers). Helps you see how slower earning years affect your payoff time."
              />
              {showReductions ? <ChevronUp size={20} className="text-[#CFCFCF]" /> : <ChevronDown size={20} className="text-[#CFCFCF]" />}
            </button>

            {showReductions && (
              <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
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
        </div>

        {/* --- RIGHT COLUMN (OUTPUTS) --- */}
        <div className="lg:col-span-8 space-y-6">

          <div className="hidden lg:block">
            <HeroSection isDebtFree={isDebtFree} finalYear={finalYear} firstYear={inputs.firstYear} finalAge={finalAge} totalPaid={totalPaid} totalIndexation={totalIndexation} />
          </div>

          <div className="hidden lg:block">
            <ChartSection timelineData={timelineData} breaks={breaks} />
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@400;700;900&display=swap');
        
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }

        /* --- GLASS MORPHISM --- */
        .glass-dark {
          background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 18px 45px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.5) inset;
          backdrop-filter: blur(22px);
        }

        /* --- CARD PHYSICS --- */
        .card-hover {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .card-hover:hover {
          transform: translateY(-4px);
          border-color: rgba(98, 255, 218, 0.5); /* Crisp border highlight */
          box-shadow: none; /* Removed fuzzy glow */
        }

        /* --- 3D PRIMARY BUTTON --- */
        .btn-3d-primary {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          background: linear-gradient(145deg, #62FFDA, #0081CB);
          color: #020617;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1), 0 0 0 1px rgba(15,23,42,0.1);
          transform: translateY(0);
          transition: transform 200ms ease, box-shadow 200ms ease, filter 200ms ease;
        }
        .btn-3d-primary::before {
          content: '';
          position: absolute;
          inset: 2px;
          border-radius: inherit;
          background: linear-gradient(145deg, rgba(255,255,255,0.55), rgba(255,255,255,0.05));
          opacity: 0.9;
          pointer-events: none;
        }
        .btn-3d-primary span {
          position: relative;
          z-index: 1;
        }
        .btn-3d-primary:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
          box-shadow: 0 14px 24px rgba(0,129,203,0.55), 0 0 0 1px rgba(15,23,42,0.55);
        }
        .btn-3d-primary:active {
          transform: translateY(1px);
          box-shadow: 0 8px 15px rgba(0,129,203,0.55), 0 0 0 1px rgba(15,23,42,0.8) inset;
        }

        /* --- SOFT BUTTONS --- */
        .btn-soft {
          border-radius: 999px;
          padding: 0.4rem 0.8rem;
          background: rgba(15,23,42,0.5);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 8px 18px rgba(0,0,0,0.75);
          backdrop-filter: blur(14px);
          transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
        }
        .btn-soft:hover {
          background: rgba(15,23,42,0.8);
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.8);
        }
        .btn-soft:active {
          transform: translateY(1px);
          box-shadow: 0 5px 12px rgba(0,0,0,0.9) inset;
        }

        /* --- TRASH BUTTON --- */
        .btn-trash {
          color: #64748b;
          border-radius: 0.5rem;
          padding: 0.5rem;
          transition: all 200ms ease;
          background: transparent;
        }
        .btn-trash:hover {
          color: #FF3366;
          transform: translateY(-2px);
          background: rgba(255, 51, 102, 0.1);
          box-shadow: 0 0 15px rgba(255, 51, 102, 0.4);
        }
        .btn-trash:active {
          transform: translateY(0);
        }

        /* --- HUD INPUTS --- */
        .input-hud {
          border-radius: 0.75rem;
          background: rgba(15,23,42,0.75);
          border: 1px solid rgba(148,163,184,0.4);
          color: #E5E7EB;
          box-shadow: 0 0 0 0 rgba(98,255,218,0);
          transition: box-shadow 160ms ease, border-color 160ms ease, background 160ms ease, transform 80ms ease;
        }
        .input-hud:focus {
          outline: none;
          background: rgba(15,23,42,0.95);
          border-color: rgba(98,255,218,0.9);
          box-shadow: 0 0 0 1px rgba(98,255,218,0.7), 0 0 20px rgba(98,255,218,0.45);
          transform: translateY(-1px);
        }
        
        /* --- SCANLINE TABLE (Fix for shifting columns) --- */
        .scanline-row {
          transition: background-color 0.2s ease;
        }
        .scanline-row:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }
        .scanline-row td:first-child {
          position: relative; /* Ensure positioning context for the bar */
        }
        .scanline-row td:first-child::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: #62FFDA;
          box-shadow: 0 0 10px #62FFDA;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .scanline-row:hover td:first-child::before {
          opacity: 1;
        }

        /* --- ANIMATIONS --- */
        .app-fade-in {
          opacity: 0;
          transform: translateY(8px);
          animation: appFadeIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          animation-delay: 100ms;
        }
        @keyframes appFadeIn {
          to { opacity: 1; transform: translateY(0); }
        }

        .pulse-stat {
          animation: pulseStat 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes pulseStat {
          0% { transform: scale(1); text-shadow: 0 0 0 rgba(98,255,218,0); }
          50% { transform: scale(1.04); text-shadow: 0 0 18px rgba(98,255,218,0.8); }
          100% { transform: scale(1); text-shadow: 0 0 0 rgba(98,255,218,0); }
        }
      `}</style>
    </div>
  );
}