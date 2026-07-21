import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = {
  title: "Privacy Policy",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <PageStub
      eyebrow="Legal"
      title="Privacy Policy"
      line="Draft policy arrives for review before launch."
      sprint="sprint 14"
    />
  );
}
