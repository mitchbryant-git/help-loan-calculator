import Link from 'next/link';
import { ArrowLeft, ExternalLink, LockKeyhole } from 'lucide-react';

import GuideSiteHeader from '../../components/help/GuideSiteHeader';

export const metadata = {
  title: 'Privacy Policy | HELP Loan Calculator',
  description: 'How helploancalculator.com handles calculator inputs, shared plans, analytics and standard website data.',
  alternates: {
    canonical: 'https://www.helploancalculator.com/privacy-policy',
  },
  robots: {
    index: false,
    follow: false,
  },
};

const sections = [
  {
    title: 'Calculator inputs',
    body: (
      <>
        <p>
          The calculator runs in your browser. Debt, income, age, assumptions and optional events are used on your device to generate the estimate. There are no accounts and the site does not save those figures to an application database.
        </p>
        <p>
          Saving a result image is also completed in your browser. The image is generated locally and downloaded to your device.
        </p>
      </>
    ),
  },
  {
    title: 'Shared plan links',
    body: (
      <>
        <p>
          When you choose to share a plan, the current figures and optional events are encoded in the fragment at the end of the link. The fragment begins with <code>#plan?</code> and is not included in an ordinary request to the website server.
        </p>
        <p>
          Anyone with the complete link can read those figures by opening it in the calculator. The link may remain in messages, cloud clipboard history or any other service you use to send it. Share it only with people you intend to receive the figures.
        </p>
      </>
    ),
  },
  {
    title: 'Analytics',
    body: (
      <>
        <p>
          Google Analytics is used to understand general usage such as page views, device and browser type, approximate region, referring page and session activity. It may use cookies or similar identifiers. Advertising features are not intentionally used.
        </p>
        <p>
          Analytics is configured to receive only the clean page origin and path as the page location. Calculator query strings and shared-plan fragments are excluded from that page location.
        </p>
        <p>
          You can learn about Google&apos;s handling of Analytics data in the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
            Google privacy policy <ExternalLink size={13} aria-hidden="true" />
          </a>
          {' '}or use the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics opt-out add-on <ExternalLink size={13} aria-hidden="true" />
          </a>.
        </p>
      </>
    ),
  },
  {
    title: 'Hosting and external services',
    body: (
      <>
        <p>
          The site is hosted on Vercel. Like most hosting providers, Vercel may process standard request information needed to deliver and protect the site, such as IP address, browser headers, requested page and request timing.
        </p>
        <p>
          The brand typefaces are packaged with the application and served with the site. The browser does not need to contact Google Fonts to display them.
        </p>
        <p>
          Links to services such as the ATO, Study Assist, myGov and mitchbryant.com are governed by those sites&apos; own privacy practices once you leave this website.
        </p>
      </>
    ),
  },
  {
    title: 'People under 18',
    body: (
      <p>
        This calculator is designed to be understandable for younger people as well as adults. It does not ask for a name, account or contact details. People under 18 should avoid putting identifying information into messages when sharing a plan link.
      </p>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--mb-cream)] pb-20 text-[var(--mb-ink)]">
      <GuideSiteHeader />

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
        <Link href="/" className="privacy-back-link">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <article className="privacy-card">
          <header className="privacy-card__hero">
            <span className="privacy-card__icon" aria-hidden="true">
              <LockKeyhole size={23} />
            </span>
            <div>
              <p>MB-01 · Privacy file</p>
              <h1>Privacy policy</h1>
              <span>Last updated 25 July 2026</span>
            </div>
          </header>

          <div className="privacy-summary">
            <strong>The short version</strong>
            <p>
              Your calculator figures stay in your browser unless you deliberately create and send a shared plan link. The site uses standard website analytics, but the page location sent to Analytics is stripped of calculator values.
            </p>
          </div>

          <div className="privacy-sections">
            {sections.map((section, index) => (
              <section key={section.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h2>{section.title}</h2>
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          <footer className="privacy-card__footer">
            <div>
              <strong>Questions or corrections?</strong>
              <span>Email Mitch if something here is unclear or no longer accurate.</span>
            </div>
            <a href="mailto:hello@mitchbryant.com">hello@mitchbryant.com</a>
          </footer>
        </article>
      </main>
    </div>
  );
}
