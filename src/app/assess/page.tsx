import type { Metadata } from "next";
import { QuickLook } from "@/components/assess/quick-look";

export const metadata: Metadata = {
  title: { absolute: "Where’s Here? — The Quick Look | Bouncing Forward" },
  description:
    "Ten honest statements. About two minutes. No right answers, no timeline, no one keeping score — just a quick, honest look at where you’re standing.",
  openGraph: {
    title: "Where’s Here? — The Quick Look | Bouncing Forward",
    description:
      "Ten honest statements. About two minutes. No right answers, no timeline, no one keeping score — just a quick, honest look at where you’re standing.",
  },
};

export default function AssessPage() {
  return <QuickLook />;
}
