import type { Metadata } from "next";
import { PageStub } from "@/components/page-stub";

export const metadata: Metadata = { title: "Stories" };

export default function StoriesPage() {
  return (
    <PageStub
      eyebrow="Stories"
      title="Loss doesn't end your story."
      line="It's where you find out what you're building next. Real people — from Cape Town to Rio to Ladakh — who turned devastation into direction."
      sprint="sprint 6"
    />
  );
}
