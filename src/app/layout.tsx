import type { Metadata } from "next";
import "./globals.css";
import { bodyFont, displayFont } from "@/lib/fonts";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { PageFoot } from "@/components/site/page-foot";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bouncing Forward | Grief Doesn’t Get the Last Word",
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "A compass and a path for life after loss. The 4-Element Compass and 4-Step Path — built from a real story, for anyone facing their hardest chapter.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Bouncing Forward | Grief Doesn’t Get the Last Word",
    description:
      "A compass and a path for life after loss. The 4-Element Compass and 4-Step Path — built from a real story, for anyone facing their hardest chapter.",
    images: [{ url: "/assets/book/cover-3d.jpeg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to content
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <PageFoot />
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
