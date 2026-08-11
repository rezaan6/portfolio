import type { Metadata } from "next";

import { PageIntro } from "../components/signal-room";
import { ColophonSection } from "../components/colophon";
import { highlightMap } from "../lib/highlight";
import { COLOPHON_SNIPPETS } from "../components/colophon-data";

export const metadata: Metadata = {
  title: "Colophon — Mohammed Rezaan Riyaz",
  description:
    "How this site is built: the architecture decisions, the performance budget, the accessibility floor, and the real numbers — with the source public. A frontend work sample that isn't under NDA.",
};

export default async function ColophonPage() {
  // Every snippet on this page is highlighted here, at build time, and handed
  // to the client as HTML. It's the same decision the page itself describes.
  const highlighted = await highlightMap(COLOPHON_SNIPPETS);

  return (
    <>
      <PageIntro
        num="07"
        label="Colophon"
        title="This site, as a work sample."
        subtitle="Most of my production work is under NDA. This isn't — it's the one codebase I can hand you in full. Here are the decisions behind it, the numbers it actually scores, and the source."
      />
      <ColophonSection highlighted={highlighted} />
    </>
  );
}
