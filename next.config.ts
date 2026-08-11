import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Every image on this site is local (public/), so no remotePatterns are
    // needed — an unused allowlist is just a widened surface.
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  // /method was folded into /about; keep the old path working.
  async redirects() {
    return [{ source: "/method", destination: "/about", permanent: true }];
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
