import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "The Book" };

export default function BookPage() {
  return (
    <PageStub
      eyebrow="The Book"
      title="Not another book about moving on."
      line="Most books about loss ask you to accept it and wait for time to help. This one hands you a framework — four elements and four steps — to actively build a life from what's left."
      sprint="sprint 4"
    />
  );
}
