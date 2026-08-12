import type { Metadata } from "next";

import {
  AboutBeyond,
  AboutHero,
  AboutStats,
  ContactSection,
  EducationSection,
  PathSection,
} from "../components/signal-room";

// The years-of-experience figure is derived at render time. Revalidating
// hourly means the number stays correct even if the site isn't redeployed
// for a year — which is exactly the case it exists for.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About — Mohammed Rezaan Riyaz",
  description:
    "Senior Frontend Engineer in the UAE: the career path from intern to lead, education, and what I'm looking for next.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <PathSection />
      <EducationSection />
      <AboutBeyond />
      <ContactSection />
    </>
  );
}
