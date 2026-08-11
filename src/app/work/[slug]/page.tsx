import { notFound } from "next/navigation";

import { CaseDetail } from "../../components/case-detail";
import { caseStudies } from "../../components/signal-room-data";

export function generateStaticParams() {
  return caseStudies.filter((c) => c.slug).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) return { title: "Case study — Mohammed Rezaan Riyaz" };
  return {
    title: `${cs.company} — Mohammed Rezaan Riyaz`,
    description: cs.headline,
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = caseStudies.find((c) => c.slug === slug);
  if (!cs) notFound();
  return <CaseDetail cs={cs} />;
}
