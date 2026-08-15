import type { Metadata } from "next";

import { ArtifactsSection, PageIntro } from "../components/signal-room";

export const metadata: Metadata = {
  title: "Artifacts — Mohammed Rezaan Riyaz",
  description:
    "Nine working engineering documents across Hobber, Axinom, and Kodez — an architecture decision record, a component-library spec, a server/client state model, an incident review, a page-load performance one-pager, a test strategy, an accessibility baseline, an API contract, and a legacy migration plan. Client code and data are kept out.",
};

export default function ArtifactsPage() {
  return (
    <>
      <PageIntro
        num="06"
        label="Artifacts"
        title="The documents behind the decisions."
        subtitle="Nine documents — the ones I'd actually hand a new engineer on day one. Open any card to read it in full. Client code and data are kept out."
      />
      <ArtifactsSection />
    </>
  );
}
