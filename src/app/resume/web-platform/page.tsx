import type { Metadata } from "next";

import ResumePage from "../resume-client";

// Same reason as /resume: the years figure is derived at render time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume (web platform) — Mohammed Rezaan Riyaz",
  description:
    "Senior Web Developer resume — sole developer for a twenty-company holding group's websites on WordPress, Laravel and Shopify, with a frontend engineering record in React, Next.js and TypeScript.",
};

export default function Page() {
  return <ResumePage variant="web-platform" />;
}
