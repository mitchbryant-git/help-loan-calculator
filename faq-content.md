# FAQ Content & JSON-LD Schema

## Placement
- Add as a collapsible section on the main calculator page
- Position it between the "About This Calculator" section and the "Disclaimer" section
- Style: collapsible container (like Year By Year Breakdown), with individual accordion items inside (like the Guide cards, with chevrons)

---

## FAQ Content

### 1. What's the difference between HECS and HELP?

HELP (Higher Education Loan Program) is the Australian Government's overarching student loan system. It includes several different loan types:

- **HECS-HELP** — for students in Commonwealth Supported Places (CSPs), where the government subsidises part of your tuition. This is the most common loan for undergraduate students at public universities.
- **FEE-HELP** — for full fee-paying students who aren't in a CSP. Tuition fees are typically higher because there's no government subsidy.
- **SA-HELP** — covers your Student Services and Amenities Fee.
- **OS-HELP** — helps with costs when studying overseas on exchange.

All of these loans accumulate into a single HELP debt, repaid through the tax system under the same rules. When people say "HECS debt," they're usually referring to their total HELP debt. This calculator works for all HELP loan types.

### 2. When do I start repaying my HECS-HELP debt?

You start making compulsory repayments when your repayment income exceeds **$67,000** (2025-26 threshold). Repayment income includes your taxable income, reportable fringe benefits, net investment losses, and reportable super contributions. Repayments are collected automatically through the tax system — your employer withholds them from your pay if you've told them you have a HELP debt. If you earn below the threshold, you don't repay anything that year, but your debt will still be indexed.

### 3. Does HECS-HELP have interest?

No. HECS-HELP loans don't charge interest. However, your debt is **indexed** each year on 1 June to maintain its value in line with the cost of living. The indexation rate is the lower of CPI (Consumer Price Index) or WPI (Wage Price Index). In 2025, the rate was 3.2%. While it's not called interest, the effect is similar — your balance grows over time. [Learn more about how indexation works →](/how-hecs-indexation-works)

### 4. How much will my HECS repayments be?

It depends on your income. Under the 2025-26 marginal system, you pay nothing on income up to $67,000, then 15 cents per dollar over that up to $125,000, increasing through further brackets up to 10% of total income above $179,286. For example, on an $85,000 salary, your annual repayment would be about $2,700. [See the full breakdown →](/hecs-repayment-thresholds-2025-26) or enter your details into the calculator above to get your personalised estimate.

### 5. Does my HECS debt affect my home loan?

It can. Lenders factor your HECS repayments into their borrowing capacity assessments, which can reduce how much you're able to borrow. From September 2025, updated APRA guidance allows banks to exclude HECS repayments if the debt will be fully repaid within 12 months, and some lenders like NAB now disregard debts under $20,000. But for most borrowers, a HECS balance will still reduce borrowing power. [Read more about HECS and home loans →](/hecs-debt-and-home-loans)

### 6. Can I make voluntary repayments to pay off my HECS faster?

Yes. You can make voluntary repayments to the ATO at any time, regardless of your income. There's no longer a discount for doing so (that was removed in 2017), but voluntary repayments directly reduce your balance, which means less indexation is applied each year. You can model the impact of voluntary repayments using this calculator to see how they shorten your repayment timeline.

### 7. How do I check my HECS-HELP balance?

Log in to [myGov](https://my.gov.au), link to the Australian Taxation Office (ATO) if you haven't already, and your HELP debt balance will be visible under your account. You can also see a breakdown of how much has been indexed and how much you've repaid.

### 8. What happens to my HECS debt if I don't finish my degree?

Your debt doesn't disappear. Any HECS-HELP fees that were charged before you withdrew remain on your balance. They'll be indexed every year and you'll repay them through the tax system once your income is above the threshold, whether you have a degree or not. [See what this costs in real terms →](/real-cost-of-starting-uni-before-youre-ready)

### 9. What happens to my HECS debt if I move overseas?

You're still required to repay it. If you move overseas and your worldwide income exceeds the repayment threshold, you must report your income to the ATO and make repayments. The ATO requires Australian residents living abroad to submit an overseas income declaration annually. Non-compliance can result in penalties.

### 10. Is HECS-HELP debt written off when you die?

Yes. HECS-HELP debt is automatically written off upon death and is not passed on to family members or your estate.

---

## JSON-LD FAQ Schema

Add this to the `<head>` of the main calculator page (inside the metadata or via a `<script>` tag in layout.tsx).

```json
{
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
}
```

---

## Claude Code Prompt

Here's what to tell Claude Code:

---

I need you to add two things:

**1. FAQ section on the main calculator page.**

Add a "Frequently Asked Questions" collapsible section between the "About This Calculator" section and the "Disclaimer" section. It should work like the Year By Year Breakdown — a single bar that expands when clicked. Inside that container, display 10 FAQ items as individual accordion cards (similar style to the Guide cards), each with the question as the title and a chevron on the right that rotates when expanded. Clicking a question reveals the answer below it. Multiple questions can be open at the same time.

Here are the 10 FAQs — use the content from the file `faq-content.md` in my project folder. Where the content includes links to guide pages (like /how-hecs-indexation-works), make them clickable. Where it mentions "the calculator above," don't link — just leave it as text.

Style it to match the existing dark theme. Mobile-first. Make sure all FAQ text content is rendered in the DOM even when collapsed (not lazy loaded) so Google can read it for SEO.

**2. FAQ Schema markup.**

Add the JSON-LD FAQPage schema from `faq-content.md` to the page's head/metadata. This is for Google's rich results and should be invisible to users.

Don't change any other sections on the page.

---
