import type { Metadata } from "next";

import ResumePage from "./resume-client";

// The years-of-experience figure is derived at render time. Revalidating
// hourly means the number stays correct even if the site isn't redeployed
// for a year — which is exactly the case it exists for.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Resume — Mohammed Rezaan Riyaz",
  description:
    "Senior Web Developer resume — sole developer for a twenty-company holding group's websites on WordPress, Laravel and Shopify, backed by full-stack work in React, Node.js and .NET.",
};

export default function Page() {
  return <ResumePage variant="web-platform" />;
}
