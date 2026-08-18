import type { Metadata } from "next";

import {
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
  // "and what I'm looking for next" came out with the Beyond-the-resume section
  // it described. A description promising a section the page no longer has is the
  // kind of drift that outlives every copy edit.
  description:
    "Senior Frontend Engineer: the career path from intern to lead, the numbers behind it, and the education.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <PathSection />
      <EducationSection />
      <ContactSection />
    </>
  );
}
