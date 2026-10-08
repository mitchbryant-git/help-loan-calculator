export default function sitemap() {
    const calculator = 'https://allthatsnext.com/hecs-debt-calculator';
    return [
        {
            url: calculator,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${calculator}/hecs-repayment-thresholds-2026-27`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${calculator}/hecs-indexation-2026`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${calculator}/how-hecs-indexation-works`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${calculator}/hecs-debt-and-home-loans`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${calculator}/real-cost-of-starting-uni-before-youre-ready`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${calculator}/hecs-help-vs-fee-help`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${calculator}/help-borrowing-limit`,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
    ]
}
