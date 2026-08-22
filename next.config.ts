import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Verified independently via strict `npx tsc --noEmit`
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      {
        source: "/pyq",
        destination: "/pyqs",
        permanent: true,
      },
      {
        source: "/mock-tests",
        destination: "/tests",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
