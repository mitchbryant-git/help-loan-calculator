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
  title: "HELP Loan Calculator | Visualise Your Debt Free Date",
  description: "Free tool to estimate your HELP repayment timeline. See how voluntary repayments & indexation affect your loan. Built by Mitch Bryant.",

  // 2. SEO Keywords
  keywords: [
    'HELP debt calculator',
    'HECS repayment',
    'ATO loan rates',
    'Australian student loan',
    'student debt calculator',
    'pay off HECS faster'
  ],

  // 3. Social Media Cards (Facebook, LinkedIn, iMessage)
  openGraph: {
    title: "HELP Loan Calculator",
    description: "Stop guessing. See exactly when your HELP loan will be paid off with this free visual tool.",
    url: 'https://www.helploancalculator.com',
    siteName: 'HELP Loan Calculator',
    locale: 'en_AU',
    type: 'website',
  },

  // 4. Verification
  verification: {
    google: "E2_7pPm2FNWOMWOIfQz3U5qpcNcbMLzdshbhOLVyW-s",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-FWVMDBHJFK" />
      </body>
    </html>
  );
}
