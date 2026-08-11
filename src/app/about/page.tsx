import type { Metadata } from "next";

import {
  AboutBeyond,
  AboutHero,
  AboutStats,
  PathSection,
  PrinciplesSection,
  ToolsSection,
  ContactSection,
} from "../components/signal-room";

export const metadata: Metadata = {
  title: "About — Mohammed Rezaan Riyaz",
  description:
    "Senior Frontend Engineer in the UAE: the career path, engineering principles, the stack I build with, and how to get in touch.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <PathSection />
      <PrinciplesSection />
      <ToolsSection />
      <AboutBeyond />
      <ContactSection />
    </>
  );
}
