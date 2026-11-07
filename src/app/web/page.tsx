import type { Metadata } from "next";

import {
  ContactSection,
  PageIntro,
  WebCapabilitiesSection,
  WebCaseStudiesSection,
  WebProcessSection,
  WebProofSection,
  WebSitesSection,
  WebStackSection,
} from "../components/signal-room";
import { clientSites } from "../lib/clients";
import { MEASUREMENTS } from "../lib/measurement";

// The years figure in the proof strip is derived at render time, as on /resume.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Web work — Mohammed Rezaan Riyaz",
  description: `Sole web developer for the DAS Holding group: ${MEASUREMENTS["das-companies"].value} companies' websites on WordPress, Laravel and Shopify, in English and Arabic — ${clientSites.length} live sites, each with what I did on it.`,
};

export default function WebPage() {
  return (
    <>
      <PageIntro
        num="03"
        label="Web work"
        title={`${MEASUREMENTS["das-companies"].value} companies' websites, one developer.`}
        subtitle="I'm the sole developer for the DAS Holding group at cr8v — real estate, healthcare, retail, investment, transport and e-commerce, in English and Arabic. Every site here is live, and every line comes from my work log. Published with the agency's permission."
      />
      <WebProofSection />
      <WebCapabilitiesSection />
      <WebCaseStudiesSection />
      <WebProcessSection />
      <WebSitesSection />
      <WebStackSection />
      <ContactSection />
    </>
  );
}
