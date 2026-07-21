import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "The Compass & Path Check" };

export default function AssessPage() {
  return (
    <PageStub
      eyebrow="Assess · The Compass & Path Check"
      title="Which lights are burning bright — and which have gone faint?"
      line="An honest, two-minute check across the eight dimensions of the Bouncing Forward framework. 8 questions · about 2 minutes · honest, not graded."
      sprint="sprint 9"
    />
  );
}
