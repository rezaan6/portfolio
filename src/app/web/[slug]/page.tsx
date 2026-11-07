import { notFound } from "next/navigation";

import { ContactSection, WebSiteDetail } from "../../components/signal-room";
import { clientSites } from "../../lib/clients";

export function generateStaticParams() {
  return clientSites.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = clientSites.find((s) => s.slug === slug);
  if (!site) return { title: "Web work — Mohammed Rezaan Riyaz" };
  return {
    title: `${site.name} — Web work — Mohammed Rezaan Riyaz`,
    description: `${site.sector} · ${site.platform}. ${site.work[0]}`,
  };
}

export default async function WebSitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = clientSites.find((s) => s.slug === slug);
  if (!site) notFound();

  return (
    <>
      <WebSiteDetail site={site} />
      <ContactSection />
    </>
  );
}
