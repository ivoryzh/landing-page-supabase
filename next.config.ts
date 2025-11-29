import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eaarfpxmxyhxndlsvgkd.supabase.co",
      },
    ],
  },
};

export default nextConfig;
