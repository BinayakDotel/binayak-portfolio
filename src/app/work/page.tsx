import type { Metadata } from "next";
import { section } from "@/lib/content";
import { WorkList, Section } from "@/components/Sections";

export const metadata: Metadata = {
  title: section("work").label,
  description: section("work").note || undefined,
};

export default function Page() {
  return (
    <div className="wrap">
      <Section id="work" asPage>
        <WorkList />
      </Section>
    </div>
  );
}
