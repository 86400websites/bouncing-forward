import type { Metadata } from "next";
import { CompassCheck } from "@/components/assess/compass-check";

export const metadata: Metadata = {
  title: { absolute: "The Compass & Path Check | Free Self-Check" },
  description:
    "Eight questions. A few honest minutes. See which of your four lights are burning bright, which have gone faint — and where you stand on the path.",
  openGraph: {
    title: "The Compass & Path Check | Free Self-Check",
    description:
      "Eight questions. A few honest minutes. See which of your four lights are burning bright, which have gone faint — and where you stand on the path.",
  },
};

/*
 * The Compass & Path Check — three states on one page (Intro → Questions →
 * Results), all owned by the client component per BF-Check-Build-Instructions.
 * No page-level hero: the intro screen is the entry state.
 */

export default function AssessPage() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-16 sm:px-6 lg:px-8 sm:py-20 lg:py-24">
      <CompassCheck />
    </section>
  );
}
