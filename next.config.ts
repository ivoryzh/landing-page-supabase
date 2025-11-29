import type { NextConfig } from "next";

const nextConfig: NextConfig = {

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
