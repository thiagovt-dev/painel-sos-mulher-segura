import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb",
      allowedOrigins: [process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"],
    },
  },
};

export default nextConfig;
