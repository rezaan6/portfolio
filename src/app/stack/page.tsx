import type { Metadata } from "next";

import { PageIntro, ToolsSection } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Stack — Mohammed Rezaan Riyaz",
  description:
    "The toolkit: React, Next.js, TypeScript, Storybook, TanStack Query, Cypress, AWS and the rest — grouped by what each part is for, with how I actually use it.",
};

// The React entry quotes a length of career, derived from a date rather than
// written down. Today it happens to be evaluated in the browser — the accordion
// body isn't in the server HTML — so it is already current for every visitor.
// The revalidate is here for the day that stops being true: the moment any of
// this prose is server-rendered, a fully static route would bake the number in
// at build time and go quietly stale. Cheap insurance on a page that is
// otherwise pure content.
export const revalidate = 3600;

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
