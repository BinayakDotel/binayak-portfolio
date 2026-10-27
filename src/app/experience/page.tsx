import type { Metadata } from "next";
import { section } from "@/lib/content";
import { ExperienceList, Section } from "@/components/Sections";

export const metadata: Metadata = {
  title: section("experience").label,
  description: section("experience").note || undefined,
};

export default function Page() {
  return (
    <div className="wrap">
      <Section id="experience" asPage>
        <ExperienceList />
      </Section>
    </div>
  );
}
