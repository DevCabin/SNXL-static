import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/collections/:slug",
        destination: "/designs?tag=:slug",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
