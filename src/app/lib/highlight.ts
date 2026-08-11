import "server-only";

import { createHighlighter, type Highlighter } from "shiki";

/* ------------------------------------------------------------------ *
 * Build-time syntax highlighting.
 *
 * Shiki runs here, in server components only, and the result is handed
 * to the client as pre-rendered HTML. That means the highlighter — the
 * grammars, the themes, the whole ~1MB of it — never reaches the
 * browser: the code blocks cost exactly the bytes of their own markup.
 * The alternative (highlighting on the client) would ship a megabyte of
 * tokenizer to render text that is known at build time.
 *
 * Two themes are rendered at once via Shiki's dual-theme output, so the
 * light/dark toggle is a CSS variable swap with no re-highlighting and
 * no flash. See `.shiki` in globals.css.
 * ------------------------------------------------------------------ */

export const CODE_THEMES = {
  light: "github-light",
  dark: "github-dark-default",
} as const;

const LANGS = ["tsx", "typescript", "javascript", "bash", "json", "css"] as const;
export type CodeLang = (typeof LANGS)[number];

// One highlighter per process, reused across every page render.
let highlighterPromise: Promise<Highlighter> | null = null;

const getHighlighter = () => {
  highlighterPromise ??= createHighlighter({
    themes: Object.values(CODE_THEMES),
    langs: [...LANGS],
  });
  return highlighterPromise;
};

/** Highlight one snippet to standalone HTML. */
export async function highlightCode(code: string, lang: CodeLang = "tsx") {
  const highlighter = await getHighlighter();
  return highlighter.codeToHtml(code.trim(), {
    lang,
    themes: CODE_THEMES,
    defaultColor: false,
    colorReplacements: { "#fff": "transparent", "#ffffff": "transparent" },
  });
}

/**
 * Highlight a keyed map of snippets in one pass. Returns a plain
 * `Record<key, html>` that is safe to pass across the server/client
 * boundary as a prop.
 */
export async function highlightMap(
  snippets: Record<string, { code: string; lang?: CodeLang }>,
): Promise<Record<string, string>> {
  const entries = await Promise.all(
    Object.entries(snippets).map(
      async ([key, { code, lang }]) =>
        [key, await highlightCode(code, lang ?? "tsx")] as const,
    ),
  );
  return Object.fromEntries(entries);
}
