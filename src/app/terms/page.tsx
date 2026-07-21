import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = {
  title: "Terms of Use",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <PageStub
      eyebrow="Legal"
      title="Terms of Use"
      line="Draft terms arrive for review before launch."
      sprint="sprint 14"
    />
  );
}
