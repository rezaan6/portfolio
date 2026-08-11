import type { Metadata } from "next";

import { MethodSection, PageIntro } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Method — Mohammed Rezaan Riyaz",
  description:
    "The repeatable engineering loop behind the work: draw the boundaries, compose from the design system, prove it with tests, then profile and optimize.",
};

export default function MethodPage() {
  return (
    <>
      <PageIntro
        num="03"
        label="Method"
        title="An engineering loop, not a bag of tricks."
        subtitle="The repeatable process behind every case study — the portable part that comes with me into any codebase."
      />
      <MethodSection />
    </>
  );
}
