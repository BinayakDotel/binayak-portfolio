import type { Metadata } from "next";
import { section } from "@/lib/content";
import { AskBlock, Section } from "@/components/Sections";

export const metadata: Metadata = {
  title: section("ask").label,
  description: section("ask").note || undefined,
};

export default function Page() {
  return (
    <div className="wrap">
      <Section id="ask" asPage>
        <AskBlock />
      </Section>
    </div>
  );
}
