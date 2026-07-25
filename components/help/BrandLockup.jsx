import Link from 'next/link';

export default function BrandLockup({ className = '' }) {
  return (
    <Link
      href="/"
      className={`brand-lockup ${className}`}
      aria-label="HELP Loan Calculator home"
    >
      <span className="brand-lockup__mark">MB-01</span>
      <span className="brand-lockup__copy">
        <strong>HELP Loan Calculator</strong>
        <small>Financial utility module</small>
      </span>
    </Link>
  );
}
