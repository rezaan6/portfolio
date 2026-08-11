import { ImageResponse } from "next/og";

// Generated social-share image for link previews.
export const alt = "Mohammed Rezaan Riyaz — Senior Frontend Engineer";
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
          SENIOR FRONTEND ENGINEER · REACT · NEXT.JS · TYPESCRIPT
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
        <div style={{ fontSize: 34, color: "#9aa0ad", marginTop: 28, maxWidth: 900 }}>
          I architect and optimize web platforms that hold up at scale — from
          the boundaries to the bundle.
        </div>
        <div
          style={{
            marginTop: 48,
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
