import Link from 'next/link';

export default function BrandLockup({ className = '' }) {
  return (
    <Link
      href="/"
      className={`brand-lockup ${className}`}
      aria-label="HECS Debt Calculator home"
    >
      <span className="brand-lockup__mark">MB-01</span>
      <span className="brand-lockup__copy">
        <strong>HECS Debt Calculator</strong>
        <small>Financial utility module</small>
      </span>
    </Link>
  );
}
