import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "About Maher Kaddoura" };

export default function AboutPage() {
  return (
    <PageStub
      eyebrow="About"
      title="I turned the worst night of my life into the direction for the rest of it."
      line="Bouncing Forward is the book I wish someone had handed me in that hospital corridor in Amman, in January 2008."
      sprint="sprint 7"
    />
  );
}
