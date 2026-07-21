import localFont from "next/font/local";

/**
 * Self-hosted variable fonts (SIL OFL — licenses in src/fonts/).
 * DESIGN.md §4: Archivo = display (use weights 700/800 only),
 * Source Serif 4 = body (use weights 400/600 + italic only).
 * The variable files carry the full axis; the weight *discipline*
 * lives in the type-scale rules, not the file.
 */
export const displayFont = localFont({
  src: "../fonts/archivo-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-display-src",
});

export const bodyFont = localFont({
  src: [
    {
      path: "../fonts/source-serif-4-latin-wght-normal.woff2",
      weight: "200 900",
      style: "normal",
    },
    {
      path: "../fonts/source-serif-4-latin-wght-italic.woff2",
      weight: "200 900",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-body-src",
});
