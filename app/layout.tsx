import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // 1. Google & Browser Tab
  title: "HELP Loan Calculator | Free HECS Debt Repayment Tool",
  description: "Free Australian HELP Loan & HECS Debt Repayment Calculator. See how long it'll take to pay off your student debt based on your income, wage growth, and indexation.",

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
    title: "HELP Loan Calculator | Free HECS Debt Repayment Tool",
    description: "Free Australian HELP Loan & HECS Debt Repayment Calculator. See how long it'll take to pay off your student debt based on your income, wage growth, and indexation.",
    url: 'https://www.helploancalculator.com',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 992,
        height: 630,
        alt: 'HELP Loan Calculator showing repayment timeline and debt payoff projections',
      }
    ],
  },

  // 4. Verification
  verification: {
    google: "E2_7pPm2FNWOMWOIfQz3U5qpcNcbMLzdshbhOLVyW-s",
  },

  // 5. Favicon
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },

  // 6. Canonical URL
  alternates: {
    canonical: 'https://www.helploancalculator.com',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "HELP Loan Calculator",
              "description": "The #1 Australian HECS-HELP debt calculator. Estimate your loan repayment timeline. See how indexation and life events affect your loan.",
              "url": "https://www.helploancalculator.com",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "AUD"
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-FWVMDBHJFK" />
      </body>
    </html>
  );
}
