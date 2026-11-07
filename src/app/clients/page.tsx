import type { Metadata } from "next";

import { ClientsSection, PageIntro } from "../components/signal-room";
import { clientSites } from "../lib/clients";
import { MEASUREMENTS } from "../lib/measurement";

export const metadata: Metadata = {
  title: "Clients — Mohammed Rezaan Riyaz",
  description: `${clientSites.length} live client sites from my work at cr8v — the DAS Holding group across real estate, healthcare, retail, investment and e-commerce, on WordPress, Laravel and Shopify, plus a restaurant site built from scratch in React and TypeScript.`,
};

export default function ClientsPage() {
  return (
    <>
      <PageIntro
        num="03"
        label="Clients"
        title={`${MEASUREMENTS["das-companies"].value} companies, one developer — and every site is live.`}
        subtitle="My client work at cr8v: the DAS Holding group, plus a restaurant site I built from scratch. Each card says what I did as narrowly as I did it, so you can open the site and check. Published with the agency's permission."
      />
      <ClientsSection />
    </>
  );
}
