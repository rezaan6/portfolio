import type { Metadata } from "next";

import ResumePage from "../resume-client";

// Same reason as /resume: the years figure is derived at render time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume (full-stack) | Mohammed Rezaan Riyaz",
  description:
    "Senior Full-Stack Engineer resume: React, Next.js and TypeScript over Node.js, .NET and Laravel backends. Open to onsite, remote, or relocation.",
};

export default function Page() {
  return <ResumePage variant="full-stack" />;
}
