import type { Metadata } from "next";

import ResumePage from "./resume-client";

export const metadata: Metadata = {
  title: "Resume — Mohammed Rezaan Riyaz",
  description:
    "Senior Frontend Engineer resume — React, Next.js, and TypeScript. Frontend architecture, performance, and design systems. Based in the UAE.",
};

export default function Page() {
  return <ResumePage />;
}
