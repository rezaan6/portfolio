import type { Metadata } from "next";

import {
  MethodSection,
  PageIntro,
  PrinciplesSection,
} from "../components/signal-room";

export const metadata: Metadata = {
  title: "Method — Mohammed Rezaan Riyaz",
  description:
    "How I build: the Architect → Build → Harden → Measure loop, and the four calls I make the same way on every codebase.",
};

export default function MethodPage() {
  return (
    <>
      <PageIntro
        num="05"
        label="Method"
        title="How I build — one loop, four rules."
        subtitle="The repeatable process behind every case study, and the calls I make the same way regardless of the codebase."
      />
      <MethodSection />
      <PrinciplesSection />
    </>
  );
}
