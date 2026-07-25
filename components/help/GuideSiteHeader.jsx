import BrandLockup from './BrandLockup';

export default function GuideSiteHeader() {
  return (
    <header className="guide-site-header" data-nosnippet>
      <div className="guide-site-header__inner">
        <BrandLockup />
        <span className="guide-site-header__status">
          <i aria-hidden="true" />
          2026–27 settings
        </span>
      </div>
    </header>
  );
}
