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
      // The web-platform work lives on the cr8v case study now; its earlier
      // addresses still land there.
      { source: "/web", destination: "/work/cr8v", permanent: true },
      { source: "/web/:slug", destination: "/work/cr8v", permanent: true },
      { source: "/clients", destination: "/work/cr8v", permanent: true },
      // The web platform résumé became the default at /resume.
      { source: "/resume/web-platform", destination: "/resume", permanent: true },
      { source: "/resume-web-platform.pdf", destination: "/resume.pdf", permanent: true },
      { source: "/resume-web-platform-a4.pdf", destination: "/resume-a4.pdf", permanent: true },
      // The second résumé was the frontend version until it became full-stack.
      { source: "/resume/frontend", destination: "/resume/full-stack", permanent: true },
      { source: "/resume-frontend.pdf", destination: "/resume-full-stack.pdf", permanent: true },
      { source: "/resume-frontend-a4.pdf", destination: "/resume-full-stack-a4.pdf", permanent: true },
    ];
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
