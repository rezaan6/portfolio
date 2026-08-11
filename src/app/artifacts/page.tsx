import type { Metadata } from "next";

import { ArtifactsSection, PageIntro } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Artifacts — Mohammed Rezaan Riyaz",
  description:
    "Six working engineering documents across Hobber, Axinom, and Kodez — an architecture decision record, a component-library API contract, a server/client state model, a performance budget, a test strategy, and a legacy migration plan. Client code and data are kept out.",
};

export default function ArtifactsPage() {
  return (
    <>
      <PageIntro
        num="04"
        label="Artifacts"
        title="The documents behind the decisions."
        subtitle="Six documents — the ones I'd actually hand a new engineer on day one. Open any card to read it in full. Client code and data are kept out."
      />
      <ArtifactsSection />
    </>
  );
}
