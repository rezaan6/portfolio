import type { Metadata } from "next";

import { EvidenceSection, PageIntro } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Work — Mohammed Rezaan Riyaz",
  description:
    "Four engineering case studies written as decisions: Hobber feature-sliced architecture, Axinom performance and DRM playback, Kodez design system and TDD, and RaSoft first end-to-end ownership.",
};

export default function WorkPage() {
  return (
    <>
      <PageIntro
        num="02"
        label="Work"
        title="Four codebases, written as decisions."
        subtitle="Each follows the same arc — the context, the decision, the trade-off on record, what I measured, the outcome, and what I'd do differently. Tagged by what it demonstrates."
      />
      <EvidenceSection />
    </>
  );
}
