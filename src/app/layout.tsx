import type { Metadata } from "next";
import {
  Inter,
  JetBrains_Mono,
  Manrope,
  Oswald,
  Sora,
} from "next/font/google";
import "./globals.css";
import { SiteFrame } from "./components/signal-room";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const headingFont = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
});

const SITE_URL = "https://rezaanriyaz.com";
const TITLE = "Mohammed Rezaan Riyaz | Senior Frontend Engineer";
const DESCRIPTION =
  "Senior Frontend Engineer specializing in React, Next.js, and TypeScript — frontend architecture, performance, and design systems. Portfolio, projects, and resume. Based in the UAE.";

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
    "UAE",
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
      </body>
    </html>
  );
}
