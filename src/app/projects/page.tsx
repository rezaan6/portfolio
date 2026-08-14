import type { Metadata } from "next";

import { PageIntro, ProjectsSection } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Projects — Mohammed Rezaan Riyaz",
  description:
    "This site as a work sample — Server Components, build-time highlighting, incremental static regeneration — plus personal and open-source builds in React, Next.js and TypeScript spanning AI tooling, dashboards, streaming and web scraping.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageIntro
        num="03"
        label="Projects"
        title="The code you can read, and what each build was for."
        subtitle="This site first — source public, because my production work is under NDA. Then three side builds from 2023, each aimed at a specific unknown: an out-of-band job queue, a split client/API deployment, and where dashboard state actually belongs. Source, live demo and screenshots on every card."
      />
      <ProjectsSection />
    </>
  );
}
