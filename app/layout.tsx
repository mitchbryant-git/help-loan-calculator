import Script from 'next/script';
import type { Metadata } from "next";
import {
  Anybody,
  Archivo_Black,
  Geist_Mono,
  Instrument_Sans,
} from "next/font/google";
import "./globals.css";

const anybody = Anybody({
  variable: "--font-anybody",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://allthatsnext.com'),
  // 1. Google & Browser Tab
  title: "HECS Debt Calculator Australia | 2026-27 Repayments & Payoff",
  description: "Free Australian HECS debt calculator for HECS-HELP, FEE-HELP and other HELP debts. Model income growth, indexation, career breaks and extra repayments to estimate your payoff path.",

  // 2. SEO Keywords
  keywords: [
    'HELP debt calculator',
    'HECS repayment',
    'HECS debt',
    'ATO loan rates',
    'Australian student loan',
    'student debt calculator',
    'pay off HECS faster'
  ],

  // 3. Social Media Cards (Facebook, LinkedIn, iMessage)
  openGraph: {
    title: "HECS Debt Calculator Australia | All That’s Next",
    description: "See how HECS-HELP, FEE-HELP and other HELP debt could move over time. Test income growth, indexation, career breaks and extra repayments.",
    url: 'https://allthatsnext.com/hecs-debt-calculator',
    siteName: 'All That’s Next',
    locale: 'en_AU',
    type: 'website',
    images: [{
      url: '/hecs-debt-calculator/brand/help/mb01-hecs-debt-loaded-hero-v1.jpg',
      alt: 'MB-01 Life Console with the mint HECS Debt Calculator cartridge inserted',
    }],
  },

  // 4. Verification
  verification: {
    google: "E2_7pPm2FNWOMWOIfQz3U5qpcNcbMLzdshbhOLVyW-s",
  },

  // 5. Favicon
  icons: {
    icon: 'https://allthatsnext.com/favicon-atn-cream-v1.png',
  },

  // 6. Canonical URL
  alternates: {
    canonical: 'https://allthatsnext.com/hecs-debt-calculator',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${anybody.variable} ${archivoBlack.variable} ${instrumentSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=G-FWVMDBHJFK`}
        />
        <Script
          id="ga-script"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              var cleanReferrer = '';
              if (document.referrer) {
                try {
                  var referrerUrl = new URL(document.referrer);
                  cleanReferrer = referrerUrl.origin + referrerUrl.pathname;
                } catch (error) {
                  cleanReferrer = '';
                }
              }
              gtag('config', 'G-FWVMDBHJFK', {
                page_location: window.location.origin + window.location.pathname,
                page_referrer: cleanReferrer
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
