import { ImageResponse } from "next/og";

import { MEASUREMENTS } from "./lib/measurement";

// Generated social-share image for link previews. Every page unfurls with it,
// so it carries both sides of the work — the same two lines as the LinkedIn banner.
export const alt = "Mohammed Rezaan Riyaz | Senior Full-Stack Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0c10",
          color: "#f3f4f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 26, letterSpacing: 4, color: "#6fa8c4" }}>
          SENIOR FULL-STACK ENGINEER
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            marginTop: 28,
            lineHeight: 1.05,
          }}
        >
          Mohammed Rezaan Riyaz
        </div>
        <div style={{ fontSize: 40, color: "#d5d9e2", marginTop: 28, maxWidth: 980 }}>
          {`Enterprise React apps. ${MEASUREMENTS["das-companies"].value} companies' websites.`}
        </div>
        <div style={{ fontSize: 26, color: "#9aa0ad", marginTop: 18 }}>
          React · Next.js · TypeScript · Node.js · .NET · WordPress · Laravel
        </div>
        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 16,
          }}
        >
          {["#0f5271", "#6fa8c4", "#023047", "#14607f", "#02202f"].map((c) => (
            <div
              key={c}
              style={{ width: 56, height: 8, borderRadius: 4, background: c }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
