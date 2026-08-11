import type { Metadata } from "next";

import { PageIntro, ProjectsSection } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Projects — Mohammed Rezaan Riyaz",
  description:
    "Personal and open-source builds: React, Next.js, and TypeScript applications spanning AI tooling, dashboards, streaming, and web scraping — plus the earlier C# desktop work.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        num="03"
        label="Projects"
        title="Side builds, and what each one was for."
        subtitle="Three side builds from 2023, each one aimed at a specific unknown — an out-of-band job queue, a split client/API deployment, and where dashboard state actually belongs. Source and live demos on every card."
      />
      <ProjectsSection />
    </>
  );
}
