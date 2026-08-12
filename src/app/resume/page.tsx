import type { Metadata } from "next";

import ResumePage from "./resume-client";

// The years-of-experience figure is derived at render time. Revalidating
// hourly means the number stays correct even if the site isn't redeployed
// for a year — which is exactly the case it exists for.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume — Mohammed Rezaan Riyaz",
  description:
    "Senior Frontend Engineer resume — React, Next.js, and TypeScript. Frontend architecture, performance, and design systems. Based in the UAE.",
};

export default function Page() {
  return <ResumePage />;
}
