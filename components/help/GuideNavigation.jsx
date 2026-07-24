import Link from 'next/link';
import { ArrowUpRight, BookOpen } from 'lucide-react';

const guides = [
  { href: '/hecs-repayment-thresholds-2026-27', title: 'HECS repayment thresholds', detail: 'The 2026–27 marginal rates explained' },
  { href: '/hecs-indexation-2026', title: 'HECS indexation in 2026', detail: 'What the 2.8% rate means for your balance' },
  { href: '/how-hecs-indexation-works', title: 'How HELP indexation works', detail: 'Timing, calculation and common misconceptions' },
  { href: '/hecs-debt-and-home-loans', title: 'HELP debt and home loans', detail: 'How lenders may treat your repayments' },
  { href: '/real-cost-of-starting-uni-before-youre-ready', title: 'The real cost of starting uni early', detail: 'The debt risk of choosing before you are ready' },
  { href: '/hecs-help-vs-fee-help', title: 'HECS-HELP vs FEE-HELP', detail: 'Understand the different loan types' },
  { href: '/help-borrowing-limit', title: 'The HELP borrowing limit', detail: 'The 2026 cap and what counts towards it' },
];

const guideAccents = ['var(--mb-sky)', 'var(--mb-mint)', 'var(--mb-yellow)', 'var(--mb-pink)'];

export default function GuideNavigation() {
  return (
    <section aria-labelledby="guides-title">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="font-impact text-[9px] uppercase tracking-[0.12em] text-[var(--mb-pink)]">Go deeper</p>
          <h2 id="guides-title" className="mt-1 font-anybody text-2xl font-extrabold tracking-[-0.03em] text-[var(--mb-ink)]">Understand what is behind the numbers</h2>
        </div>
        <BookOpen size={22} className="hidden shrink-0 text-[var(--mb-pink)] sm:block" aria-hidden="true" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide, index) => (
          <Link
            key={guide.href}
            href={guide.href}
            className={`mb-colour-card group flex min-h-32 flex-col justify-between rounded-3xl border border-black/15 p-5 transition hover:-translate-y-0.5 hover:border-[var(--mb-ink)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--mb-sky)] ${index === guides.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            style={{ '--card-accent': guideAccents[index % guideAccents.length] }}
          >
            <span className="flex items-start justify-between gap-4">
              <span className="font-impact text-[10px] uppercase leading-relaxed tracking-[0.08em] text-[var(--mb-ink)]">{guide.title}</span>
              <ArrowUpRight size={16} className="shrink-0 text-[var(--mb-mint-deep)] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </span>
            <span className="mt-5 font-instrument text-xs leading-relaxed text-[var(--mb-muted)]">{guide.detail}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
