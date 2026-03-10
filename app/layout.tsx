import { GoogleAnalytics } from '@next/third-parties/google'
import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Lato } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  // 1. Google & Browser Tab
  title: "HECS-HELP Repayment Calculator 2025-26 | Free Student Debt Tool",
  description: "Free Australian HECS-HELP and FEE-HELP repayment calculator. Model promotions, gap years, pay cuts, and voluntary repayments to see how real life affects your student debt. Built on official 2025-26 ATO rates.",

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
    title: "HECS-HELP Repayment Calculator 2025-26 | Free Student Debt Tool",
    description: "Free Australian HECS-HELP and FEE-HELP repayment calculator. Model promotions, gap years, pay cuts, and voluntary repayments to see how real life affects your student debt. Built on official 2025-26 ATO rates.",
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
                    "text": "You start making compulsory repayments when your repayment income exceeds $67,000 (2025-26 threshold). Repayment income includes your taxable income, reportable fringe benefits, net investment losses, and reportable super contributions. Repayments are collected automatically through the tax system. If you earn below the threshold, you don't repay anything that year, but your debt will still be indexed."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does HECS-HELP have interest?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. HECS-HELP loans don't charge interest. However, your debt is indexed each year on 1 June to maintain its value in line with the cost of living. The indexation rate is the lower of CPI (Consumer Price Index) or WPI (Wage Price Index). In 2025, the rate was 3.2%. While it's not called interest, the effect is similar — your balance grows over time."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much will my HECS repayments be?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It depends on your income. Under the 2025-26 marginal system, you pay nothing on income up to $67,000, then 15 cents per dollar over that up to $125,000, increasing through further brackets up to 10% of total income above $179,286. For example, on an $85,000 salary, your annual repayment would be about $2,700."
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
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${lato.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-FWVMDBHJFK" />
      </body>
    </html>
  );
}
