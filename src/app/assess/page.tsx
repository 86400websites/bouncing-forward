import type { Metadata } from "next";
import { QuickLook } from "@/components/assess/quick-look";
import { BeginYourCrossing } from "@/components/site/begin-your-crossing";

export const metadata: Metadata = {
  title: { absolute: "Where’s Here? | Free Two-Minute Check" },
  description:
    "Ten honest statements. About two minutes. No right answers, no timeline, no one keeping score — just a quick, honest look at where you’re standing.",
  openGraph: {
    title: "Where’s Here? | Free Two-Minute Check",
    description:
      "Ten honest statements. About two minutes. No right answers, no timeline, no one keeping score — just a quick, honest look at where you’re standing.",
  },
};

export default function AssessPage() {
  return (
    <main>
      <QuickLook />
      <BeginYourCrossing />
    </main>
  );
}
