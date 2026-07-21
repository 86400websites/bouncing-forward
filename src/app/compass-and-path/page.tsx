import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "The Compass & The Path" };

export default function CompassAndPathPage() {
  return (
    <PageStub
      eyebrow="The Compass & The Path"
      title="Reading is understanding. Practice is crossing."
      line="A framework you only understand is just an idea. A framework you use becomes a way through — four elements to steady how you're oriented, four steps to move you forward."
      sprint="sprint 5"
    />
  );
}
