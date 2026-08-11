import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/hecs-debt-calculator',
  assetPrefix: '/hecs-debt-calculator-static',
  async redirects() {
    const legacyHosts = ['helploancalculator.com', 'www.helploancalculator.com'];
    const routeMap = [
      { source: '/', destination: 'https://allthatsnext.com/hecs-debt-calculator' },
      { source: '/robots.txt', destination: 'https://allthatsnext.com/robots.txt' },
      { source: '/sitemap.xml', destination: 'https://allthatsnext.com/sitemap.xml' },
      {
        source: '/hecs-repayment-thresholds-2025-26',
        destination: 'https://allthatsnext.com/hecs-debt-calculator/hecs-repayment-thresholds-2026-27',
      },
      {
        source: '/hecs-debt-calculator',
        destination: 'https://allthatsnext.com/hecs-debt-calculator',
      },
      {
        source: '/hecs-debt-calculator/:path*',
        destination: 'https://allthatsnext.com/hecs-debt-calculator/:path*',
      },
      {
        source: '/:path*',
        destination: 'https://allthatsnext.com/hecs-debt-calculator/:path*',
      },
    ];

    return [
      ...legacyHosts.flatMap((host) =>
        routeMap.map((redirect) => ({
          ...redirect,
          has: [{ type: 'host' as const, value: host }],
          permanent: true as const,
          basePath: false as const,
        })),
      ),
      {
        source: '/hecs-repayment-thresholds-2025-26',
        destination: '/hecs-repayment-thresholds-2026-27',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
