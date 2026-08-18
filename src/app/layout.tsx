import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Manrope,
  Oswald,
  Sora,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import { SiteFrame } from "./components/signal-room";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const headingFont = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

// Signal Room display + label font — Sora: a distinctive, modern geometric
// sans that reads more premium than a default UI font, used for both large
// headlines and the small uppercase eyebrow/nav labels.
const displayFont = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

// Decorative page-index numerals only — Oswald is a condensed display face
// (naturally tall + narrow), used purely for the faded background numbers.
const numeralFont = Oswald({
  variable: "--font-numeral",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
  preload: false,
});

const SITE_URL = "https://rezaanriyaz.com";
const TITLE = "Mohammed Rezaan Riyaz | Senior Frontend Engineer";
// 153 characters, deliberately. The previous version ran to 180 and Google cuts
// a description around 158, so its tail ("Based in the UAE.") was never in a
// search result — but it was in every LinkedIn, Slack and WhatsApp unfurl, which
// is where a recruiter reads this first. Location now states the opening rather
// than the constraint, because a location line with no relocation beside it is
// read as a boundary. One constant, three surfaces: description, openGraph and
// twitter all take it, so it cannot drift between them.
const DESCRIPTION =
  "Senior Frontend Engineer — React, Next.js, TypeScript. Frontend architecture, performance, and design systems. Open to roles worldwide, onsite or remote.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s",
  },
  description: DESCRIPTION,
  applicationName: "Mohammed Rezaan Riyaz",
  authors: [{ name: "Mohammed Rezaan Riyaz", url: SITE_URL }],
  creator: "Mohammed Rezaan Riyaz",
  keywords: [
    "Senior Frontend Engineer",
    "React Developer",
    "Next.js",
    "TypeScript",
    "Frontend Architecture",
    "Design Systems",
    "Web Performance",
    "Mohammed Rezaan Riyaz",
  ],
  alternates: { canonical: SITE_URL },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    siteName: "Mohammed Rezaan Riyaz",
    url: SITE_URL,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} ${displayFont.variable} ${monoFont.variable} ${numeralFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteFrame>{children}</SiteFrame>
        {/* Real-user data, which this site otherwise argues it lacks. The
            Observability panel says the honest gap in my stack was runtime
            signal — lab numbers tell you what you shipped, not what anyone
            experienced — and that the order to fix it in starts with field
            timings. This is that, on the one product I own outright.
            Both are deferred and send nothing until the page is interactive. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
