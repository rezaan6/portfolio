import type { Metadata } from "next";

import { PageIntro, ToolsSection } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Stack — Mohammed Rezaan Riyaz",
  description:
    "The toolkit: React, Next.js, TypeScript, Storybook, TanStack Query, Cypress, AWS and the rest — grouped by what each part is for, with how I actually use it.",
};

export default function StackPage() {
  return (
    <>
      <PageIntro
        num="04"
        label="Stack"
        title="What I build with, and how I actually use it."
        subtitle="Grouped by what each part is for rather than listed alphabetically. Open any one to see how it shows up in real work — the craft below is what moves it."
      />
      <ToolsSection />
    </>
  );
}
