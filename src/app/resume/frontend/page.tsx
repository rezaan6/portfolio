import type { Metadata } from "next";

import ResumePage from "../resume-client";

// Same reason as /resume: the years figure is derived at render time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume (frontend) — Mohammed Rezaan Riyaz",
  description:
    "Senior Frontend Engineer resume — React, Next.js, TypeScript. Frontend architecture, performance, and design systems. Open to onsite, remote, or relocation.",
};

export default function Page() {
  return <ResumePage variant="frontend" />;
}
