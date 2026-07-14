import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/hecs-repayment-thresholds-2025-26',
        destination: '/hecs-repayment-thresholds-2026-27',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
