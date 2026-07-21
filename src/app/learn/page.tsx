import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "Learn" };

export default function LearnPage() {
  return (
    <PageStub
      eyebrow="Learn"
      title="Three ways into the framework."
      line="The book gives you the compass and the path. This is where you go deeper — a guided course, honest conversations, and short notes to read on the hard mornings."
      sprint="sprint 7"
    />
  );
}
