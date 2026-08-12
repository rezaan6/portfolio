import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every image on this site is local (public/), so no remotePatterns are
    // needed — an unused allowlist is just a widened surface.
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  // Retired routes — keep the old paths working rather than 404ing them.
  async redirects() {
    return [
      { source: "/colophon", destination: "/", permanent: true },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
