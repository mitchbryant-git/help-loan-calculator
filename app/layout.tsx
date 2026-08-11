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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "HECS Debt Calculator",
              "description": "A free Australian HECS-HELP and FEE-HELP calculator for estimating repayment timelines and testing how indexation and life events could affect a HELP balance.",
              "url": "https://allthatsnext.com/hecs-debt-calculator",
              "applicationCategory": "FinanceApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "AUD"
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What's the difference between HECS and HELP?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "HELP (Higher Education Loan Program) is the Australian Government's overarching student loan system. It includes HECS-HELP for Commonwealth Supported students, FEE-HELP for full fee-paying students, SA-HELP for student services fees, and OS-HELP for studying overseas. All these loans accumulate into a single HELP debt, repaid through the tax system under the same rules. When people say 'HECS debt,' they're usually referring to their total HELP debt."
                  }
                },
                {
                  "@type": "Question",
                  "name": "When do I start repaying my HECS-HELP debt?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You start making compulsory repayments when your repayment income exceeds $69,528. Repayment income includes your taxable income, reportable fringe benefits, net investment losses, and reportable super contributions. Repayments are collected automatically through the tax system: your employer withholds them from your pay if you've told them you have a HELP debt. If you earn below the threshold, you don't repay anything that year, but your debt will still be indexed. For more detail on repayment thresholds and how repayment income is calculated, see the ATO's repayment thresholds and rates page."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does HECS-HELP have interest?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. HECS-HELP loans don't charge interest. However, your debt is indexed each year on 1 June to maintain its value in line with the cost of living. The indexation rate is the lower of CPI (Consumer Price Index) or WPI (Wage Price Index). In 2026, the rate was 2.8%, the lowest since 2021. While it's not called interest, the effect is similar: your balance grows over time. Learn more about how indexation works."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much will my HECS repayments be?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It depends on your income. Under the 2026-27 marginal system, you pay nothing on income up to $69,528, then 15 cents per dollar over that up to $129,717, increasing through further brackets up to 10% of total income above $186,050. For example, on an $85,000 salary, your annual repayment would be about $2,321. See the full breakdown, or enter your details into the calculator above to get your personalised estimate."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does my HECS debt affect my home loan?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It can. Lenders factor your HECS repayments into their borrowing capacity assessments, which can reduce how much you're able to borrow. From September 2025, updated APRA guidance allows banks to exclude HECS repayments if the debt will be fully repaid within 12 months, and some lenders like NAB now disregard debts under $20,000. But for most borrowers, a HECS balance will still reduce borrowing power."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I make voluntary repayments to pay off my HECS faster?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. You can make voluntary repayments to the ATO at any time, regardless of your income. There's no longer a discount for doing so (that was removed in 2017), but voluntary repayments directly reduce your balance, which means less indexation is applied each year."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How do I check my HECS-HELP balance?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Log in to myGov (my.gov.au), link to the Australian Taxation Office (ATO) if you haven't already, and your HELP debt balance will be visible under your account. You can also see a breakdown of how much has been indexed and how much you've repaid."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What happens to my HECS debt if I don't finish my degree?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Your debt doesn't disappear. Any HECS-HELP fees that were charged before you withdrew remain on your balance. They'll be indexed every year and you'll repay them through the tax system once your income is above the threshold, whether you have a degree or not."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What happens to my HECS debt if I move overseas?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You're still required to repay it. If you move overseas and your worldwide income exceeds the repayment threshold, you must report your income to the ATO and make repayments. The ATO requires Australian residents living abroad to submit an overseas income declaration annually. Non-compliance can result in penalties."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is HECS-HELP debt written off when you die?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. HECS-HELP debt is automatically written off upon death and is not passed on to family members or your estate."
                  }
                }
              ]
            })
          }}
        />
      </head>
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
